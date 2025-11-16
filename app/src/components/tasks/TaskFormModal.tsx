"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

interface TaskFormData {
  title: string;
  description: string;
  assignedToId: string;
  dueDate: string;
}

export function TaskFormModal({
  isOpen,
  onClose,
  clientId,
  clientName,
}: TaskFormModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    assignedToId: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to create task");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      handleClose();
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.assignedToId) {
      newErrors.assignedToId = "Assignee is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      createTaskMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      assignedToId: "",
      dueDate: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={createTaskMutation.isPending}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Creating task for <span className="font-semibold">{clientName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Review W-2 forms"
              disabled={createTaskMutation.isPending}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Provide details about this task..."
              disabled={createTaskMutation.isPending}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Assignee - Will be populated with CPAs in future */}
          <div>
            <label
              htmlFor="assignedToId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assign To *
            </label>
            <input
              type="text"
              id="assignedToId"
              value={formData.assignedToId}
              onChange={(e) =>
                setFormData({ ...formData, assignedToId: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assignedToId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter user ID (temp)"
              disabled={createTaskMutation.isPending}
            />
            {errors.assignedToId && (
              <p className="text-red-500 text-xs mt-1">{errors.assignedToId}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Note: Will be replaced with CPA dropdown in future
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
              disabled={createTaskMutation.isPending}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Error message */}
          {createTaskMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {createTaskMutation.error instanceof Error
                ? createTaskMutation.error.message
                : "Failed to create task"}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
