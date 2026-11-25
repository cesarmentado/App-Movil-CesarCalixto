import { Ionicons } from '@expo/vector-icons'; // Librería de iconos oficial de Expo
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraComponentProps {
  onImageCaptured: (uri: string) => void
  onCancel: () => void
}

export default function CameraComponent({ onImageCaptured, onCancel }: CameraComponentProps) {
  const [facing, setFacing] = useState<'back' | 'front'>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [loading, setLoading] = useState(false)
  const cameraRef = useRef<any>(null)

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true)
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        })
        if (photo && photo.uri) {
          onImageCaptured(photo.uri)
        }
      } catch (error) {
        console.error("Error al tomar la foto:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <View style={styles.bottomBar}>
          
          <TouchableOpacity style={styles.iconButton} onPress={onCancel}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInnerCircle} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color="#fff" />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2d3436',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#e28548',
    padding: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 30,
    paddingBottom: 45,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})