import { useState } from 'react';

interface OwnerPhotoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24 md:w-32 md:h-32',
};

export default function OwnerPhoto({ className = '', size = 'md' }: OwnerPhotoProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <img
      src={imageError ? '/assets/generated/profile-placeholder.dim_512x512.png' : '/assets/IMG-20260207-WA0000.jpg'}
      alt="Owner photo"
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary shadow-md ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
