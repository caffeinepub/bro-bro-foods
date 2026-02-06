import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PromoPopupProps {
  onOrderClick: () => void;
}

function PromoPopup({ onOrderClick }: PromoPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const STORAGE_KEY = 'brobro-promo-dismissed';

  useEffect(() => {
    // Check if popup was already dismissed in this session
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
    
    if (!wasDismissed) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleOrderNow = () => {
    handleDismiss();
    onOrderClick();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Popup Content */}
      <div className="relative bg-gradient-to-br from-primary/20 via-card to-accent/20 rounded-3xl p-8 shadow-2xl border-4 border-primary max-w-md w-full animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-background/50 rounded-full p-1"
        >
          <X size={24} />
        </button>
        
        <div className="text-center pt-2">
          <div className="mb-4">
            <img 
              src="/assets/generated/momo-icon.dim_128x128.png" 
              alt="" 
              className="w-20 h-20 mx-auto mb-4"
            />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-3">
            Fresh Veg Momos
          </h3>
          <p className="text-2xl font-bold text-primary mb-6">
            Starting at ₹50
          </p>
          <button
            onClick={handleOrderNow}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity shadow-lg w-full"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromoPopup;
