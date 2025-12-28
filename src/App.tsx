import React, { useState } from "react";
import SeriesList from "./components/SeriesList";
import UploadPage from "./components/UploadPage";
import QuestionsGridView from "./components/QuestionsGridView";
import QuestionDetailPage from "./components/QuestionDetailPage";
import { QCMEntry, SeriesMetadata } from "./types";
import { Toaster } from "./components/ui/sonner";

type AppView = "list" | "upload" | "grid" | "detail";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("list");
  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata>({
    objective: "",
    faculty: "",
    year: "",
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);

  const handleSeriesLoad = (data: { metadata: SeriesMetadata; questions: QCMEntry[] }) => {
    setQuestions(data.questions);
    setMetadata(data.metadata);
    setCurrentView("grid");
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
    if (data.seriesId) {
      setCurrentSeriesId(data.seriesId);
    }
    setCurrentView("grid");
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div>
        {currentView === "list" && (
          <SeriesList
            onSeriesLoad={handleSeriesLoad}
            onNewSeries={() => setCurrentView("upload")}
          />
        )}

        {currentView === "upload" && (
          <UploadPage
            onSeriesUploaded={handleSeriesUploaded}
            onBack={() => setCurrentView("list")}
          />
        )}

        {currentView === "grid" && (
          <QuestionsGridView
            questions={questions}
            metadata={metadata}
            onQuestionSelect={(id) => {
              setSelectedQuestionId(id);
              setCurrentView("detail");
            }}
            onBack={() => setCurrentView("list")}
          />
        )}

        {currentView === "detail" && selectedQuestionId && (
          <QuestionDetailPage
            currentQuestionId={selectedQuestionId}
            allQuestions={questions}
            metadata={metadata}
            onBack={() => setCurrentView("grid")}
            onSave={setQuestions}
            seriesId={currentSeriesId}
          />
        )}
      </div>
    </>
  );
}
