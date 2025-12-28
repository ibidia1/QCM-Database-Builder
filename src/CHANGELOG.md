# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [2.0.0] - 2025-11-05

### ✨ Nouvelles fonctionnalités majeures

#### Architecture multi-pages
- 🎯 **UploadPage** : Page d'accueil pour upload et configuration
- 📊 **QuestionsGridView** : Vue en grille avec carrés numérotés cliquables
- ✏️ **QuestionDetailPage** : Page de détail pour édition complète

#### Système d'objectifs (75 maladies)
- ✅ Liste de 75 maladies médicales par spécialités
- 🔍 Recherche autocomplete intelligente
- 📋 Bouton pour afficher toutes les maladies
- 📚 Documentation complète dans `/OBJECTIFS.md`

**Maladies par catégories** :
- Cardiologie (13)
- Pneumologie (4)
- Gastro-entérologie (11)
- Néphrologie (7)
- Neurologie (6)
- Oncologie (7)
- Endocrinologie (9)
- Rhumatologie (5)
- Psychiatrie (4)
- Infectiologie (8)
- Urgences & Réanimation (3)
- Hématologie (2)

#### Facultés mises à jour
- FMT (Faculté de Médecine de Tanger)
- FMM (Faculté de Médecine de Marrakech)
- FMS (Faculté de Médecine de Sousse)
- FMSF (Faculté de Médecine de Sfax)

#### Années académiques
- 📅 Sélection par année : **2019-2035**
- Génération dynamique de la liste

### 🎨 Composants créés

#### AutocompleteInput
- Composant réutilisable pour recherche autocomplete
- Gestion du clic en dehors
- Compteur de résultats
- Badge de sélection avec possibilité d'effacer
- Bouton pour afficher toutes les options

### 📊 Interface utilisateur

#### UploadPage
- Design moderne avec gradients
- Zone drag & drop pour upload
- Grille de configuration 3 colonnes
- Autocomplete pour les 75 objectifs
- Info bulle sur le nombre d'objectifs
- Messages d'erreur avec auto-dismiss
- Bouton de validation désactivé si champs incomplets

#### QuestionsGridView
- Grille responsive de carrés numérotés
- Distinction visuelle QCM (violet) vs Cas clinique (bleu)
- Icônes CheckCircle pour questions validées
- Barre de progression globale avec pourcentage
- Métadonnées visibles (objectif, faculté, année)
- Bouton d'export JSON
- Statistiques : nombre d'éléments et questions

#### QuestionDetailPage
- Navigation entre questions d'un cas clinique
- Édition complète de tous les champs
- Ajout/suppression de propositions
- Sélection multi-réponses correctes
- Tags thématiques
- Gestion des sous-cours
- Justifications
- Sauvegarde avec notification toast

### 📁 Fichiers ajoutés

```
/README.md                     # Documentation principale
/ARCHITECTURE.md               # Architecture technique
/OBJECTIFS.md                  # Liste des 75 maladies
/CHANGELOG.md                  # Ce fichier
/components/
  ├── AutocompleteInput.tsx    # Composant autocomplete
  ├── UploadPage.tsx           # Page 1 : Upload
  ├── QuestionsGridView.tsx    # Page 2 : Grille
  ├── QuestionDetailPage.tsx   # Page 3 : Détail
  └── OldQcmBuilderApp.tsx     # Backup ancienne version
/types.ts                      # Types TypeScript
/exemple-qcm.csv               # Fichier exemple médical
```

### 🔧 Modifications techniques

#### App.tsx
- Refactorisation complète
- Gestion de la navigation entre 3 vues
- useState pour currentView, questions, metadata
- Callbacks pour navigation
- Intégration du Toaster

#### types.ts
- Nouveau fichier avec types partagés
- QCMEntry interface
- SeriesMetadata interface

#### exemple-qcm.csv
- Mise à jour avec cas médicaux réels
- Exemples de cas cliniques cardiologie
- Exemples de cas cliniques neurologie

### 📚 Documentation

- **README.md** : Guide complet d'utilisation
- **ARCHITECTURE.md** : Documentation technique détaillée
- **OBJECTIFS.md** : Liste complète des 75 maladies par catégories
- **CHANGELOG.md** : Historique des modifications

### 🎯 Améliorations UX

- ✅ Navigation fluide entre les pages
- ✅ Sauvegarde automatique dans localStorage
- ✅ Notifications toast pour les actions
- ✅ Recherche autocomplete rapide
- ✅ Indicateurs de progression visuels
- ✅ Messages d'erreur clairs
- ✅ Boutons désactivés quand non applicable
- ✅ Confirmations pour actions destructives

### 🐛 Corrections

- Fix : Gestion des clics en dehors du dropdown autocomplete
- Fix : Parsing CSV avec guillemets et virgules
- Fix : Génération d'IDs uniques pour cas cliniques

### 🔄 Migration

L'ancienne version monolithique est sauvegardée dans `/components/OldQcmBuilderApp.tsx` pour référence.

**Pour migrer** :
1. Exporter les données existantes en JSON
2. Importer via la nouvelle UploadPage

---

## [1.0.0] - 2025-11-04

### Version initiale

- Interface monolithique
- Formulaire + liste côte à côte
- Upload CSV/JSON
- Génération d'IDs uniques
- Tags et sous-cours
- Export JSON/CSV

---

**Format** : [Version] - Date  
**Types de changements** :
- ✨ Nouvelles fonctionnalités
- 🎨 Interface utilisateur
- 🔧 Modifications techniques
- 🐛 Corrections de bugs
- 📚 Documentation
- 🔄 Migration
