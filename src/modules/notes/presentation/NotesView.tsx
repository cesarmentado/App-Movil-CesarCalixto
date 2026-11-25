
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View, } from "react-native";

import { Note } from "../domain/note.entity";
import { create, deleteNote, getAllNotes, update, } from "../infraestructure/notes.datasource";

import { NoteCard } from "./components/NoteCard";
import { NoteForm } from "./components/NoteForm";

export function NotesView() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteSelected, setNoteSelected] = useState<Note | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const data = await getAllNotes();
            setNotes(data);
        } catch (error) {
            console.log("Error al cargar notas:", error);
            Alert.alert("Error", "No se pudieron cargar las notas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const onNewNote = () => {
        setNoteSelected(null);
        setFormVisible(true);
    };

    const onEditNote = (note: Note) => {
        setNoteSelected(note);
        setFormVisible(true);
    };

    const onCloseForm = () => {
        setFormVisible(false);
        setNoteSelected(null);
    };

    const onSaveNote = async (title: string, description: string) => {
        try {
            if (noteSelected) {
                await update({...noteSelected, title, description, });
            } else {
                await create(title, description);
            }

            setFormVisible(false);
            setNoteSelected(null);
            await loadNotes();

            Alert.alert(
                "Éxito",
                noteSelected ? "Nota actualizada." : "Nota creada."
            );
        } catch (error) {
            console.log("Error al guardar nota:", error);
            Alert.alert("Error", "No se pudo guardar la nota.");
        }
    };

    const onDeleteNote = (note: Note) => {
        Alert.alert(
            "Eliminar nota",
            "¿Estás seguro de que deseas eliminar esta nota?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteNote(note.id);
                            setFormVisible(false);
                            setNoteSelected(null);
                            await loadNotes();

                            Alert.alert("Éxito", "Nota eliminada.");
                        } catch (error) {
                            console.log("Error al eliminar nota:", error);
                            Alert.alert("Error", "No se pudo eliminar la nota.");
                        }
                    },
                },
            ]
        );
    };

    if (formVisible) {
        return (
            <NoteForm
                note={noteSelected}
                onClose={onCloseForm}
                onSave={onSaveNote}
                onDelete={onDeleteNote}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Mis Notas</Text>

            <Pressable style={styles.addButton} onPress={onNewNote}>
                <Text style={styles.addButtonText}>+ Nueva nota</Text>
            </Pressable>

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <NoteCard
                            note={item}
                            onPress={onEditNote}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            No tienes notas registradas.
                        </Text>
                    }
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 25,
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: "#287a45",
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    addButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loader: {
        marginTop: 30,
    },
    list: {
        paddingVertical: 10,
        flexGrow: 1,
    },
    empty: {
        textAlign: "center",
        marginTop: 30,
        fontSize: 16,
        color: "gray",
    },
});
