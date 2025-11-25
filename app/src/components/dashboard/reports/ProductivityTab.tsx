import type { ProductivityAnalytics, UserRole } from "@/types";

interface ProductivityTabProps {
  data: ProductivityAnalytics;
  userRole: UserRole;
}

export function ProductivityTab({ data, userRole }: ProductivityTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {userRole === "ADMIN" ? "CPA Performance Overview" : "Your Performance"}
        </h3>
        <div className="space-y-4">
          {data.cpas.map((cpa) => (
            <div key={cpa.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{cpa.name}</h4>
                  <p className="text-sm text-gray-500">{cpa.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{cpa.activeClients}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Completed Tasks</p>
                  <p className="text-xl font-bold text-gray-900">{cpa.completedTasks}</p>
                </div>
                {Object.entries(cpa.clientsByStatus).map(([status, count]) => (
                  <div key={status} className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">{status}</p>
                    <p className="text-xl font-bold text-gray-900">{count as number}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
