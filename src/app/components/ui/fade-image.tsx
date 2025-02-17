'use client'
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FadeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const FadeImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  ...props 
}: FadeImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`
          ${className}
          ${isLoading ? 'bg-muted animate-pulse' : ''}
        `}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            duration-200 linear
            ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
            ${className}
          `}
          onLoadingComplete={() => setIsLoading(false)}
          {...props}
        />
      </div>
    </div>
  );
};

export default FadeImage;