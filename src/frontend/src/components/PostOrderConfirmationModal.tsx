import { X, Copy, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Order } from '../backend';

interface PostOrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
  whatsappLink?: string;
}

const DELIVERY_CHARGE = 20;

function PostOrderConfirmationModal({ order, onClose, whatsappLink }: PostOrderConfirmationModalProps) {
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

  const itemsTotal = Number(order.totalAmount);
  const grandTotal = itemsTotal + DELIVERY_CHARGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card rounded-2xl shadow-2xl border-2 border-border max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors bg-card rounded-full p-1"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          {/* Success Message */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-lg text-muted-foreground">
              Order ID: <span className="font-bold text-primary">#{order.id.toString()}</span>
            </p>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-accent/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Bill Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/80">Items Total:</span>
                <span className="font-semibold text-foreground">₹{itemsTotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/80">Delivery Charge:</span>
                <span className="font-semibold text-foreground">₹{DELIVERY_CHARGE}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Grand Total:</span>
                  <span className="text-2xl font-black text-primary">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paytm QR Code */}
          <div className="bg-background rounded-lg p-6 mb-6 border-2 border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Scan to Pay
            </h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/assets/generated/paytm-qr.dim_900x900.png" 
                alt="Paytm QR Code" 
                className="w-64 h-64 object-contain rounded-lg"
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Scan this QR code with Paytm to complete your payment of ₹{grandTotal}
            </p>
          </div>

          {/* WhatsApp Fallback Section */}
          {whatsappLink && (
            <div className="mb-6 space-y-3">
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm text-foreground text-center mb-3">
                  Continue on WhatsApp to confirm your order:
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary text-primary-foreground py-3 rounded-full font-bold text-center hover:opacity-90 transition-opacity mb-2"
                >
                  Open WhatsApp
                </a>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy WhatsApp Link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-semibold">{order.plateTypeName}</span> × {order.quantity.toString()} plate{Number(order.quantity) > 1 ? 's' : ''}
            </p>
            <p>
              We'll prepare your fresh momos right away!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostOrderConfirmationModal;
