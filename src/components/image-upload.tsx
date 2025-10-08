'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageService } from '@/services/image';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string[]; // Array of image IDs
  onChange: (imageIds: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ value = [], onChange, maxImages = 5, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate preview URLs when value changes
  React.useEffect(() => {
    const urls = value.map(imageId => {
      // Try to get Appwrite URL first
      const appwriteUrl = ImageService.getImageUrl(imageId);
      if (appwriteUrl) return appwriteUrl;
      
      // Fallback to placeholder images for existing products
      const PlaceHolderImages = require('@/lib/placeholder-images').PlaceHolderImages;
      const placeholderImage = PlaceHolderImages.find((img: any) => img.id === imageId);
      return placeholderImage?.imageUrl || '';
    });
    setPreviewUrls(urls);
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
      });
      return;
    }

    setIsUploading(true);
    try {
      const newImageIds = await ImageService.uploadMultipleImages(files);
      const updatedImageIds = [...value, ...newImageIds];
      onChange(updatedImageIds);
      
      toast({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const imageIdToRemove = value[indexToRemove];
    
    // First, remove from the form state
    const updatedImageIds = value.filter((_, index) => index !== indexToRemove);
    onChange(updatedImageIds);
    
    try {
      // Only try to delete from storage if it's an actual uploaded file
      await ImageService.deleteImage(imageIdToRemove);
      toast({
        title: 'Success',
        description: 'Image removed and deleted from storage',
      });
    } catch (error) {
      // If deletion fails (e.g., placeholder image), just show success for UI removal
      console.log('Note: Could not delete from storage (likely a placeholder image):', error);
      toast({
        title: 'Success',
        description: 'Image removed from product',
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={isUploading || value.length >= maxImages}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : `Upload Images (${value.length}/${maxImages})`}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Image Previews */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={value[index]} className="relative group">
                <div className="aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  {url ? (
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Helper Text */}
        <p className="text-sm text-gray-500">
          Upload up to {maxImages} images. Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.
        </p>
      </div>
    </div>
  );
}