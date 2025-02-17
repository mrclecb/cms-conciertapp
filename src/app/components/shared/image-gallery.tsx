import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Media } from '@/payload-types';
import { DialogTitle } from '@radix-ui/react-dialog';

export interface ImageItem {
    image: Media | string;
  }

export interface ImageGalleryProps {
  images: ImageItem[];
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const getImageUrl = (image: string | Media): string => {
    if (typeof image === 'string') return image;
    return image?.url || '';
  };

  const handlePrevious = () => {
    setSelectedImage(prev => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage(prev => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((item, index) => (
            getImageUrl(item.image) !== '' &&
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
          >
            <img
              src={getImageUrl(item.image)}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogTitle className='text-xs'>Ver imagenes</DialogTitle>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative h-[80vh]">
            {selectedImage !== null && (
              <img
                src={getImageUrl(images[selectedImage].image)}
                alt=""
                className="w-full h-full object-contain"
              />
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;