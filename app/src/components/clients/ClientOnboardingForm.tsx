"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateClient } from "@/hooks/useClients";
import { LoadingSpinner } from "@/components/ui/Loading";

// Validation schema
const clientOnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  entityType: z.enum(["INDIVIDUAL", "LLC", "S_CORP", "C_CORP", "PARTNERSHIP", "TRUST", "ESTATE"], {
    message: "Please select an entity type",
  }),
  taxYear: z.number().int().min(2020).max(2030, "Tax year must be between 2020 and 2030"),
  businessName: z.string().optional(),
});

type ClientOnboardingFormData = z.infer<typeof clientOnboardingSchema>;

interface ClientOnboardingFormProps {
  onSuccess?: (clientId: string) => void;
  onCancel?: () => void;
}

export function ClientOnboardingForm({ onSuccess, onCancel }: ClientOnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createClientMutation = useCreateClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientOnboardingFormData>({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      taxYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: ClientOnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createClientMutation.mutateAsync(data);
      reset();
      onSuccess?.(result.id || result.data?.id);
    } catch (error) {
      console.error("Failed to create client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">New Client Onboarding</h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Entity Type */}
        <div className="mb-4">
          <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
            Entity Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("entityType")}
            id="entityType"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select entity type</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="LLC">LLC</option>
            <option value="S_CORP">S Corporation</option>
            <option value="C_CORP">C Corporation</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="TRUST">Trust</option>
            <option value="ESTATE">Estate</option>
          </select>
          {errors.entityType && (
            <p className="mt-1 text-sm text-red-600">{errors.entityType.message}</p>
          )}
        </div>

        {/* Tax Year */}
        <div className="mb-4">
          <label htmlFor="taxYear" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Year <span className="text-red-500">*</span>
          </label>
          <input
            {...register("taxYear", { valueAsNumber: true })}
            type="number"
            id="taxYear"
            min="2020"
            max="2030"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.taxYear && (
            <p className="mt-1 text-sm text-red-600">{errors.taxYear.message}</p>
          )}
        </div>

        {/* Business Name */}
        <div className="mb-4">
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name (if applicable)
          </label>
          <input
            {...register("businessName")}
            type="text"
            id="businessName"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Acme Corp"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        {/* Error Message */}
        {createClientMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Failed to create client. Please try again.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
