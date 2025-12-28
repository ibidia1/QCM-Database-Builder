import React, { useState, useEffect } from "react";
import UploadPage from "./components/UploadPage";
import QuestionsGridView from "./components/QuestionsGridView";
import QuestionDetailPage from "./components/QuestionDetailPage";
import { QCMEntry, SeriesMetadata } from "./types";
import { Toaster } from "./components/ui/sonner";

type AppView = "upload" | "grid" | "detail";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("upload");
  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata>({
    objective: "",
    faculty: "",
    year: "",
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedQuestions = localStorage.getItem("qcm-questions");
    const savedMetadata = localStorage.getItem("qcm-metadata");
    
    if (savedQuestions && savedMetadata) {
      try {
        setQuestions(JSON.parse(savedQuestions));
        setMetadata(JSON.parse(savedMetadata));
        setCurrentView("grid");
      } catch (e) {
        console.error("Erreur chargement données:", e);
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem("qcm-questions", JSON.stringify(questions));
      localStorage.setItem("qcm-metadata", JSON.stringify(metadata));
    }
  }, [questions, metadata]);

  const handleSeriesUploaded = (data: {
    questions: QCMEntry[];
    objective: string;
    faculty: string;
    year: string;
  }) => {
    setQuestions(data.questions);
    setMetadata({
      objective: data.objective,
      faculty: data.faculty,
      year: data.year,
    });
    setCurrentView("grid");
  };

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentView("detail");
  };

  const handleSaveQuestions = (updatedQuestions: QCMEntry[]) => {
    setQuestions(updatedQuestions);
    // Optionnellement, afficher un message de confirmation
    console.log("Questions sauvegardées avec succès");
  };

  const handleBackToGrid = () => {
    setCurrentView("grid");
    setSelectedQuestionId(null);
  };

  const handleBackToUpload = () => {
    if (window.confirm("Voulez-vous vraiment revenir à l'accueil ? Les données non sauvegardées seront perdues.")) {
      setCurrentView("upload");
      setQuestions([]);
      setSelectedQuestionId(null);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div>
        {currentView === "upload" && (
          <UploadPage onSeriesUploaded={handleSeriesUploaded} />
        )}

        {currentView === "grid" && (
          <QuestionsGridView
            questions={questions}
            metadata={metadata}
            onQuestionSelect={handleQuestionSelect}
            onBack={handleBackToUpload}
          />
        )}

        {currentView === "detail" && selectedQuestionId && (
          <QuestionDetailPage
            currentQuestionId={selectedQuestionId}
            allQuestions={questions}
            metadata={metadata}
            onBack={handleBackToGrid}
            onSave={handleSaveQuestions}
          />
        )}
      </div>
    </>
  );
}
