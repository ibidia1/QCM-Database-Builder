import React, { useState } from "react";
import { QCMEntry, SeriesMetadata } from "./types";
import { Toaster } from "sonner";
import UploadPage from "./components/UploadPage";
import QuestionsGridView from "./components/QuestionsGridView";
import QuestionDetailPage from "./components/QuestionDetailPage";

type ViewType = "upload" | "grid" | "detail";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("upload");
  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata>({
    objective: "",
    faculty: "",
    year: "",
  });
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");

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
    setCurrentQuestionId(questionId);
    setCurrentView("detail");
  };

  const handleBackToGrid = () => {
    setCurrentView("grid");
  };

  const handleBackToUpload = () => {
    setCurrentView("upload");
  };

  const handleSaveQuestions = (updatedQuestions: QCMEntry[]) => {
    setQuestions(updatedQuestions);
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {currentView === "upload" && (
        <UploadPage
          onSeriesUploaded={handleSeriesUploaded}
        />
      )}

      {currentView === "grid" && (
        <QuestionsGridView
          questions={questions}
          metadata={metadata}
          onQuestionSelect={handleQuestionSelect}
          onBack={handleBackToUpload}
        />
      )}

      {currentView === "detail" && (
        <QuestionDetailPage
          currentQuestionId={currentQuestionId}
          allQuestions={questions}
          metadata={metadata}
          onBack={handleBackToGrid}
          onSave={handleSaveQuestions}
        />
      )}
    </>
  );
}
