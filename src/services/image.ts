import { storage, ID, CONFIG } from '@/lib/appwrite';

export class ImageService {
  
  // Check if a file ID is a valid Appwrite ID (alphanumeric + underscore, max 36 chars, no leading underscore)
  private static isValidAppwriteFileId(fileId: string): boolean {
    if (!fileId || fileId.length > 36) return false;
    if (fileId.startsWith('_')) return false;
    // Check for URL encoding or spaces that would indicate invalid ID
    if (fileId.includes('%') || fileId.includes(' ')) return false;
    return /^[a-zA-Z0-9_-]+$/.test(fileId);
  }
  
  // Upload a single image and return the file ID
  static async uploadImage(file: File): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload only image files');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }
      
      // Upload to Appwrite storage
      const uploadedFile = await storage.createFile(
        CONFIG.BUCKETS.PRODUCT_IMAGES,
        ID.unique(),
        file
      );
      
      return uploadedFile.$id;
    } catch (error) {
      console.error('Image upload failed:', error);
      
      // Provide helpful error message for missing bucket
      if (error instanceof Error && error.message.includes('bucket') && error.message.includes('could not be found')) {
        throw new Error('Storage bucket not configured. Please create the "product_images" bucket in Appwrite Console first.');
      }
      
      throw error;
    }
  }
  
  // Upload multiple images and return array of file IDs
  static async uploadMultipleImages(files: FileList): Promise<string[]> {
    try {
      const uploadPromises = Array.from(files).map(file => this.uploadImage(file));
      const fileIds = await Promise.all(uploadPromises);
      return fileIds;
    } catch (error) {
      console.error('Multiple image upload failed:', error);
      throw error;
    }
  }
  
  // Get image URL from file ID
  static getImageUrl(fileId: string): string {
    try {
      // Only try to get URL if it's a valid Appwrite file ID
      if (!this.isValidAppwriteFileId(fileId)) {
        return '';
      }
      const result = storage.getFileView(CONFIG.BUCKETS.PRODUCT_IMAGES, fileId);
      return result.toString();
    } catch (error) {
      console.error('Failed to get image URL:', error);
      return '';
    }
  }
  
  // Delete an image by file ID
  static async deleteImage(fileId: string): Promise<void> {
    try {
      // Only try to delete if it's a valid Appwrite file ID
      if (!this.isValidAppwriteFileId(fileId)) {
        throw new Error('Invalid file ID format - cannot delete placeholder images');
      }
      await storage.deleteFile(CONFIG.BUCKETS.PRODUCT_IMAGES, fileId);
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw error;
    }
  }
  
  // Delete multiple images
  static async deleteMultipleImages(fileIds: string[]): Promise<void> {
    try {
      // Filter to only valid Appwrite file IDs
      const validFileIds = fileIds.filter(id => this.isValidAppwriteFileId(id));
      if (validFileIds.length === 0) return;
      
      const deletePromises = validFileIds.map(fileId => this.deleteImage(fileId));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Multiple image deletion failed:', error);
      throw error;
    }
  }
}