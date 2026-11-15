
import { Pressable, StyleSheet, Text } from "react-native";
import { Note } from "../../domain/note.entity";

interface Props {
    note: Note;
    onPress: (note: Note) => void;
}

export function NoteCard({ note, onPress }: Props) {
    return (
        <Pressable
            style={styles.card}
            onPress={() => onPress(note)}
        >
            <Text style={styles.title}>{note.title}</Text>

            <Text style={styles.description} numberOfLines={2}>
                {note.description}
            </Text>

            <Text style={styles.date}>
                {new Date(note.created_at).toLocaleDateString()}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        padding: 18,
        marginVertical: 8,
        marginHorizontal: 15,
        borderRadius: 12,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#555",
        marginBottom: 12,
    },
    date: {
        fontSize: 12,
        color: "gray",
    },
});
