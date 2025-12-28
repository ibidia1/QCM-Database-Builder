import React, { useState } from "react";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { QCMEntry } from "../types";
import AutocompleteInput from "./AutocompleteInput";

interface UploadPageProps {
  onSeriesUploaded: (data: {
    questions: QCMEntry[];
    objective: string;
    faculty: string;
    year: string;
  }) => void;
}

const OBJECTIVES = [
  "Asthme",
  "Diabète",
  "Hypertension artérielle",
  "Insuffisance cardiaque",
  "Infarctus du myocarde",
  "Accident vasculaire cérébral",
  "Pneumonie",
  "Bronchopneumopathie chronique obstructive",
  "Tuberculose",
  "Hépatite virale",
  "Cirrhose hépatique",
  "Insuffisance rénale chronique",
  "Insuffisance rénale aiguë",
  "Infection urinaire",
  "Méningite",
  "Paludisme",
  "Typhoïde",
  "Cancer du poumon",
  "Cancer du sein",
  "Cancer colorectal",
  "Cancer de la prostate",
  "Cancer gastrique",
  "Leucémie",
  "Lymphome",
  "Anémie",
  "Thrombose veineuse profonde",
  "Embolie pulmonaire",
  "Ulcère gastroduodénal",
  "Reflux gastro-œsophagien",
  "Maladie de Crohn",
  "Rectocolite hémorragique",
  "Pancréatite",
  "Cholécystite",
  "Appendicite",
  "Occlusion intestinale",
  "Péritonite",
  "Arthrose",
  "Polyarthrite rhumatoïde",
  "Lupus érythémateux systémique",
  "Sclérose en plaques",
  "Maladie de Parkinson",
  "Maladie d'Alzheimer",
  "Épilepsie",
  "Migraine",
  "Dépression",
  "Trouble bipolaire",
  "Schizophrénie",
  "Anxiété généralisée",
  "Hypothyroïdie",
  "Hyperthyroïdie",
  "Syndrome de Cushing",
  "Insuffisance surrénalienne",
  "Ostéoporose",
  "Goutte",
  "Obésité",
  "Dyslipidémie",
  "Syndrome métabolique",
  "Choc septique",
  "Choc anaphylactique",
  "Choc cardiogénique",
  "Arythmie cardiaque",
  "Endocardite infectieuse",
  "Péricardite",
  "Dissection aortique",
  "Varices œsophagiennes",
  "Glomérulonéphrite",
  "Syndrome néphrotique",
  "Lithiase rénale",
  "Rhumatisme articulaire aigu",
  "Fièvre typhoïde",
  "Dengue",
  "Septicémie",
  "Toxoplasmose",
  "VIH/SIDA",
  "Hépatite B",
];

const FACULTIES = [
  "FMT",
  "FMM",
  "FMS",
  "FMSF",
];

// Générer les années de 2019 à 2035
const YEARS = Array.from({ length: 2035 - 2019 + 1 }, (_, i) => String(2019 + i));

function generateUniqueId(prefix: string = "qcm"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${random}`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export default function UploadPage({ onSeriesUploaded }: UploadPageProps) {
  const [objective, setObjective] = useState("");
  const [faculty, setFaculty] = useState("");
  const [year, setYear] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const processAndContinue = () => {
    if (!uploadedFile) {
      setError("Veuillez uploader un fichier.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!objective || !faculty || !year) {
      setError("Veuillez remplir tous les champs.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'csv') {
          const questions = parseCSV(text);
          onSeriesUploaded({ questions, objective, faculty, year });
        } else if (fileExtension === 'json') {
          const questions = JSON.parse(text);
          onSeriesUploaded({ questions, objective, faculty, year });
        } else {
          setError("Format de fichier non supporté. Utilisez CSV ou JSON.");
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        console.error("Erreur import fichier:", err);
        setError("Erreur lors de la lecture du fichier.");
        setTimeout(() => setError(null), 3000);
      }
    };
    reader.readAsText(uploadedFile);
  };

  function parseCSV(text: string): QCMEntry[] {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error("Fichier CSV vide ou invalide.");
    }

    const entries: QCMEntry[] = [];
    const clinicalCaseIdMap: { [key: string]: string } = {};
    
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length < 2) continue;
      
      const question = row[0]?.trim();
      if (!question) continue;
      
      const propositionsStr = row[1]?.trim() || "";
      const options = propositionsStr.split(/[;|]/).map(opt => opt.trim()).filter(opt => opt.length > 0);
      
      if (options.length < 2) continue;
      
      const csvCaseId = row[2]?.trim() || null;
      let finalClinicalCaseId = null;
      
      if (csvCaseId) {
        if (!clinicalCaseIdMap[csvCaseId]) {
          clinicalCaseIdMap[csvCaseId] = generateUniqueId("cas");
        }
        finalClinicalCaseId = clinicalCaseIdMap[csvCaseId];
      }
      
      const entry: QCMEntry = {
        id: generateUniqueId("qcm"),
        question,
        options,
        correctAnswers: [],
        aiJustification: "",
        type: finalClinicalCaseId ? "Cas clinique" : "QCM",
        tags: [],
        subCourse: null,
        clinicalCaseId: finalClinicalCaseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      entries.push(entry);
    }
    
    return entries;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2 text-indigo-600">Plateforme de Gestion QCM Médicaux</h1>
          <p className="text-gray-600">Uploadez votre série et configurez les paramètres</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Upload Section */}
          <div className="mb-8">
            <label className="block mb-3 text-gray-700">
              📤 Uploader la série de QCM
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragOver 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              {uploadedFile ? (
                <div className="space-y-3">
                  <FileSpreadsheet className="w-16 h-16 mx-auto text-green-600" />
                  <p className="text-green-600">{uploadedFile.name}</p>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="text-gray-600">Glissez-déposez votre fichier ici</p>
                  <p className="text-gray-500">ou</p>
                  <label className="inline-block">
                    <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                      Parcourir les fichiers
                    </span>
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 mt-2">Formats acceptés : CSV, JSON</p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Objectif */}
            <AutocompleteInput
              options={OBJECTIVES}
              value={objective}
              onChange={setObjective}
              placeholder="Rechercher une maladie..."
              label="Objectif (Maladie)"
              icon="🎯"
            />

            {/* Faculté */}
            <div>
              <label className="block mb-2 text-gray-700">
                🏛️ Faculté
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {FACULTIES.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* Année */}
            <div>
              <label className="block mb-2 text-gray-700">
                📅 Année
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info sur les objectifs */}
          <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-indigo-900">
              💡 <strong>{OBJECTIVES.length} objectifs de maladies</strong> disponibles pour classification
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={processAndContinue}
            disabled={!uploadedFile || !objective || !faculty || !year}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
              uploadedFile && objective && faculty && year
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continuer vers les questions
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 mb-2">📋 Format CSV attendu :</p>
            <code className="text-xs bg-white px-2 py-1 rounded block overflow-x-auto mb-2">
              question,propositions,cas_clinique_id
            </code>
            <p className="text-blue-700">
              Exemple : "Question?","Réponse A;Réponse B;Réponse C",""
            </p>
            <a
              href="/exemple-qcm.csv"
              download="exemple-qcm.csv"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📥 Télécharger fichier exemple
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
