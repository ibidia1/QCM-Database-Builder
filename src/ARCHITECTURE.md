# Architecture de l'Application QCM Médicaux

## Vue d'ensemble

L'application est maintenant structurée en 3 pages principales avec une navigation fluide :

```
┌─────────────────┐
│  UploadPage     │ ← Page d'accueil : Upload + Configuration
│  (Étape 1)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ QuestionsGrid   │ ← Vue en grille : Aperçu de toutes les questions
│  (Étape 2)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ QuestionDetail  │ ← Page de détail : Édition complète d'une question
│  (Étape 3)      │
└─────────────────┘
```

## 📁 Structure des fichiers

```
/
├── App.tsx                          # Point d'entrée - Gestion de la navigation
├── types.ts                         # Types TypeScript partagés
├── components/
│   ├── UploadPage.tsx              # Page 1 : Upload et configuration
│   ├── QuestionsGridView.tsx       # Page 2 : Vue en grille des questions
│   ├── QuestionDetailPage.tsx      # Page 3 : Édition détaillée
│   └── OldQcmBuilderApp.tsx        # Ancienne version (backup)
└── exemple-qcm.csv                  # Fichier exemple pour l'import
```

## 🎯 Fonctionnalités par page

### 1️⃣ UploadPage (Page d'accueil)

**Rôle** : Configuration initiale de la série de QCM

**Fonctionnalités** :
- ✅ Upload de fichier CSV/JSON (drag & drop)
- ✅ Sélection de l'objectif avec recherche autocomplete (75 maladies)
- ✅ Choix de la faculté (FMT, FMM, FMS, FMSF)
- ✅ Sélection de l'année (2019-2035)
- ✅ Parsing automatique du fichier
- ✅ Génération d'IDs uniques pour chaque question
- ✅ Groupement automatique des cas cliniques

**Paramètres de configuration** :

*Objectifs (75 maladies)* :
- Maladies cardiovasculaires, respiratoires, digestives, rénales, neurologiques, oncologiques, endocriniennes, rhumatologiques, psychiatriques, infectieuses, etc.
- Recherche autocomplete pour faciliter la sélection
- Liste complète disponible dans `/OBJECTIFS.md`

*Facultés* :
- FMT (Faculté de Médecine de Tanger)
- FMM (Faculté de Médecine de Marrakech)
- FMS (Faculté de Médecine de Sousse)
- FMSF (Faculté de Médecine de Sfax)

*Années* :
- 2019 à 2035 (sélection par année académique)

**Format CSV attendu** :
```csv
question,propositions,cas_clinique_id
"Question simple?","Réponse A;Réponse B;Réponse C;Réponse D",
"Question cas 1","Prop1;Prop2;Prop3","cas1"
"Question cas 2","Prop1;Prop2;Prop3","cas1"
```

### 2️⃣ QuestionsGridView (Vue en grille)

**Rôle** : Aperçu visuel de toutes les questions avec progression

**Fonctionnalités** :
- ✅ Affichage en grille numérotée (carrés cliquables)
- ✅ Distinction visuelle QCM simple vs Cas clinique
- ✅ Indicateur de complétion (icône ✓ verte)
- ✅ Barre de progression globale
- ✅ Métadonnées de la série (objectif, faculté, année)
- ✅ Export JSON de toute la série
- ✅ Navigation : retour à l'upload

**Codes couleurs** :
- 🟣 Violet : QCM simple
- 🔵 Bleu : Cas clinique (plusieurs questions)
- ✅ Vert : Question validée (réponse(s) correcte(s) sélectionnée(s))

### 3️⃣ QuestionDetailPage (Page de détail)

**Rôle** : Édition complète et validation d'une question

**Fonctionnalités** :
- ✅ Édition de la question
- ✅ Gestion des propositions (ajout/suppression/modification)
- ✅ Sélection des réponses correctes (multi-sélection)
- ✅ Attribution de tags thématiques
- ✅ Rattachement à un sous-cours
- ✅ Ajout de justification/explication
- ✅ Navigation entre questions d'un cas clinique
- ✅ Sauvegarde avec notification toast
- ✅ Retour à la grille

**Pour les cas cliniques** :
- Navigation entre les questions du cas (boutons ← →)
- Numérotation claire (Q1, Q2, Q3...)
- Badge "Cas clinique" avec nombre de questions

## 💾 Persistance des données

**localStorage** :
- `qcm-questions` : Tableau de toutes les questions
- `qcm-metadata` : Métadonnées (objectif, faculté, année)
- `qcm-subcourses` : Liste des sous-cours créés

**Auto-save** : Les données sont sauvegardées automatiquement dans localStorage à chaque modification.

## 🔑 Système d'IDs uniques

Chaque entité reçoit un ID unique :

```typescript
// Format : prefix_timestamp_random
qcm_1730829343_xy7k2mn4  // Question individuelle
cas_1730829343_abc123xyz // Cas clinique (partagé par toutes ses questions)
```

**Avantages** :
- ✅ Pas de collision même avec créations simultanées
- ✅ Traçabilité temporelle
- ✅ Facilite les exports/imports
- ✅ Compatible avec bases de données distribuées

## 🎨 Design System

**Palette de couleurs** :
- Primaire : Indigo (#4F46E5)
- Secondaire : Purple (#9333EA)
- Accent : Blue (#3B82F6)
- Success : Green (#10B981)
- Warning : Orange (#F59E0B)
- Danger : Red (#EF4444)

**Gradients** :
- Upload : `from-indigo-50 via-white to-purple-50`
- Boutons : `from-indigo-600 to-purple-600`
- Cas cliniques : `from-blue-500 to-blue-600`

## 🚀 Prochaines améliorations possibles

- [ ] Recherche et filtres dans la grille
- [ ] Statistiques de progression détaillées
- [ ] Mode révision avec affichage aléatoire
- [ ] Export PDF formaté
- [ ] Import depuis Excel
- [ ] Gestion multi-utilisateurs avec Supabase
- [ ] Historique des modifications
- [ ] Commentaires collaboratifs
- [ ] Mode hors-ligne avec synchronisation

## 🔄 Migration depuis l'ancienne version

L'ancienne version monolithique est conservée dans `/components/OldQcmBuilderApp.tsx` pour référence.

**Pour migrer les données** :
1. Exporter les données depuis l'ancienne version (JSON)
2. Les importer via l'UploadPage de la nouvelle version

## 📊 Types de données

Voir `types.ts` pour les définitions complètes :

```typescript
interface QCMEntry {
  id: string;                    // ID unique
  question: string;              // Texte de la question
  options: string[];             // Propositions (A, B, C, D, E...)
  correctAnswers: string[];      // ["A", "C"] par exemple
  aiJustification: string;       // Explication
  type: "QCM" | "Cas clinique";
  tags: string[];                // Tags thématiques
  subCourse: string | null;      // Sous-cours
  clinicalCaseId: string | null; // ID du cas (si applicable)
  createdAt: string;             // ISO date
  updatedAt: string;             // ISO date
}

interface SeriesMetadata {
  objective: string;  // "Résidanat", etc.
  faculty: string;    // Nom de la faculté
  year: string;       // "1ère année", etc.
}
```

## 🎓 Workflow utilisateur

1. **Upload** : L'utilisateur upload un CSV avec ses questions
2. **Configuration** : Sélectionne objectif, faculté, année
3. **Aperçu** : Voit toutes les questions en grille avec progression
4. **Édition** : Clique sur une question pour l'éditer en détail
5. **Validation** : Sélectionne les bonnes réponses, ajoute tags et sous-cours
6. **Sauvegarde** : Les modifications sont sauvegardées automatiquement
7. **Export** : Peut exporter la série complète en JSON

---

*Architecture créée le 05/11/2025*
