import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CameraComponent from './componets/CameraComponent'
import ImagePickerComponent from './componets/ImagePicker'
import ImagePreview from './componets/ImagePreview'

export default function GalleryView() {
  const [images, setImages] = useState<string[]>([])
  
  // Modos de vista
  const [currentView, setCurrentView] = useState<'gallery' | 'selector' | 'camera' | 'preview'>('gallery')
  const [pendingUri, setPendingUri] = useState<string | null>(null)

  const handleGallerySelect = (uri: string) => {
    setPendingUri(uri)
    setCurrentView('preview')
  }

  const handleCameraCapture = (uri: string) => {
    setPendingUri(uri)
    setCurrentView('preview')
  }

  const confirmUpload = () => {
    if (pendingUri) {
      setImages((prev) => [pendingUri, ...prev])
    }
    setPendingUri(null)
    setCurrentView('gallery')
  }

  const cancelPreview = () => {
    setPendingUri(null)
    setCurrentView('gallery')
  }

  // Si el modo es 'camera', mostramos la cámara personalizada a pantalla completa
  if (currentView === 'camera') {
    return (
      <CameraComponent 
        onImageCaptured={handleCameraCapture} 
        onCancel={() => setCurrentView('gallery')} 
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.counter}>{images.length} fotos</Text>
      </View>

      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <ImagePreview uri={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay fotos aún.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.fab} onPress={() => setCurrentView('selector')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para el Menú Selector (Cámara o Galería) */}
      <Modal animationType="fade" transparent={true} visible={currentView === 'selector'} onRequestClose={() => setCurrentView('gallery')}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Origen</Text>
            
            <TouchableOpacity style={styles.cameraButtonCustom} onPress={() => setCurrentView('camera')}>
              <Text style={styles.buttonTextCustom}>Cámara</Text>
            </TouchableOpacity>

            <ImagePickerComponent onImageSelected={handleGallerySelect} />

            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setCurrentView('gallery')}>
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para la Vista Previa a PANTALLA COMPLETA */}
      <Modal animationType="slide" transparent={false} visible={currentView === 'preview'} onRequestClose={cancelPreview}>
        <View style={styles.fullScreenPreviewContainer}>
          
          {/* Imagen ocupando todo el espacio central manteniendo su proporción */}
          {pendingUri && (
            <Image
              source={{ uri: pendingUri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.previewBottomBar}>
            <TouchableOpacity style={styles.buttonCancelIcon} onPress={cancelPreview}>
              <Text style={styles.iconText}>❌</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonConfirmIcon} onPress={confirmUpload}>
              <Text style={styles.iconText}>✔</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2f5', 
    paddingTop: 60 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    paddingHorizontal: 24, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2d3436' 
  },
  counter: { 
    fontSize: 16, 
    color: '#636e72', 
    fontWeight: '600' 
  },
  grid: { 
    paddingHorizontal: 12 
  },
  emptyContainer: { 
    marginTop: 80, 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#b2bec3', 
    fontSize: 14 
  },
  footer: { 
    alignItems: 'center', 
    marginVertical: 16 
  },
  fab: { 
    width: 64,
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#4d7265', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4 
  },
  fabText: { 
    fontSize: 36, 
    color: '#fff', 
    fontWeight: '300', 
    marginTop: -2 
  },
  signOutContainer: { 
    paddingHorizontal: 24, 
    paddingBottom: 20 
  },
  signOutButton: { 
    backgroundColor: '#d63031', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  signOutText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: 300, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center', 
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#2d3436', 
    marginBottom: 16,
    textAlign: 'center'
  },
  cameraButtonCustom: {
    backgroundColor: '#e28548',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonTextCustom: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonCancel: { 
    width: '100%', 
    backgroundColor: '#fe0000', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center',
    marginTop: 10
  },
  modalButtonTextCancel: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  // ESTILOS PARA LA VISTA PREVIA A PANTALLA COMPLETA
  fullScreenPreviewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewBottomBar: {
    flexDirection: 'row',
    gap: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  buttonCancelIcon: {
    backgroundColor: '#ff7675',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },
  buttonConfirmIcon: {
    backgroundColor: '#00b894',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },
  iconText: {
    fontSize: 26
  }
})