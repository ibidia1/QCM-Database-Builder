import React, { useState } from "react";
import { QCMEntry, SeriesMetadata } from "./types";
import { Toaster } from "sonner";
import SeriesList from "./components/SeriesList";
import UploadPage from "./components/UploadPage";
import QuestionsGridView from "./components/QuestionsGridView";
import QuestionDetailPage from "./components/QuestionDetailPage";

type ViewType = "seriesList" | "upload" | "grid" | "detail";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("seriesList");
  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata>({
    objective: "",
    faculty: "",
    year: "",
  });
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [seriesId, setSeriesId] = useState<string | null>(null);

  const handleSeriesLoad = (data: { metadata: SeriesMetadata; questions: QCMEntry[] }) => {
    setMetadata(data.metadata);
    setQuestions(data.questions);
    setCurrentView("grid");
  };

  const handleNewSeries = () => {
    setCurrentView("upload");
  };

  const handleSeriesUploaded = (data: {
    questions: QCMEntry[];
    objective: string;
    faculty: string;
    year: string;
    seriesId?: string;
  }) => {
    setQuestions(data.questions);
    setMetadata({
      objective: data.objective,
      faculty: data.faculty,
      year: data.year,
    });
    setSeriesId(data.seriesId || null);
    setCurrentView("grid");
  };

  const handleQuestionSelect = (questionId: string) => {
    setCurrentQuestionId(questionId);
    setCurrentView("detail");
  };

  const handleBackToGrid = () => {
    setCurrentView("grid");
  };

  const handleBackToSeriesList = () => {
    setCurrentView("seriesList");
  };

  const handleSaveQuestions = (updatedQuestions: QCMEntry[]) => {
    setQuestions(updatedQuestions);
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {currentView === "seriesList" && (
        <SeriesList 
          onSeriesLoad={handleSeriesLoad}
          onNewSeries={handleNewSeries}
        />
      )}

      {currentView === "upload" && (
        <UploadPage
          onSeriesUploaded={handleSeriesUploaded}
          onBack={handleBackToSeriesList}
        />
      )}

      {currentView === "grid" && (
        <QuestionsGridView
          questions={questions}
          metadata={metadata}
          onQuestionSelect={handleQuestionSelect}
          onBack={handleBackToSeriesList}
        />
      )}

      {currentView === "detail" && (
        <QuestionDetailPage
          currentQuestionId={currentQuestionId}
          allQuestions={questions}
          metadata={metadata}
          onBack={handleBackToGrid}
          onSave={handleSaveQuestions}
          seriesId={seriesId}
        />
      )}
    </>
  );
}
