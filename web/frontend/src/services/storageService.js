import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from '../firebase/config';

export const storageService = {
  /**
   * Upload a file to Firebase Storage
   * @param {File} file File object
   * @param {string} folder Target folder ('scans', 'cephalograms', 'reports', 'patients')
   * @param {function} onProgress Progress callback (percent: number)
   * @returns {Promise<{downloadURL: string, fullPath: string}>}
   */
  async uploadFile(file, folder = 'scans', onProgress = null) {
    if (!storage) {
      throw new Error("Firebase Storage is not configured.");
    }

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `${folder}/${timestamp}_${cleanFileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('[STORAGE] Upload failed:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            fullPath: uploadTask.snapshot.ref.fullPath,
            fileName: cleanFileName,
            size: file.size,
            type: file.type
          });
        }
      );
    });
  },

  /**
   * Delete a file from Firebase Storage
   * @param {string} fullPath Path in Firebase Storage
   */
  async deleteFile(fullPath) {
    if (!storage || !fullPath) return false;
    try {
      const fileRef = ref(storage, fullPath);
      await deleteObject(fileRef);
      return true;
    } catch (err) {
      console.warn('[STORAGE] Delete file error:', err.message);
      return false;
    }
  }
};
