import * as ImagePicker from 'expo-image-picker'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ImagePickerComponentProps {
  onImageSelected: (uri: string) => void
}

export default function ImagePickerComponent({ onImageSelected }: ImagePickerComponentProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri)
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={pickImage}>
      <Text style={styles.text}>Galería</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03b600',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  text: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
})