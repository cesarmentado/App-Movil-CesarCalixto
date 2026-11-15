
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";
import { Note } from "../../domain/note.entity";

interface Props {
    note: Note | null;
    onClose: () => void;
    onSave: (title: string, description: string) => void;
    onDelete: (note: Note) => void;
}

export function NoteForm({ note, onClose, onSave, onDelete }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setTitle(note?.title ?? "");
        setDescription(note?.description ?? "");
    }, [note]);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert("Campo obligatorio", "Escribe un título para la nota.");
            return;
        }

        onSave(title.trim(), description.trim());
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>
                {note ? "Editar nota" : "Nueva nota"}
            </Text>

            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe el título"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, styles.description]}
                placeholder="Escribe la descripción"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            {note && (
                <Pressable
                    style={styles.deleteButton}
                    onPress={() => onDelete(note)}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </Pressable>
            )}

            <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
        paddingTop: 45,
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 35,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "#dddddd",
    },
    description: {
        height: 180,
    },
    saveButton: {
        backgroundColor: "#287a45",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },
    deleteButton: {
        backgroundColor: "#d93636",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 12,
    },
    cancelButton: {
        backgroundColor: "#dddddd",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelText: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "bold",
    },
});
