import { supabase } from './supabase';

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, birthdate')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertProfile(userId, { name, birthdate }) {
  const { error } = await supabase
    .from('profiles')
    .upsert([{ id: userId, name, birthdate }], { onConflict: ['id'] });
  return !error;
}
