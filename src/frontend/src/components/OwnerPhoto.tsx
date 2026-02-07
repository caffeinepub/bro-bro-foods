import { useState } from 'react';
import { DEFAULT_FOUNDER_IMAGE } from '@/config/ownerPhotos';

interface OwnerPhotoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageSrc?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24 md:w-32 md:h-32',
};

export default function OwnerPhoto({ 
  className = '', 
  size = 'md',
  imageSrc = DEFAULT_FOUNDER_IMAGE,
  alt = 'Founder Dilkhush'
}: OwnerPhotoProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <img
      src={imageError ? '/assets/generated/profile-placeholder.dim_512x512.png' : imageSrc}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary shadow-md ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
