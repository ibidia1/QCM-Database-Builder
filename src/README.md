# 📚 Plateforme de Gestion QCM Médicaux

Application web complète pour créer, gérer et valider des bases de données de QCM médicaux avec workflow de validation en 5 étapes.

## 🎯 Fonctionnalités principales

### 📤 Upload & Configuration
- Upload de séries CSV/JSON (drag & drop)
- Recherche autocomplete parmi **75 objectifs de maladies**
- Sélection de faculté : **FMT, FMM, FMS, FMSF**
- Sélection d'année académique : **2019-2035**

### 🎨 Interface en 3 étapes

1. **UploadPage** : Configuration initiale et import de fichier
2. **QuestionsGridView** : Vue d'ensemble en grille avec progression
3. **QuestionDetailPage** : Édition détaillée avec validation

### ✨ Fonctionnalités avancées

- ✅ IDs uniques pour chaque question et cas clinique
- ✅ Groupement automatique des cas cliniques
- ✅ Recherche autocomplete intelligente
- ✅ Barre de progression visuelle
- ✅ Sauvegarde automatique (localStorage)
- ✅ Export/Import JSON
- ✅ Navigation fluide entre pages
- ✅ Notifications toast
- ✅ Interface responsive

## 🏥 Objectifs de maladies (75)

L'application couvre **75 maladies** classées par spécialités :

- **Cardiologie** : HTA, Insuffisance cardiaque, Infarctus, etc.
- **Pneumologie** : Asthme, BPCO, Pneumonie, Tuberculose
- **Gastro-entérologie** : Cirrhose, Hépatites, Pancréatite, etc.
- **Néphrologie** : IRC, IRA, Infections urinaires, etc.
- **Neurologie** : AVC, Alzheimer, Parkinson, Méningite, etc.
- **Oncologie** : Cancers (poumon, sein, colorectal, prostate, etc.)
- **Endocrinologie** : Diabète, Thyroïde, Obésité, etc.
- **Rhumatologie** : Arthrose, Polyarthrite, Lupus, etc.
- **Psychiatrie** : Dépression, Schizophrénie, Trouble bipolaire
- **Infectiologie** : Paludisme, VIH, Typhoïde, etc.

📋 **Liste complète** : voir `/OBJECTIFS.md`

## 🎓 Facultés supportées

- **FMT** : Faculté de Médecine de Tanger
- **FMM** : Faculté de Médecine de Marrakech
- **FMS** : Faculté de Médecine de Sousse
- **FMSF** : Faculté de Médecine de Sfax

## 📅 Années académiques

Sélection d'année de **2019** à **2035**

## 📥 Format d'import CSV

```csv
question,propositions,cas_clinique_id
"Question simple?","Réponse A;Réponse B;Réponse C;Réponse D",
"Question cas 1","Prop1;Prop2;Prop3","cas1"
"Question cas 2","Prop1;Prop2;Prop3","cas1"
```

### Règles :
- **question** : Texte de la question (guillemets si virgules)
- **propositions** : Séparées par `;` ou `|`
- **cas_clinique_id** : Identifiant pour grouper les questions d'un même cas (optionnel)

📄 **Fichier exemple** : `/exemple-qcm.csv`

## 🚀 Démarrage rapide

1. **Uploader** un fichier CSV avec vos questions
2. **Sélectionner** l'objectif (maladie) avec la recherche
3. **Choisir** votre faculté et année
4. **Visualiser** toutes les questions en grille
5. **Cliquer** sur une question pour l'éditer
6. **Valider** les réponses correctes, tags et sous-cours
7. **Sauvegarder** automatiquement
8. **Exporter** en JSON quand c'est terminé

## 🎨 Codes couleurs

- 🟣 **Violet** : QCM simple
- 🔵 **Bleu** : Cas clinique (plusieurs questions)
- ✅ **Vert** : Question validée (réponses correctes définies)

## 💾 Stockage

Toutes les données sont sauvegardées localement dans le navigateur :
- `qcm-questions` : Toutes les questions
- `qcm-metadata` : Objectif, faculté, année
- `qcm-subcourses` : Liste des sous-cours créés

## 🔑 Système d'IDs

Chaque entité reçoit un ID unique au format :
```
qcm_1730829343_xy7k2mn4  // Question
cas_1730829343_abc123xyz // Cas clinique
```

## 📊 Workflow de validation

1. ✅ Sélection des réponses correctes (A, B, C, D, E...)
2. ✅ Type : QCM ou Cas clinique (auto-détecté)
3. ✅ Tags thématiques : Clinique, Anatomie, Biologie, Physiologie, Épidémiologie
4. ✅ Rattachement à un sous-cours
5. ✅ Ajout de justification/explication

## 📚 Documentation

- `/ARCHITECTURE.md` : Architecture technique complète
- `/OBJECTIFS.md` : Liste des 75 maladies par catégories
- `/exemple-qcm.csv` : Fichier exemple d'import
- `/guidelines/Guidelines.md` : Guide d'utilisation détaillé

## 🛠️ Technologies

- **React** avec TypeScript
- **Tailwind CSS** pour le design
- **Lucide React** pour les icônes
- **Sonner** pour les notifications
- **localStorage** pour la persistance

## 🎓 Cas d'usage

### Étudiant en médecine
Créez et organisez vos QCM de révision par maladie et par faculté

### Professeur
Construisez des banques de questions pour vos examens

### Préparation résidanat
Organisez vos QCM par objectif de maladie pour une révision ciblée

## 📈 Progression

L'application affiche votre progression :
- Nombre de questions validées / total
- Pourcentage de complétion
- Indicateurs visuels sur chaque question

## 💡 Astuces

- Utilisez la **recherche autocomplete** pour trouver rapidement une maladie
- Cliquez sur le bouton **📋** pour voir toutes les 75 maladies
- Les **cas cliniques** sont automatiquement groupés
- La **sauvegarde** est automatique à chaque modification
- **Exportez** régulièrement vos données en JSON

## 🔄 Import/Export

### Import
- CSV : Format simple avec 3 colonnes
- JSON : Export précédent de l'application

### Export
- JSON complet avec métadonnées
- Téléchargement instantané
- Réimportable ultérieurement

## 🎯 Prochaines fonctionnalités

- [ ] Recherche et filtres avancés
- [ ] Mode révision avec questions aléatoires
- [ ] Export PDF formaté
- [ ] Statistiques détaillées
- [ ] Collaboration multi-utilisateurs
- [ ] Synchronisation cloud avec Supabase

---

**Version** : 2.0  
**Dernière mise à jour** : 05/11/2025

Développé pour faciliter la création et la gestion de QCM médicaux 🏥
