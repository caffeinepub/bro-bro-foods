import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Shield, MessageCircle, Phone, MapPin } from 'lucide-react';
import PromoPopup from './components/PromoPopup';
import SimpleModal from './components/SimpleModal';
import PostOrderConfirmationModal from './components/PostOrderConfirmationModal';
import OrderForm from './components/OrderForm';
import OwnerPhoto from './components/OwnerPhoto';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdsHeadInjector from './components/ads/AdsHeadInjector';
import AdSlot from './components/ads/AdSlot';
import HashtagsBlock from './components/HashtagsBlock';
import { openWhatsApp, buildWhatsAppLink } from './lib/whatsapp';
import { checkApkAvailability, downloadApk, getUnavailableMessage, getApkSize } from './lib/apkAvailability';
import { useAdminAuthorization } from './hooks/useAdminAuthorization';
import { FOUNDER_DILKHUSH_512, FOUNDER_DILKHUSH_128, FOUNDER_ROHIT_512, FOUNDER_ROHIT_128 } from './config/ownerPhotos';
import { CONTACT_PHONE, CONTACT_LOCATION } from './config/contact';
import { BRAND_TAGLINE, COPYRIGHT_TEXT, QUICK_LINKS } from './config/footer';
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

  const handleWhatsAppClick = () => {
    const whatsappNumber = CONTACT_PHONE.replace(/[^0-9]/g, '');
    const message = encodeURIComponent('Hello! I have a question about your momos.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
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
              <h3 className="text-2xl font-bold text-foreground mb-3">Great Prices</h3>
              <p className="text-foreground/70">
                Affordable pricing without compromising on quality. Best value for money in town!
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
            <p className="text-center text-foreground/70 mb-12 text-lg">
              Fill in your details below and we'll confirm your order via WhatsApp
            </p>
            <OrderForm onSuccess={handleOrderSuccess} />
          </div>
        </div>
      </section>

      {/* Meet the Owners Section */}
      <section id="owner" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Meet the Owners
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Dilkhush - Founder & Owner */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto size="lg" imageSrc={FOUNDER_DILKHUSH_512} alt="Founder Dilkhush" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Dilkhush</h3>
              <p className="text-primary font-semibold mb-4">Founder & Owner</p>
              <p className="text-foreground/70 leading-relaxed">
                The visionary behind Bro Bro Foods, Dilkhush started this journey with a passion for bringing 
                authentic, delicious momos to the community. His commitment to quality and customer satisfaction 
                drives everything we do.
              </p>
            </div>

            {/* Rohit - Head Chef & Owner */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <OwnerPhoto size="lg" imageSrc={FOUNDER_ROHIT_512} alt="Head Chef Rohit" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Rohit</h3>
              <p className="text-primary font-semibold mb-4">Head Chef & Owner</p>
              <p className="text-foreground/70 leading-relaxed">
                As our Head Chef and co-owner, Rohit brings years of culinary expertise to every plate. 
                His secret recipes and dedication to perfection ensure that every momo we serve is 
                absolutely delicious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hashtags Section */}
      <HashtagsBlock />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-16">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-lg space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Phone</h3>
                  <a href={`tel:${CONTACT_PHONE}`} className="text-foreground/70 hover:text-primary transition-colors">
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">WhatsApp</h3>
                  <button 
                    onClick={handleWhatsAppClick}
                    className="text-foreground/70 hover:text-primary transition-colors text-left"
                  >
                    Chat with us on WhatsApp
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Location</h3>
                  <p className="text-foreground/70">{CONTACT_LOCATION}</p>
                </div>
              </div>
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
                  <span className="text-xl font-bold text-foreground">Bro Bro Foods</span>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {BRAND_TAGLINE}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.sectionId}>
                      <button 
                        onClick={() => scrollToSection(link.sectionId)}
                        className="text-foreground/70 hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>
                    <a href={`tel:${CONTACT_PHONE}`} className="hover:text-primary transition-colors">
                      {CONTACT_PHONE}
                    </a>
                  </li>
                  <li>{CONTACT_LOCATION}</li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-border pt-8 text-center">
              <p className="text-foreground/60 text-sm mb-2">
                {COPYRIGHT_TEXT}
              </p>
              <p className="text-foreground/60 text-sm">
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

      {/* Promo Popup */}
      <PromoPopup onOrderClick={handleOrderClick} />
    </div>
  );
}

export default App;
