"use client";

import { useParams, useRouter } from "next/navigation";
import { useClient, useUpdateClient } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";
import { ErrorState } from "@/components/ui/ErrorState";
import { useState } from "react";

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { data: client, isLoading, error } = useClient(clientId);
  const updateClient = useUpdateClient();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    try {
      await updateClient.mutateAsync({
        id: clientId,
        data: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string || undefined,
          entityType: formData.get("entityType") as string,
          taxYear: parseInt(formData.get("taxYear") as string),
          businessName: formData.get("businessName") as string || undefined,
        },
      });

      // Navigate back to client detail page
      router.push(`/dashboard/clients/${clientId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update client");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <ErrorState message="Failed to load client" />
          <button
            onClick={() => router.push("/dashboard/clients")}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Client</h2>
              <p className="text-sm text-gray-500 mt-1">Update client information</p>
            </div>
            <button
              onClick={() => router.push(`/dashboard/clients/${clientId}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={client.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={client.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={client.phone || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Entity Type */}
              <div>
                <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
                  Entity Type*
                </label>
                <select
                  id="entityType"
                  name="entityType"
                  required
                  defaultValue={client.entityType}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="LLC">LLC</option>
                  <option value="S_CORP">S-Corp</option>
                  <option value="C_CORP">C-Corp</option>
                  <option value="PARTNERSHIP">Partnership</option>
                </select>
              </div>

              {/* Tax Year */}
              <div>
                <label htmlFor="taxYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Year*
                </label>
                <input
                  type="number"
                  id="taxYear"
                  name="taxYear"
                  required
                  defaultValue={client.taxYear}
                  min="2020"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  defaultValue={client.businessName || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/clients/${clientId}`)}
                className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
