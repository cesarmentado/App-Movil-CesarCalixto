import { Image, StyleSheet, View } from 'react-native'

interface ImagePreviewProps {
  uri: string
}


export default function ImagePreview({ uri }: ImagePreviewProps) {
  return (
    <View style={styles.imageCard}>
      <Image source={{ uri }} style={styles.thumbnail} />
    </View>
  )
}

const styles = StyleSheet.create({
  imageCard: {
    flex: 1,
    margin: 8,
    height: 130,
    backgroundColor: '#b2bec3',
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
})