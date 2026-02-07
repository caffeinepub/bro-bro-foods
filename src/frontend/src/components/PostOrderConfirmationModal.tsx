import { X, Copy, Check, Smartphone, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Order } from '../backend';
import { openPaytm, openGooglePay, openUPIApp, copyUPILink } from '../lib/upi';
import { useUpdatePaymentConfirmation } from '../hooks/useUpdatePaymentConfirmation';
import { buildWhatsAppPaymentConfirmationLink, openWhatsAppPaymentConfirmation, buildWhatsAppScreenshotRequestLink, openWhatsAppScreenshotRequest } from '../lib/whatsapp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BUSINESS_VPA, DELIVERY_CHARGE } from '../config/payment';
import { isValidVPA, getVPAErrorMessage } from '../lib/vpaValidation';

interface PostOrderConfirmationModalProps {
  order: Order;
  onClose: () => void;
  whatsappLink?: string;
}

function PostOrderConfirmationModal({ order, onClose, whatsappLink }: PostOrderConfirmationModalProps) {
  const [copied, setCopied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [showUPIFallback, setShowUPIFallback] = useState(false);
  const [whatsappFallbackLink, setWhatsappFallbackLink] = useState<string | null>(null);
  const [screenshotWhatsappFallbackLink, setScreenshotWhatsappFallbackLink] = useState<string | null>(null);
  
  // Payment confirmation form state
  const [utr, setUtr] = useState('');
  const [paidVia, setPaidVia] = useState('Google Pay');
  const [formError, setFormError] = useState('');

  const { updatePaymentConfirmation, isLoading, error, isSuccess } = useUpdatePaymentConfirmation();

  // Check if VPA is valid
  const vpaIsValid = isValidVPA(BUSINESS_VPA);

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

  const handleCopyUPILink = async () => {
    if (!vpaIsValid) return;
    
    const success = await copyUPILink({
      vpa: BUSINESS_VPA,
      amount: grandTotal,
      note: `Order #${order.id.toString()}`,
    });
    if (success) {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  const itemsTotal = Number(order.totalAmount);
  const grandTotal = itemsTotal + DELIVERY_CHARGE;

  const handlePaytmClick = () => {
    if (!vpaIsValid) return;
    
    const success = openPaytm({
      vpa: BUSINESS_VPA,
      amount: grandTotal,
      note: `Order #${order.id.toString()}`,
    });
    if (!success) {
      setShowUPIFallback(true);
    }
  };

  const handleGooglePayClick = () => {
    if (!vpaIsValid) return;
    
    const success = openGooglePay({
      vpa: BUSINESS_VPA,
      amount: grandTotal,
      note: `Order #${order.id.toString()}`,
    });
    if (!success) {
      setShowUPIFallback(true);
    }
  };

  const handleAnyUPIClick = () => {
    if (!vpaIsValid) return;
    
    const success = openUPIApp({
      vpa: BUSINESS_VPA,
      amount: grandTotal,
      note: `Order #${order.id.toString()}`,
    });
    if (!success) {
      setShowUPIFallback(true);
    }
  };

  const handleQRClick = () => {
    // Only attempt to open UPI if VPA is valid
    if (vpaIsValid) {
      handleAnyUPIClick();
    }
  };

  const handlePaymentDoneClick = () => {
    const success = openWhatsAppScreenshotRequest({
      orderId: order.id.toString(),
      grandTotal,
    });

    if (!success) {
      // Show fallback if popup blocked
      const fallbackLink = buildWhatsAppScreenshotRequestLink({
        orderId: order.id.toString(),
        grandTotal,
      });
      setScreenshotWhatsappFallbackLink(fallbackLink);
    }
  };

  const handleCopyScreenshotWhatsAppLink = () => {
    if (screenshotWhatsappFallbackLink) {
      navigator.clipboard.writeText(screenshotWhatsappFallbackLink);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate UTR
    if (!utr.trim()) {
      setFormError('Please enter the UPI Transaction ID (UTR)');
      return;
    }

    // Submit payment confirmation
    updatePaymentConfirmation(
      {
        orderId: order.id,
        utr: utr.trim(),
        paidVia,
        paymentMethodId: BigInt(1), // Default payment method ID
      },
      {
        onSuccess: () => {
          // After successful backend submission, open WhatsApp
          const whatsappOpened = openWhatsAppPaymentConfirmation({
            orderId: order.id.toString(),
            grandTotal,
            utr: utr.trim(),
            paidVia,
          });

          if (!whatsappOpened) {
            // Show fallback link if WhatsApp blocked
            const fallbackLink = buildWhatsAppPaymentConfirmationLink({
              orderId: order.id.toString(),
              grandTotal,
              utr: utr.trim(),
              paidVia,
            });
            setWhatsappFallbackLink(fallbackLink);
          }
        },
      }
    );
  };

  const handleCopyWhatsAppFallback = () => {
    if (whatsappFallbackLink) {
      navigator.clipboard.writeText(whatsappFallbackLink);
    }
  };

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

          {/* UPI QR Code */}
          <div className="bg-background rounded-lg p-6 mb-4 border-2 border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              {vpaIsValid ? 'Scan or Tap to Pay' : 'Scan to Pay'}
            </h3>
            <button
              onClick={handleQRClick}
              className={`w-full flex justify-center mb-4 ${
                vpaIsValid ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'
              }`}
              disabled={!vpaIsValid}
            >
              <img 
                src="/assets/generated/googlepay-qr.dim_900x900.png" 
                alt="UPI QR Code" 
                className="w-64 h-64 object-contain rounded-lg"
              />
            </button>
            <p className="text-sm text-center text-muted-foreground mb-4">
              {vpaIsValid 
                ? `Scan this QR code or tap it to pay ₹${grandTotal}`
                : `Scan this QR code to pay ₹${grandTotal}`
              }
            </p>

            {/* VPA Invalid Warning */}
            {!vpaIsValid && (
              <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-foreground">
                    {getVPAErrorMessage()}
                  </p>
                </div>
              </div>
            )}

            {/* UPI Payment Buttons - Disabled when VPA invalid */}
            <div className="space-y-2">
              <Button
                onClick={handlePaytmClick}
                className="w-full bg-[#00BAF2] hover:bg-[#0099CC] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!vpaIsValid}
              >
                <Smartphone className="mr-2" size={18} />
                Pay with Paytm
              </Button>
              <Button
                onClick={handleGooglePayClick}
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!vpaIsValid}
              >
                <Smartphone className="mr-2" size={18} />
                Pay with Google Pay
              </Button>
              <Button
                onClick={handleAnyUPIClick}
                variant="outline"
                className="w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!vpaIsValid}
              >
                <Smartphone className="mr-2" size={18} />
                Pay with any UPI app
              </Button>
            </div>

            {/* UPI Fallback - Only show when VPA is valid */}
            {vpaIsValid && showUPIFallback && (
              <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-border">
                <p className="text-sm text-foreground mb-2 text-center">
                  Unable to open payment app. You can copy the UPI link below:
                </p>
                <button
                  onClick={handleCopyUPILink}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2 bg-background rounded-md"
                >
                  {upiCopied ? (
                    <>
                      <Check size={16} />
                      UPI Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy UPI Payment Link
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Paste this link in any UPI app to complete payment
                </p>
              </div>
            )}
          </div>

          {/* Payment Done Button - Send Screenshot on WhatsApp */}
          <div className="mb-6">
            <Button
              onClick={handlePaymentDoneClick}
              className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-base py-6"
            >
              Payment Done (Send Screenshot on WhatsApp)
            </Button>

            {/* Screenshot WhatsApp Fallback */}
            {screenshotWhatsappFallbackLink && (
              <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-border">
                <p className="text-sm text-foreground mb-3 text-center">
                  Unable to open WhatsApp. Use the options below:
                </p>
                <div className="space-y-2">
                  <a
                    href={screenshotWhatsappFallbackLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#25D366] hover:bg-[#1EBE57] text-white py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    Open WhatsApp
                  </a>
                  <button
                    onClick={handleCopyScreenshotWhatsAppLink}
                    className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2 bg-background rounded-md"
                  >
                    <Copy size={16} />
                    Copy WhatsApp Link
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Open the link to send your payment screenshot on WhatsApp
                </p>
              </div>
            )}
          </div>

          {/* Payment Confirmation Form */}
          {!isSuccess ? (
            <div className="bg-accent/20 rounded-lg p-6 mb-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                After Payment
              </h3>
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <Label htmlFor="utr" className="text-foreground font-semibold">
                    UPI Transaction ID (UTR) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="utr"
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter 12-digit UTR number"
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="paidVia" className="text-foreground font-semibold">
                    Paid via (Optional)
                  </Label>
                  <Select value={paidVia} onValueChange={setPaidVia} disabled={isLoading}>
                    <SelectTrigger id="paidVia" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google Pay">Google Pay</SelectItem>
                      <SelectItem value="Paytm">Paytm</SelectItem>
                      <SelectItem value="PhonePe">PhonePe</SelectItem>
                      <SelectItem value="Other UPI">Other UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formError && (
                  <p className="text-sm text-destructive">{formError}</p>
                )}

                {error && (
                  <p className="text-sm text-destructive">
                    Failed to submit payment details. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Payment Details'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
                  Payment Details Submitted
                </h3>
                <p className="text-sm text-foreground/80">
                  Thank you! We've received your payment confirmation.
                </p>
              </div>

              {/* WhatsApp Fallback for Payment Confirmation */}
              {whatsappFallbackLink && (
                <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-foreground mb-2 text-center">
                    Unable to open WhatsApp. You can copy the link below:
                  </p>
                  <button
                    onClick={handleCopyWhatsAppFallback}
                    className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2 bg-accent rounded-md"
                  >
                    <Copy size={16} />
                    Copy WhatsApp Link
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WhatsApp Fallback Section (Original Order Confirmation) */}
          {whatsappLink && (
            <div className="mb-6 space-y-3">
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm text-foreground mb-2 text-center">
                  Unable to open WhatsApp automatically. Use the options below:
                </p>
                <div className="space-y-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#25D366] hover:bg-[#1EBE57] text-white py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    Open WhatsApp
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2 bg-background rounded-md"
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
            </div>
          )}

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostOrderConfirmationModal;
