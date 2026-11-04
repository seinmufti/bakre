import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

/**
 * Opens the photo library and returns URIs that survive app restarts.
 * On native the picked files are copied out of the cache into the document directory.
 */
export async function pickPhotos(): Promise<string[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 8,
    quality: 0.7,
  });
  if (result.canceled) return [];

  if (Platform.OS === 'web') return result.assets.map((a) => a.uri);

  const dir = new Directory(Paths.document, 'listing-photos');
  if (!dir.exists) dir.create({ idempotent: true });

  return Promise.all(
    result.assets.map(async (asset, i) => {
      try {
        const ext = asset.uri.split('.').pop()?.split('?')[0] || 'jpg';
        const dest = new File(dir, `${Date.now()}-${i}.${ext}`);
        await new File(asset.uri).copy(dest);
        return dest.uri;
      } catch {
        return asset.uri;
      }
    })
  );
}
