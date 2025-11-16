import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db/prisma";
import { rateLimit } from "@/lib/api/rateLimit";
import { successResponse, handleApiError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/authorization";

const limiter = rateLimit({ maxRequests: 50, windowMs: 60000 });

type DocumentType = "W2" | "MISC" | "NEC" | "INT" | "DIV" | "SCHEDULE_C" | "RECEIPT" | "INVOICE" | "STATEMENT" | "ID" | "OTHER";

/**
 * Mock AI Document Classification
 * Analyzes filename to determine document type with confidence score
 */
function classifyDocument(fileName: string): {
  documentType: DocumentType;
  confidence: number;
} {
  const lowerFileName = fileName.toLowerCase();

  // W2 Forms
  if (lowerFileName.includes("w2") || lowerFileName.includes("w-2")) {
    return { documentType: "W2", confidence: 0.95 };
  }

  // 1099 Forms - check for specific types
  if (lowerFileName.includes("1099-misc") || lowerFileName.includes("1099_misc")) {
    return { documentType: "MISC", confidence: 0.95 };
  }
  if (lowerFileName.includes("1099-nec") || lowerFileName.includes("1099_nec")) {
    return { documentType: "NEC", confidence: 0.95 };
  }
  if (lowerFileName.includes("1099-int") || lowerFileName.includes("1099_int")) {
    return { documentType: "INT", confidence: 0.95 };
  }
  if (lowerFileName.includes("1099-div") || lowerFileName.includes("1099_div")) {
    return { documentType: "DIV", confidence: 0.95 };
  }
  if (lowerFileName.includes("1099")) {
    // Generic 1099, default to MISC
    return { documentType: "MISC", confidence: 0.85 };
  }

  // Schedule C
  if (
    lowerFileName.includes("schedule c") ||
    lowerFileName.includes("schedulec") ||
    lowerFileName.includes("schedule_c")
  ) {
    return { documentType: "SCHEDULE_C", confidence: 0.9 };
  }

  // Receipts
  if (lowerFileName.includes("receipt") || lowerFileName.includes("expense")) {
    return { documentType: "RECEIPT", confidence: 0.85 };
  }

  // Invoices
  if (lowerFileName.includes("invoice")) {
    return { documentType: "INVOICE", confidence: 0.85 };
  }

  // Bank/Financial Statements
  if (
    lowerFileName.includes("bank") ||
    lowerFileName.includes("statement") ||
    lowerFileName.includes("account")
  ) {
    return { documentType: "STATEMENT", confidence: 0.8 };
  }

  // ID Documents
  if (
    lowerFileName.includes("id") ||
    lowerFileName.includes("license") ||
    lowerFileName.includes("passport")
  ) {
    return { documentType: "ID", confidence: 0.85 };
  }

  // Default to OTHER with low confidence
  return { documentType: "OTHER", confidence: 0.5 };
}

/**
 * POST /api/documents
 * Upload a document for a client with AI classification
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication check
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    // Only ADMIN, CPA, and CLIENT can upload documents
    if (!["ADMIN", "CPA", "CLIENT"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;

    // Validation
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Verify client exists
    const client = await prisma.clients.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // For CLIENT role, verify they can only upload to their own profile
    if (user.role === "CLIENT") {
      const clientUser = await prisma.clients.findFirst({
        where: { user_id: user.id },
      });

      if (!clientUser || clientUser.id !== clientId) {
        return NextResponse.json(
          { error: "You can only upload documents to your own profile" },
          { status: 403 }
        );
      }
    }

    // File validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, PNG, and DOC files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", clientId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}-${safeFileName}`;
    const filePath = join(uploadsDir, uniqueFileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // AI Document Classification
    const { documentType, confidence } = classifyDocument(file.name);

    // Create document record in database
    const document = await prisma.documents.create({
      data: {
        client_id: clientId,
        file_name: file.name,
        file_url: filePath,
        file_size: BigInt(file.size),
        file_type: file.type,
        document_type: documentType,
        is_verified: false,
        uploaded_by_id: user.id,
      },
    });

    // Format response
    const formattedDocument = {
      id: document.id,
      clientId: document.client_id,
      fileName: document.file_name,
      fileUrl: document.file_url,
      fileSize: Number(document.file_size),
      fileType: document.file_type,
      documentType: document.document_type,
      isVerified: document.is_verified,
      uploadedById: document.uploaded_by_id,
      uploadedAt: document.uploaded_at,
      confidence, // Include AI confidence score
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedDocument,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Document upload error:", error);
    return handleApiError(error);
  }
}

/**
 * GET /api/documents?clientId=123
 * Fetch all documents for a client
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = limiter(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication check
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    // Get query params
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // For CLIENT role, verify they can only access their own documents
    if (user.role === "CLIENT") {
      const clientUser = await prisma.clients.findFirst({
        where: { user_id: user.id },
      });

      if (!clientUser || clientUser.id !== clientId) {
        return NextResponse.json(
          { error: "You can only access your own documents" },
          { status: 403 }
        );
      }
    }

    // Fetch documents
    const documents = await prisma.documents.findMany({
      where: { client_id: clientId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { uploaded_at: "desc" },
    });

    // Format response
    const formattedDocuments = documents.map((doc) => ({
      id: doc.id,
      clientId: doc.client_id,
      fileName: doc.file_name,
      fileSize: doc.file_size ? Number(doc.file_size) : null,
      fileType: doc.file_type,
      documentType: doc.document_type,
      isVerified: doc.is_verified,
      uploadedAt: doc.uploaded_at,
      uploadedBy: doc.users ? {
        id: doc.users.id,
        name: doc.users.name,
        email: doc.users.email,
      } : null,
    }));

    return successResponse(formattedDocuments);
  } catch (error) {
    console.error("Fetch documents error:", error);
    return handleApiError(error);
  }
}
