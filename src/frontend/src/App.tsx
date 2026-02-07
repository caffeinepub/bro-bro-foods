import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Shield } from 'lucide-react';
import PromoPopup from './components/PromoPopup';
import SimpleModal from './components/SimpleModal';
import PostOrderConfirmationModal from './components/PostOrderConfirmationModal';
import OrderForm from './components/OrderForm';
import OwnerPhoto from './components/OwnerPhoto';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdsHeadInjector from './components/ads/AdsHeadInjector';
import AdSlot from './components/ads/AdSlot';
import { openWhatsApp, buildWhatsAppLink } from './lib/whatsapp';
import { checkApkAvailability, downloadApk, getUnavailableMessage, getApkSize } from './lib/apkAvailability';
import { useAdminAuthorization } from './hooks/useAdminAuthorization';
import { FOUNDER_DILKHUSH_512, FOUNDER_DILKHUSH_128 } from './config/ownerPhotos';
import type { Order } from './backend';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{ order: Order; whatsappLink?: string } | null>(null);
  const [isCheckingApk, setIsCheckingApk] = useState(false);
  const [apkSize, setApkSize] = useState<string | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Use reactive admin authorization hook
  const { isAuthorized: showAdminDashboard } = useAdminAuthorization();

  // Fetch APK size on mount
  useEffect(() => {
    const fetchApkSize = async () => {
      const size = await getApkSize();
      setApkSize(size);
    };
    fetchApkSize();
  }, []);

  // If admin dashboard should be shown, render it instead of the main app
  // IMPORTANT: No ad components are mounted in this path
  if (showAdminDashboard) {
    return <AdminDashboard />;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const handleOrderClick = () => {
    scrollToSection('order-now');
  };

  const handleAdminLoginClick = () => {
    setMobileMenuOpen(false);
    setAdminLoginOpen(true);
  };

  const handleDownloadAppClick = async () => {
    setIsCheckingApk(true);
    
    try {
      const isAvailable = await checkApkAvailability();
      
      if (isAvailable) {
        // APK is available, initiate download
        downloadApk();
      } else {
        // APK not available, show status message
        setModalContent(getUnavailableMessage());
      }
    } catch (error) {
      // Error checking availability, show fallback message
      setModalContent(getUnavailableMessage());
    } finally {
      setIsCheckingApk(false);
    }
  };

  const handleOrderSuccess = (order: Order) => {
    const whatsappParams = {
      orderId: order.id.toString(),
      plateTypeName: order.plateTypeName,
      quantity: Number(order.quantity),
      totalAmount: Number(order.totalAmount),
    };

    // Try to open WhatsApp in a new tab
    const opened = openWhatsApp(whatsappParams);

    if (!opened) {
      // If popup was blocked, show confirmation modal with WhatsApp fallback link
      const link = buildWhatsAppLink(whatsappParams);
      setOrderConfirmation({ order, whatsappLink: link });
    } else {
      // Show confirmation modal without WhatsApp link (already opened)
      setOrderConfirmation({ order });
    }
  };

  const handleModalClose = () => {
    setModalContent(null);
  };

  const handleOrderConfirmationClose = () => {
    setOrderConfirmation(null);
  };

  // Build download button text with size if available
  const downloadButtonText = isCheckingApk 
    ? 'Checking...' 
    : apkSize 
      ? `Download App (${apkSize})` 
      : 'Download App';

  return (
    <div className="min-h-screen bg-background">
      {/* Inject ad provider script into head (customer-facing only) */}
      <AdsHeadInjector />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/brobro-logo.dim_512x512.png" 
                alt="Bro Bro Foods" 
                className="h-12 w-12 rounded-full"
              />
              <span className="text-2xl font-bold text-primary">Bro Bro Foods</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-foreground hover:text-primary transition-colors font-medium">
                Menu
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-foreground hover:text-primary transition-colors font-medium">
                How to Order
              </button>
              <button onClick={() => scrollToSection('why-choose-us')} className="text-foreground hover:text-primary transition-colors font-medium">
                Why Us
              </button>
              <button onClick={() => scrollToSection('owner')} className="text-foreground hover:text-primary transition-colors font-medium">
                Owner
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </button>
              <button 
                onClick={handleAdminLoginClick}
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <Shield size={16} />
                Admin Login
              </button>
              <button 
                onClick={handleOrderClick}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Order Now
              </button>
              <OwnerPhoto size="sm" imageSrc={FOUNDER_DILKHUSH_128} alt="Founder Dilkhush" />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-3">
              <button onClick={() => scrollToSection('about')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                About
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Menu
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                How to Order
              </button>
              <button onClick={() => scrollToSection('why-choose-us')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Why Us
              </button>
              <button onClick={() => scrollToSection('owner')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Owner
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Contact
              </button>
              <button 
                onClick={handleAdminLoginClick}
                className="text-left text-foreground hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
              >
                <Shield size={16} />
                Admin Login
              </button>
              <button 
                onClick={handleOrderClick}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity text-center"
              >
                Order Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-secondary">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/assets/generated/hero-momos-bg.dim_1920x1080.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight">
              Bro Bro Foods
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/90 mb-4 font-bold">
              Fresh Veg Momos, Fast Delivery
            </p>
            <p className="text-xl md:text-2xl text-primary font-bold mb-8">
              Half Plate ₹50 | Full Plate ₹80
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOrderClick}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                Order Now
              </button>
              <button 
                onClick={handleDownloadAppClick}
                disabled={isCheckingApk}
                className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadButtonText}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce pb-8">
          <ChevronDown size={32} className="text-primary" />
        </div>
      </section>

      {/* Top Banner Ad Placement */}
      <AdSlot 
        slotName="topBanner" 
        className="container mx-auto px-4 py-6 max-w-6xl"
      />

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <OwnerPhoto size="lg" imageSrc={FOUNDER_DILKHUSH_512} alt="Founder Dilkhush" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8">
              About Bro Bro Foods
            </h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              Welcome to Bro Bro Foods! We're passionate about serving the most delicious, fresh veg momos in town. 
              Every plate is made with love and the finest ingredients, ensuring you get the perfect taste every single time.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Whether you're craving a quick snack or a full meal, our momos are the perfect choice. 
              Fast delivery, great prices, and unbeatable taste – that's our promise to you!
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Our Menu
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Half Plate */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-center">
                <div className="text-6xl mb-4">🥟</div>
                <h3 className="text-3xl font-bold text-foreground mb-2">Half Plate</h3>
                <p className="text-4xl font-black text-primary mb-4">₹50</p>
                <p className="text-foreground/70 mb-6">
                  Perfect for a quick snack or light meal. 6 pieces of steaming hot, delicious veg momos.
                </p>
                <ul className="text-left space-y-2 text-foreground/80">
                  <li>✓ 6 Fresh Veg Momos</li>
                  <li>✓ Served with Chutney</li>
                  <li>✓ Made to Order</li>
                </ul>
              </div>
            </div>

            {/* Full Plate */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary hover:border-primary transition-colors">
              <div className="text-center">
                <div className="text-6xl mb-4">🥟🥟</div>
                <h3 className="text-3xl font-bold text-foreground mb-2">Full Plate</h3>
                <p className="text-4xl font-black text-primary mb-4">₹80</p>
                <p className="text-foreground/70 mb-6">
                  The ultimate momo experience! 12 pieces of our signature veg momos to satisfy your cravings.
                </p>
                <ul className="text-left space-y-2 text-foreground/80">
                  <li>✓ 12 Fresh Veg Momos</li>
                  <li>✓ Served with Chutney</li>
                  <li>✓ Made to Order</li>
                  <li>✓ Best Value!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            How to Order
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Choose Your Plate</h3>
              <p className="text-foreground/70">
                Select between Half Plate (6 momos) or Full Plate (12 momos) based on your appetite.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-primary">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Place Your Order</h3>
              <p className="text-foreground/70">
                Fill in your details and confirm your order. We'll send you payment details via WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-primary">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Pay & Enjoy</h3>
              <p className="text-foreground/70">
                Complete payment via UPI and confirm. Your fresh, hot momos will be delivered fast!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner Ad Placement */}
      <AdSlot 
        slotName="bottomBanner" 
        className="container mx-auto px-4 py-6 max-w-6xl"
      />

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Why Choose Bro Bro Foods?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">100% Fresh & Veg</h3>
              <p className="text-foreground/70">
                We use only the freshest vegetables and ingredients. Every momo is made fresh to order.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Fast Delivery</h3>
              <p className="text-foreground/70">
                Quick preparation and delivery. Your momos arrive hot and fresh at your doorstep.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Great Value</h3>
              <p className="text-foreground/70">
                Affordable prices without compromising on quality. Best momos at the best price!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Owner Section */}
      <section id="owner" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Meet the Owners
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Dilkhush */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto size="lg" imageSrc={FOUNDER_DILKHUSH_512} alt="Dilkhush - Co-Founder" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Dilkhush</h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-foreground/70 leading-relaxed">
                Passionate about bringing authentic street food flavors to your doorstep with quality and care.
              </p>
            </div>

            {/* Rohit */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Rohit</h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-foreground/70 leading-relaxed">
                Dedicated to ensuring every customer gets the best momo experience with fresh ingredients and fast service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Now Section */}
      <section id="order-now" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-8">
              Order Now
            </h2>
            <p className="text-center text-foreground/70 mb-12">
              Fill in your details below and we'll get your fresh momos ready for delivery!
            </p>
            <OrderForm onSuccess={handleOrderSuccess} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8">
              Get in Touch
            </h2>
            <p className="text-lg text-foreground/70 mb-12">
              Have questions or special requests? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us
              </a>
              <button 
                onClick={handleOrderClick}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity"
              >
                Place an Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="/assets/generated/brobro-logo.dim_512x512.png" 
                    alt="Bro Bro Foods" 
                    className="h-12 w-12 rounded-full"
                  />
                  <span className="text-xl font-bold text-primary">Bro Bro Foods</span>
                </div>
                <p className="text-foreground/70 text-sm">
                  Fresh veg momos delivered fast. Quality you can taste!
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button onClick={() => scrollToSection('about')} className="text-foreground/70 hover:text-primary transition-colors">
                      About
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('menu')} className="text-foreground/70 hover:text-primary transition-colors">
                      Menu
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('order-now')} className="text-foreground/70 hover:text-primary transition-colors">
                      Order Now
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('contact')} className="text-foreground/70 hover:text-primary transition-colors">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-foreground mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>📞 +91 98765 43210</li>
                  <li>📧 hello@brobrofoods.com</li>
                  <li>📍 Your City, India</li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
              <p>
                © 2026. Built with ❤️ using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PromoPopup onOrderClick={handleOrderClick} />
      {modalContent && (
        <SimpleModal 
          content={modalContent}
          onClose={handleModalClose}
        />
      )}
      {orderConfirmation && (
        <PostOrderConfirmationModal
          order={orderConfirmation.order}
          whatsappLink={orderConfirmation.whatsappLink}
          onClose={handleOrderConfirmationClose}
        />
      )}
      <AdminLoginModal 
        open={adminLoginOpen} 
        onOpenChange={setAdminLoginOpen}
      />
    </div>
  );
}

export default App;
