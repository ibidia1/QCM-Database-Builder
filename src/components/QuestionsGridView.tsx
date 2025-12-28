import React from "react";
import { QCMEntry, SeriesMetadata } from "../types";
import { FileText, Layers, ArrowLeft, CheckCircle2, Download } from "lucide-react";

interface QuestionsGridViewProps {
  questions: QCMEntry[];
  metadata: SeriesMetadata;
  onQuestionSelect: (questionId: string) => void;
  onBack: () => void;
}

export default function QuestionsGridView({ 
  questions, 
  metadata, 
  onQuestionSelect,
  onBack 
}: QuestionsGridViewProps) {
  
  const exportJSON = () => {
    const dataToExport = {
      metadata,
      questions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qcm-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Grouper les questions par cas clinique
  const groupedQuestions: Array<{ id: string; type: 'single' | 'case'; questions: QCMEntry[] }> = [];
  const processedIds = new Set<string>();

  questions.forEach((question) => {
    if (processedIds.has(question.id)) return;

    if (question.clinicalCaseId) {
      // C'est un cas clinique
      const caseQuestions = questions.filter(
        (q) => q.clinicalCaseId === question.clinicalCaseId
      );
      caseQuestions.forEach((q) => processedIds.add(q.id));
      groupedQuestions.push({
        id: question.clinicalCaseId,
        type: 'case',
        questions: caseQuestions,
      });
    } else {
      // QCM simple
      processedIds.add(question.id);
      groupedQuestions.push({
        id: question.id,
        type: 'single',
        questions: [question],
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-indigo-600">Série de QCM</h1>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Exporter JSON
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-gray-600">Objectif</p>
                  <p className="text-gray-900">{metadata.objective}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl">🏛️</span>
                <div>
                  <p className="text-gray-600">Faculté</p>
                  <p className="text-gray-900">{metadata.faculty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-gray-600">Année</p>
                  <p className="text-gray-900">{metadata.year}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>{groupedQuestions.length}</strong> élément{groupedQuestions.length > 1 ? 's' : ''} • 
                  <strong> {questions.length}</strong> question{questions.length > 1 ? 's' : ''} au total
                </p>
              </div>
              
              {(() => {
                const completedCount = questions.filter(q => q.correctAnswers && q.correctAnswers.length > 0).length;
                const progressPercent = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;
                
                return (
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-900">Progression</span>
                      <span className="text-indigo-700">{completedCount}/{questions.length} validées ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="mb-6 text-gray-700">Sélectionnez une question ou un cas clinique</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {groupedQuestions.map((item, index) => {
              const isClinicalCase = item.type === 'case';
              const displayNumber = index + 1;
              
              // Vérifier si toutes les questions ont des réponses correctes
              const isComplete = item.questions.every(q => q.correctAnswers && q.correctAnswers.length > 0);
              
              return (
                <button
                  key={item.id}
                  onClick={() => onQuestionSelect(item.questions[0].id)}
                  className={`
                    relative aspect-square rounded-xl transition-all hover:scale-105 hover:shadow-xl
                    flex flex-col items-center justify-center gap-2 p-4
                    ${isClinicalCase 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    }
                  `}
                >
                  {isClinicalCase ? (
                    <>
                      <Layers className="w-6 h-6" />
                      <span className="text-sm">Cas {displayNumber}</span>
                      <span className="text-xs opacity-90">
                        {item.questions.length} Q
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6" />
                      <span className="text-lg">Q{displayNumber}</span>
                    </>
                  )}
                  
                  {/* Status indicator */}
                  {isComplete && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-gray-600">QCM simple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <span className="text-gray-600">Cas clinique</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
