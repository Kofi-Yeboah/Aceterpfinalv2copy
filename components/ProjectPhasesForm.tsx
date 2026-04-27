import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
}

interface ProjectPhasesFormProps {
  project: {
    id: string;
    name: string;
  };
  onBack: () => void;
  onSubmit?: (phases: Phase[]) => void;
}

export function ProjectPhasesForm({ project, onBack, onSubmit }: ProjectPhasesFormProps) {
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "1",
      name: "",
      startDate: "",
      endDate: "",
      budget: "",
      description: ""
    }
  ]);

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: "",
      startDate: "",
      endDate: "",
      budget: "",
      description: ""
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (id: string) => {
    if (phases.length > 1) {
      setPhases(phases.filter(p => p.id !== id));
    }
  };

  const updatePhase = (id: string, field: keyof Phase, value: string) => {
    setPhases(phases.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(phases);
    }
    onBack();
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Project Phases
            </h1>
            <div className="text-sm text-slate-600 mt-1">
              {project.name}
            </div>
          </div>
          <button
            onClick={addPhase}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span className="text-lg">+</span>
            Add Phase
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="bg-white rounded-lg border border-slate-200 p-6 relative">
              {/* Delete button */}
              {phases.length > 1 && (
                <button
                  onClick={() => removePhase(phase.id)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove phase"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Phase {index + 1}
              </h3>

              <div className="space-y-4">
                {/* Phase Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phase Name
                  </label>
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(phase.id, "name", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Planning & Design"
                  />
                </div>

                {/* Start and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={phase.startDate}
                      onChange={(e) => updatePhase(phase.id, "startDate", e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={phase.endDate}
                      onChange={(e) => updatePhase(phase.id, "endDate", e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={phase.budget}
                    onChange={(e) => updatePhase(phase.id, "budget", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $100,000"
                  />
                </div>

                {/* Description / Tasks */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description / Tasks
                  </label>
                  <textarea
                    value={phase.description}
                    onChange={(e) => updatePhase(phase.id, "description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter phase description or key tasks"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 py-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Project Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
