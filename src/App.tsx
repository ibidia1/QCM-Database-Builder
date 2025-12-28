import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { getCurrentUser, signOut } from "./supabaseService";
import Auth from "./components/Auth";
import SeriesList from "./components/SeriesList";
import UploadPage from "./components/UploadPage";
import QuestionsGridView from "./components/QuestionsGridView";
import QuestionDetailPage from "./components/QuestionDetailPage";
import { QCMEntry, SeriesMetadata } from "./types";
import { Toaster } from "./components/ui/sonner";

type AppView = "list" | "upload" | "grid" | "detail";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>("list");
  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata>({
    objective: "",
    faculty: "",
    year: "",
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUser(user);
        if (user) {
          setCurrentView("list");
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setCurrentView("list");
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setCurrentView("list");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => setCurrentView("list")} />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      {/* Bouton de déconnexion */}
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
      >
        🚪 Déconnexion
      </button>

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
