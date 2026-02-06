import { X, Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SimpleModalProps {
  content: string;
  onClose: () => void;
  whatsappLink?: string;
}

function SimpleModal({ content, onClose, whatsappLink }: SimpleModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCopyLink = () => {
    if (whatsappLink) {
      navigator.clipboard.writeText(whatsappLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card rounded-2xl p-8 shadow-2xl border-2 border-border max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center pt-4">
          <p className="text-2xl font-bold text-foreground mb-6">{content}</p>
          
          {whatsappLink && (
            <div className="mb-6 space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Click below to continue on WhatsApp:
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Open WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleModal;
