import React, { useState } from "react";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { QCMEntry } from "../types";
import AutocompleteInput from "./AutocompleteInput";
import { toast } from "sonner";

interface UploadPageProps {
  onSeriesUploaded: (data: {
    questions: QCMEntry[];
    objective: string;
    faculty: string;
    year: string;
  }) => void;
}

const OBJECTIVES = [
  "AVC",
  "Adénopathies superficielles",
  "Anémies",
  "Appendicite aiguë",
  "ACR",
  "Arthrite septique",
  "Asthme",
  "Bronchiolites du nourrisson",
  "BPCO",
  "Brûlures cutanées récentes",
  "Cancer broncho-pulmonaire",
  "Cancer du cavum",
  "Cancer du col de l'utérus",
  "Cancer du sein",
  "Cancers colorectaux",
  "Céphalées",
  "Coma",
  "Contraception",
  "Déshydratations aiguës de l'enfant",
  "Diabète sucré",
  "Diarrhées chroniques",
  "Douleurs thoraciques aiguës",
  "Dyslipidémies",
  "Dysphagies",
  "Endocardite infectieuse",
  "Épilepsies",
  "Choc cardiogénique",
  "État de choc hémorragique",
  "États confusionnels",
  "États septiques graves",
  "Fractures ouvertes de la jambe",
  "GEU",
  "Hématuries",
  "Hémorragies digestives",
  "Hépatites virales",
  "Hydatidoses hépatiques et pulmonaires",
  "Hypercalcémies",
  "HTA",
  "Hyperthyroïdies",
  "Hypothyroïdies",
  "Ictères",
  "IVAS",
  "IRB",
  "IST",
  "Infections urinaires",
  "IRA",
  "ISA",
  "Intoxications",
  "Ischémie aiguë des membres",
  "Lithiase urinaire",
  "MVTE",
  "Méningites",
  "Métrorragies",
  "OIA",
  "Œdèmes",
  "Œil rouge",
  "Péritonites aiguës",
  "Polyarthrite rhumatoïde",
  "Polytraumatisme",
  "Prééclampsie",
  "Douleur aiguë",
  "Purpuras",
  "Schizophrénie",
  "Splénomégalies",
  "SCA",
  "Transfusion sanguine",
  "Traumatismes crâniens",
  "Troubles acido-basiques",
  "Troubles anxieux",
  "Troubles de l'humeur",
  "Troubles de l'hydratation/ Dyskaliémies",
  "Tuberculose ",
  "Tumeurs de la prostate",
  "UGD",
  "Vaccinations"
];

const FACULTIES = [
  "FMT",
  "FMM",
  "FMS",
  "FMSF",
];

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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processAndContinue = async () => {
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

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
        
        let questions: QCMEntry[] = [];
        
        if (fileExtension === 'csv') {
          questions = parseCSV(text);
        } else if (fileExtension === 'json') {
          questions = JSON.parse(text);
        } else {
          setError("Format de fichier non supporté. Utilisez CSV ou JSON.");
          setTimeout(() => setError(null), 3000);
          setIsProcessing(false);
          return;
        }

        // Sauvegarder dans localStorage
        localStorage.setItem("qcm-questions", JSON.stringify(questions));
        localStorage.setItem("qcm-metadata", JSON.stringify({ objective, faculty, year }));

        toast.success('✅ Série créée avec succès !', {
          description: `${questions.length} question${questions.length > 1 ? 's' : ''} chargée${questions.length > 1 ? 's' : ''}`
        });
        
        onSeriesUploaded({ 
          questions, 
          objective, 
          faculty, 
          year
        });
      } catch (err) {
        console.error("Erreur import fichier:", err);
        setError("Erreur lors de la lecture du fichier.");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsProcessing(false);
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
          <h1 className="mb-2 text-indigo-600">QCM Database Builder</h1>
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
                  <p className="text-green-600 font-medium">{uploadedFile.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
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
            disabled={!uploadedFile || !objective || !faculty || !year || isProcessing}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
              uploadedFile && objective && faculty && year && !isProcessing
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Traitement en cours...
              </>
            ) : (
              <>
                Continuer vers les questions
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 mb-2">📋 Format CSV attendu :</p>
            <code className="text-xs bg-white px-2 py-1 rounded block overflow-x-auto mb-2">
              question,propositions,cas_clinique_id
            </code>
            <p className="text-blue-700 text-sm mb-3">
              Exemple : "Question?","Réponse A;Réponse B;Réponse C",""
            </p>
            <div className="space-y-2 text-sm text-blue-800">
              <p>✅ Séparateur de propositions : <strong>;</strong> ou <strong>|</strong></p>
              <p>✅ Questions d'un même cas clinique : même <strong>cas_clinique_id</strong></p>
              <p>✅ QCM simple : laissez <strong>cas_clinique_id</strong> vide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
