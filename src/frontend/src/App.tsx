import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import PromoPopup from './components/PromoPopup';
import SimpleModal from './components/SimpleModal';
import PostOrderConfirmationModal from './components/PostOrderConfirmationModal';
import OrderForm from './components/OrderForm';
import { openWhatsApp, buildWhatsAppLink } from './lib/whatsapp';
import type { Order } from './backend';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{ order: Order; whatsappLink?: string } | null>(null);

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

  const handleDownloadAppClick = () => {
    setModalContent('App coming soon');
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
              <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </button>
              <button 
                onClick={handleOrderClick}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Order Now
              </button>
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
              <button onClick={() => scrollToSection('contact')} className="text-left text-foreground hover:text-primary transition-colors font-medium py-2">
                Contact
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
                className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity border-2 border-primary"
              >
                Download App
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce pb-8">
          <ChevronDown size={32} className="text-primary" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8">
              About Bro Bro Foods
            </h2>
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
              <p>
                Bro Bro Foods is a local food brand focused on serving fresh, hygienic and affordable Veg Momos.
              </p>
              <p>
                We believe in simple food, honest pricing and fast service.
              </p>
              <p>
                Our momos are prepared fresh after every order and delivered hot to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-12">
            Our Menu
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Half Plate */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border hover:border-primary transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src="/assets/generated/momo-icon.dim_128x128.png" 
                  alt="" 
                  className="w-16 h-16"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Veg Momos - Half Plate
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    Quantity: 12 Pieces
                  </p>
                </div>
              </div>
              <p className="text-3xl font-black text-primary mb-4">₹50</p>
              <p className="text-foreground/80">
                12 fresh veg momos served hot with spicy red chutney.
              </p>
            </div>

            {/* Full Plate */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                Best Seller
              </div>
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src="/assets/generated/momo-icon.dim_128x128.png" 
                  alt="" 
                  className="w-16 h-16"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Veg Momos - Full Plate
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    Quantity: 24 Pieces
                  </p>
                </div>
              </div>
              <p className="text-3xl font-black text-primary mb-4">₹80</p>
              <p className="text-foreground/80">
                24 fresh veg momos with special spicy chutney. Best Seller
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-12">
            How to Order
          </h2>
          <div className="max-w-2xl mx-auto">
            <ol className="space-y-6">
              {[
                'Open Bro Bro Foods App or Website',
                'Select Half Plate or Full Plate',
                'Choose your quantity (minimum 2 plates for delivery)',
                'Click "Place Order"',
                'Confirm your order on WhatsApp',
                'We prepare fresh momos and deliver to you',
              ].map((step, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="text-lg text-foreground pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-12">
            Why Choose Bro Bro Foods?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border text-center">
              <div className="text-5xl mb-4">🥟</div>
              <h3 className="text-xl font-bold text-foreground mb-3">Fresh & Hygienic</h3>
              <p className="text-foreground/80">
                Every momo is prepared fresh after your order with strict hygiene standards.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-foreground mb-3">Affordable Pricing</h3>
              <p className="text-foreground/80">
                Quality food at honest prices. No hidden charges, no surprises.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-foreground mb-3">Fast Delivery</h3>
              <p className="text-foreground/80">
                Quick preparation and delivery. Hot momos delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Now Section */}
      <section id="order-now" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-12">
            Order Now
          </h2>
          <OrderForm onSuccess={handleOrderSuccess} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8">
              Contact Us
            </h2>
            <div className="space-y-4">
              <p className="text-xl text-foreground">
                <span className="font-bold">Phone:</span>{' '}
                <a href="tel:7973782618" className="text-primary hover:underline">
                  7973782618
                </a>
              </p>
              <p className="text-xl text-foreground">
                <span className="font-bold">WhatsApp:</span>{' '}
                <a 
                  href="https://wa.me/7973782618" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Chat with us
                </a>
              </p>
              <p className="text-lg text-foreground/80 mt-6">
                Available for orders and queries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/80">
            © 2026. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Promo Popup */}
      <PromoPopup onOrderClick={handleOrderClick} />

      {/* Simple Modal (for non-order messages) */}
      {modalContent && (
        <SimpleModal 
          content={modalContent} 
          onClose={handleModalClose} 
        />
      )}

      {/* Post-Order Confirmation Modal */}
      {orderConfirmation && (
        <PostOrderConfirmationModal
          order={orderConfirmation.order}
          whatsappLink={orderConfirmation.whatsappLink}
          onClose={handleOrderConfirmationClose}
        />
      )}
    </div>
  );
}

export default App;
