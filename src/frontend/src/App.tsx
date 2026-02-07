import { useState } from 'react';
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
import AdsSettingsPanel from './components/ads/AdsSettingsPanel';
import { openWhatsApp, buildWhatsAppLink } from './lib/whatsapp';
import { checkApkAvailability, downloadApk, getUnavailableMessage } from './lib/apkAvailability';
import { useAdminAuthorization } from './hooks/useAdminAuthorization';
import type { Order } from './backend';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{ order: Order; whatsappLink?: string } | null>(null);
  const [isCheckingApk, setIsCheckingApk] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Use reactive admin authorization hook
  const { isAuthorized: showAdminDashboard } = useAdminAuthorization();

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
              <OwnerPhoto size="sm" />
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
                {isCheckingApk ? 'Checking...' : 'Download App'}
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
              <OwnerPhoto size="lg" />
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
              <h3 className="text-2xl font-bold text-foreground mb-4">Enjoy Fresh Momos</h3>
              <p className="text-foreground/70">
                Make payment and we'll deliver hot, fresh momos right to your doorstep!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Why Choose Bro Bro Foods?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-foreground mb-2">100% Veg</h3>
              <p className="text-foreground/70">
                Pure vegetarian momos made with fresh vegetables and authentic spices.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-foreground/70">
                Quick and reliable delivery service to get your momos while they're hot!
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Great Prices</h3>
              <p className="text-foreground/70">
                Affordable pricing without compromising on quality or taste.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">😋</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Delicious Taste</h3>
              <p className="text-foreground/70">
                Made fresh to order with our secret recipe that keeps customers coming back!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Now Section */}
      <section id="order-now" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-4">
              Order Now
            </h2>
            <p className="text-center text-foreground/70 mb-12">
              Fill in your details below and we'll get your fresh momos ready for delivery!
            </p>
            <OrderForm onSuccess={handleOrderSuccess} />
          </div>
        </div>
      </section>

      {/* Bottom Banner Ad Placement */}
      <AdSlot 
        slotName="bottomBanner" 
        className="container mx-auto px-4 py-6 max-w-6xl"
      />

      {/* Owner Section */}
      <section id="owner" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Meet the Owners
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Dilkhush */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Dilkhush</h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-foreground/70">
                Passionate about bringing authentic street food flavors to your doorstep with quality and care.
              </p>
            </div>

            {/* Rohit */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto 
                  size="lg"
                  imageSrc="/assets/IMG-20260207-WA0000.jpg"
                  alt="Rohit"
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Rohit</h3>
              <p className="text-primary font-semibold mb-4">Co-Founder</p>
              <p className="text-foreground/70">
                Dedicated to ensuring every customer gets the best momo experience with fresh ingredients and fast service.
              </p>
            </div>
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
            <p className="text-lg text-foreground/80 mb-8">
              Have questions or special requests? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <span>💬</span>
                WhatsApp Us
              </a>
              <button 
                onClick={handleOrderClick}
                className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity border-2 border-primary"
              >
                Place an Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/brobro-logo.dim_512x512.png" 
                alt="Bro Bro Foods" 
                className="h-8 w-8 rounded-full"
              />
              <span className="font-bold text-foreground">Bro Bro Foods</span>
            </div>
            <div className="flex items-center gap-4">
              <AdsSettingsPanel />
            </div>
            <p className="text-sm text-foreground/60">
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
