
// Data Source para Notes
// Con Supabase

import { supabase } from "../../../lib/supabase";
import { Note } from "../domain/note.entity";

// Obtener todas las notas del usuario
export async function getAllNotes(): Promise<Note[]> {

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("No se encontró el usuario");
    }

    const { data, error } = await supabase
        .from("NOTAS")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data as Note[];
}

// Crear una nota
export async function create(
    title: string,
    description: string
): Promise<Note> {

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("No se encontró el usuario");
    }

    const { data, error } = await supabase
        .from("NOTAS")
        .insert({
            title,
            description,
            user_id: user.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Note;
}

// Actualizar una nota
export async function update(note: Note): Promise<Note> {

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("No se encontró el usuario");
    }

    const { data, error } = await supabase
        .from("NOTAS")
        .update({
            title: note.title,
            description: note.description
        })
        .eq("id", note.id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Note;
}

// Eliminar una nota
export async function deleteNote(id: number): Promise<boolean> {

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("No se encontró el usuario");
    }

    const { data, error } = await supabase
        .from("NOTAS")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");

    if (error) {
        throw error;
    }

    return data.length > 0;
}
