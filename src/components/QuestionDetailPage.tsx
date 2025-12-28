import React, { useState, useEffect } from "react";
import { QCMEntry, SeriesMetadata } from "../types";
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface QuestionDetailPageProps {
  currentQuestionId: string;
  allQuestions: QCMEntry[];
  metadata: SeriesMetadata;
  onBack: () => void;
  onSave: (questions: QCMEntry[]) => void;
}

const TAGS = ["Clinique", "Anatomie", "Biologie", "Physiologie", "Épidémiologie"];

export default function QuestionDetailPage({
  currentQuestionId,
  allQuestions,
  metadata,
  onBack,
  onSave,
}: QuestionDetailPageProps) {
  const [questions, setQuestions] = useState<QCMEntry[]>(allQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subCourses, setSubCourses] = useState<string[]>([]);
  const [newSubCourse, setNewSubCourse] = useState("");

  // Trouver les questions du cas clinique actuel ou la question simple
  const currentQuestion = questions.find(q => q.id === currentQuestionId);
  const relatedQuestions = currentQuestion?.clinicalCaseId
    ? questions.filter(q => q.clinicalCaseId === currentQuestion.clinicalCaseId)
    : currentQuestion ? [currentQuestion] : [];

  useEffect(() => {
    const savedSubCourses = localStorage.getItem("qcm-subcourses");
    if (savedSubCourses) {
      try {
        setSubCourses(JSON.parse(savedSubCourses));
      } catch (e) {
        console.error("Erreur chargement sous-cours:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("qcm-subcourses", JSON.stringify(subCourses));
  }, [subCourses]);

  const currentQ = relatedQuestions[currentIndex];
  const optionLetters = currentQ ? currentQ.options.map((_, i) => String.fromCharCode(65 + i)) : [];

  const updateCurrentQuestion = (updates: Partial<QCMEntry>) => {
    const updatedQuestions = questions.map(q =>
      q.id === currentQ.id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
    );
    setQuestions(updatedQuestions);
  };

  const toggleCorrectAnswer = (letter: string) => {
    const currentAnswers = currentQ.correctAnswers || [];
    const newAnswers = currentAnswers.includes(letter)
      ? currentAnswers.filter(a => a !== letter)
      : [...currentAnswers, letter];
    updateCurrentQuestion({ correctAnswers: newAnswers });
  };

  const toggleTag = (tag: string) => {
    const currentTags = currentQ.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateCurrentQuestion({ tags: newTags });
  };

  const addSubCourse = () => {
    if (newSubCourse.trim() && !subCourses.includes(newSubCourse.trim())) {
      setSubCourses([...subCourses, newSubCourse.trim()]);
      setNewSubCourse("");
    }
  };

  const handleSave = () => {
    onSave(questions);
    toast.success("Modifications sauvegardées avec succès !");
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQ.options];
    newOptions[index] = value;
    updateCurrentQuestion({ options: newOptions });
  };

  const addOption = () => {
    if (currentQ.options.length < 10) {
      updateCurrentQuestion({ options: [...currentQ.options, ""] });
    }
  };

  const removeOption = (index: number) => {
    if (currentQ.options.length > 2) {
      const newOptions = currentQ.options.filter((_, i) => i !== index);
      const letter = String.fromCharCode(65 + index);
      const newCorrectAnswers = currentQ.correctAnswers.filter(a => a !== letter);
      updateCurrentQuestion({ options: newOptions, correctAnswers: newCorrectAnswers });
    }
  };

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <p>Question introuvable</p>
      </div>
    );
  }

  const isClinicalCase = relatedQuestions.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la grille
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full ${isClinicalCase ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {isClinicalCase ? `Cas clinique (${relatedQuestions.length} questions)` : 'QCM simple'}
                </div>
                <div className="text-gray-600">
                  {metadata.objective} • {metadata.faculty} • {metadata.year}
                </div>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        {/* Navigation entre questions du cas clinique */}
        {isClinicalCase && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {relatedQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      idx === currentIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentIndex(Math.min(relatedQuestions.length - 1, currentIndex + 1))}
                disabled={currentIndex === relatedQuestions.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Question */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-700">Question</label>
            <textarea
              value={currentQ.question}
              onChange={(e) => updateCurrentQuestion({ question: e.target.value })}
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Saisir la question..."
            />
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">Propositions</label>
            <div className="space-y-3">
              {currentQ.options.map((option, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full flex-shrink-0">
                      {letter}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Option ${letter}`}
                    />
                    {currentQ.options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {currentQ.options.length < 10 && (
              <button
                onClick={addOption}
                className="mt-3 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Ajouter une option
              </button>
            )}
          </div>

          {/* Correct Answers */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">Réponse(s) correcte(s)</label>
            <div className="flex flex-wrap gap-2">
              {optionLetters.map((letter, i) => (
                <button
                  key={letter}
                  onClick={() => toggleCorrectAnswer(letter)}
                  disabled={!currentQ.options[i]?.trim()}
                  className={`
                    w-12 h-12 rounded-full border-2 transition-all
                    ${currentQ.correctAnswers.includes(letter)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                    }
                    ${!currentQ.options[i]?.trim() ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {letter}
                </button>
              ))}
            </div>
            {currentQ.correctAnswers.length > 0 && (
              <p className="mt-3 text-green-600">
                Réponse(s) sélectionnée(s) : {currentQ.correctAnswers.join(', ')}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">Tags thématiques</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    currentQ.tags?.includes(tag)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sous-cours */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">Sous-cours</label>
            <div className="flex gap-3 mb-3">
              <select
                value={currentQ.subCourse || ""}
                onChange={(e) => updateCurrentQuestion({ subCourse: e.target.value || null })}
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">-- Choisir un sous-cours --</option>
                {subCourses.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSubCourse}
                onChange={(e) => setNewSubCourse(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubCourse()}
                placeholder="Ajouter un nouveau sous-cours"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={addSubCourse}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Justification AI */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700">Justification / Explication</label>
            <textarea
              value={currentQ.aiJustification}
              onChange={(e) => updateCurrentQuestion({ aiJustification: e.target.value })}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Ajouter une justification ou explication pour cette question..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
