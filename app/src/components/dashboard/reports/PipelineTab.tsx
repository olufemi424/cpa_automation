import type { PipelineAnalytics } from "@/types";

interface PipelineTabProps {
  data: PipelineAnalytics;
}

export function PipelineTab({ data }: PipelineTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.pipeline.map((stage) => (
            <div key={stage.status} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{stage.status}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {stage.count}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Avg. time: {data.averageTimePerStage[stage.status]} days
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stage.clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="text-sm bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${client.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{client.progressPercentage}%</span>
                    </div>
                  </div>
                ))}
                {stage.clients.length > 5 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{stage.clients.length - 5} more
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
