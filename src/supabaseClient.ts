import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Vérification que les clés sont bien définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes !');
  console.error('Vérifiez que votre fichier .env.local contient :');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Client Supabase initialisé');