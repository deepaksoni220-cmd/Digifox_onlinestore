"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/ui/Header";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { 
  ssr: false,
  loading: () => (
    <div className="scene-loader-container">
      <div className="scene-loader-ring"></div>
      <div className="scene-loader-text">Loading 3D Experience</div>
    </div>
  )
});

gsap.registerPlugin(ScrollTrigger, useGSAP);

const policies = {
  privacy: {
    title: 'Privacy Policy',
    content: '<p>Your privacy is important to us. It is Pure Zero\'s policy to respect your privacy regarding any information we may collect from you across our website.</p><p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p><p>We don\'t share any personally identifying information publicly or with third-parties, except when required to by law.</p>'
  },
  shipping: {
    title: 'Shipping Policy',
    content: '<p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p><p>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p><p>Shipping charges for your order will be calculated and displayed at checkout.</p>'
  },
  returns: {
    title: 'Returns & Refunds',
    content: '<p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p><p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p><p>If your return is approved, we will initiate a refund to your credit card (or original method of payment).</p>'
  }
};

const flavorDetails = {
  classic: { title: 'Diet Classic', img: '/assets/Green_Soda.png', filter: '' },
  blue: { title: 'Zero Lime', img: '/assets/Blue_Soda.png', filter: '' },
  berry: { title: 'Berry Blush', img: '/assets/Green_Soda.png', filter: 'hue-rotate(240deg)' },
  citrus: { title: 'Citrus Burst', img: '/assets/Green_Soda.png', filter: 'hue-rotate(60deg)' },
  tropical: { title: 'Tropical Passion', img: '/assets/Blue_Soda.png', filter: 'hue-rotate(150deg)' }
};

const shopProducts = [
  {
    flavor: 'classic',
    title: 'Diet Classic',
    desc: 'The original crisp recipe. Natural energy from Amazonian Guaraná with zero sugar.',
    price: 2.99,
    imgClass: 'hue-classic',
    imgSrc: '/assets/Green_Soda.png'
  },
  {
    flavor: 'blue',
    title: 'Zero Lime',
    desc: 'Zesty, refreshing twist of lime that dances on your palate with zero compromise.',
    price: 2.99,
    imgClass: 'hue-blue',
    imgSrc: '/assets/Blue_Soda.png'
  },
  {
    flavor: 'berry',
    title: 'Berry Blush',
    desc: 'A premium blend of wild forest berries and crisp bubbles for a sweet, vibrant lift.',
    price: 2.99,
    imgClass: 'hue-berry',
    imgSrc: '/assets/Green_Soda.png'
  },
  {
    flavor: 'citrus',
    title: 'Citrus Burst',
    desc: 'An energizing fusion of natural orange and tangerine essences to refresh your day.',
    price: 2.99,
    imgClass: 'hue-citrus',
    imgSrc: '/assets/Green_Soda.png'
  },
  {
    flavor: 'tropical',
    title: 'Tropical Passion',
    desc: 'A sunny getaway of mango, passionfruit, and pineapple flavors with clean energy.',
    price: 2.99,
    imgClass: 'hue-tropical',
    imgSrc: '/assets/Blue_Soda.png'
  }
];

function ShopCard({ flavor, title, desc, price, imgClass, imgSrc, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(flavor, price);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <div className="shop-card">
      <div className="shop-card-img-container">
        <img className={`shop-card-img ${imgClass}`} src={imgSrc} alt={title} />
      </div>
      <div className="shop-card-content">
        <h4 className="shop-card-title">{title}</h4>
        <p className="shop-card-desc">{desc}</p>
        <div className="shop-card-footer">
          <span className="shop-card-price">${price.toFixed(2)}</span>
          <button 
            className="shop-add-btn" 
            onClick={handleAdd}
            style={added ? { background: '#fbcfe8', color: '#011d17', borderColor: '#fbcfe8' } : {}}
          >
            {added ? 'Added! ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [flavor, setFlavor] = useState("classic");
  const mainRef = useRef();
  const reviewsRef = useRef(null);
  const carouselRef = useRef(null);
  const benefitsRef = useRef(null);

  const scrollReviews = (direction) => {
    if (reviewsRef.current) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const scrollAmount = isMobile 
        ? reviewsRef.current.offsetWidth * direction 
        : 450 * direction;
      reviewsRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'cart', 'contact', 'checkout', 'shop', 'policy'
  const [policyType, setPolicyType] = useState('privacy'); // 'privacy', 'shipping', 'returns'
  
  // Navigation active state
  const [activeSection, setActiveSection] = useState('home');

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  
  const openModal = (modalName) => {
    setActiveModal(modalName);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };
  
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "auto";
  };
  
  const openPolicy = (type) => {
    setPolicyType(type);
    openModal('policy');
  };

  const addToCart = (flavorName, price) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.flavor === flavorName);
      if (existing) {
        return prev.map(item => item.flavor === flavorName ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { flavor: flavorName, price, quantity: 1 }];
    });
  };

  const updateQty = (index, change) => {
    setCartItems(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          return { ...item, quantity: item.quantity + change };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  useGSAP(() => {
    // Reveal animations
    const revealElements = gsap.utils.toArray('.gs-reveal, .css-reveal');
    revealElements.forEach((elem) => {
      ScrollTrigger.create({
        trigger: elem,
        start: "top 85%",
        onEnter: () => elem.classList.add("visible"),
        once: true
      });
    });

    // Update active section on scroll
    const sections = ['home', 'ingredients', 'benefits', 'reviews'];
    sections.forEach((id) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(id);
          }
        }
      });
    });
  }, { scope: mainRef });

  useEffect(() => {
    if (flavor === "blue") {
      document.body.classList.add("blue-theme");
    } else {
      document.body.classList.remove("blue-theme");
    }
  }, [flavor]);

  const flavorRef = useRef(flavor);
  useEffect(() => {
    flavorRef.current = flavor;
  }, [flavor]);

  useEffect(() => {
    const handleScroll = (container, isCarousel = false) => {
      if (!container) return;
      if (window.innerWidth > 768) return;
      
      const cards = container.children;
      if (!cards || cards.length === 0) return;
      
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.classList.remove('active-card', 'left-card', 'right-card');
        if (i === closestIndex) {
          card.classList.add('active-card');
          if (isCarousel) {
            const flavorName = card.getAttribute('data-flavor');
            if (flavorName && flavorName !== flavorRef.current) {
              setFlavor(flavorName);
            }
          }
        } else if (i < closestIndex) {
          card.classList.add('left-card');
        } else {
          card.classList.add('right-card');
        }
      }
    };

    const carousel = carouselRef.current;
    const benefits = benefitsRef.current;
    
    const onCarouselScroll = () => handleScroll(carousel, true);
    const onBenefitsScroll = () => handleScroll(benefits, false);
    
    // Initial run
    handleScroll(carousel, true);
    handleScroll(benefits, false);
    
    if (carousel) carousel.addEventListener('scroll', onCarouselScroll);
    if (benefits) benefits.addEventListener('scroll', onBenefitsScroll);
    
    const handleResize = () => {
      handleScroll(carousel, true);
      handleScroll(benefits, false);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (carousel) carousel.removeEventListener('scroll', onCarouselScroll);
      if (benefits) benefits.removeEventListener('scroll', onBenefitsScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Sync flavor selection back to scroll position on mobile
    if (carouselRef.current && window.innerWidth <= 768) {
      const activeCard = carouselRef.current.querySelector(`.card[data-flavor="${flavor}"]`);
      if (activeCard) {
        const container = carouselRef.current;
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;
        const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
        if (Math.abs(containerCenter - cardCenter) > 20) {
          activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [flavor]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      <main ref={mainRef}>
        <Header 
          onOpenCart={() => openModal('cart')} 
          onOpenContact={() => openModal('contact')} 
          onOpenShop={() => openModal('shop')}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          activeSection={activeSection}
          onScrollToSection={scrollToSection}
        />
        
        <section className="hero" id="home">
          <div className="hero-content">
            <Scene flavor={flavor} />
            <div className="hero-left">
              <h1 className="main-title">
                <span className="text-outline">Pure</span><br/>Zero
              </h1>
              <p className="description">
                Refreshment redefined in every bubble — <br/>
                all in one sleek design.
              </p>
              <div className="cta-group">
                <button className="primary-btn" onClick={() => openModal('shop')}>
                  Shop Now
                  <span className="plus-icon">+</span>
                </button>
              </div>
              <div className="award-badge">
                <div className="award-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15L15 18L19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="award-text">
                  <span className="award-title">DESIGN AWARDS</span>
                  <span className="award-subtitle">PREMIUM BEVERAGE 2025</span>
                </div>
              </div>
            </div>
            
            <div className="hero-right">
              <nav className="nav glass mobile-nav">
                <a 
                  href="#home" 
                  className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'home')}
                >Home</a>
                <a 
                  href="#ingredients" 
                  className={`nav-item ${activeSection === 'ingredients' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'ingredients')}
                >Ingredients</a>
                <a 
                  href="#benefits" 
                  className={`nav-item ${activeSection === 'benefits' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'benefits')}
                >Benefits</a>
                <a 
                  href="#reviews" 
                  className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'reviews')}
                >Reviews</a>
              </nav>
              
              <h2 className="side-title">
                <span className="text-outline">Taste</span><br/>
                <span className="text-outline">The</span><br/>
                Future
              </h2>
              <div className="product-carousel">
                <div className="carousel-cards" ref={carouselRef}>
                  <div 
                    className={`card ${flavor === 'classic' ? 'active' : ''}`} 
                    data-flavor="classic"
                    onClick={(e) => {
                      setFlavor("classic");
                      if (window.innerWidth <= 768) {
                        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }
                    }}
                  >
                    <img src="/assets/Green_Soda.png" alt="Diet Classic" />
                    <div className="card-info">
                      <span>Diet Classic</span>
                      <span>$2.99</span>
                    </div>
                  </div>
                  <div 
                    className={`card ${flavor === 'blue' ? 'active' : ''}`} 
                    data-flavor="blue"
                    onClick={(e) => {
                      setFlavor("blue");
                      if (window.innerWidth <= 768) {
                        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }
                    }}
                  >
                    <img src="/assets/Blue_Soda.png" alt="Zero Lime" style={{ filter: 'brightness(0.7)' }} />
                    <div className="card-info">
                      <span>Zero Lime</span>
                      <span>$2.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ingredients" className="scrolling-section">
          <div className="section-content">
            <h2 className="section-title text-center css-reveal">100% Natural<br/>Ingredients</h2>
            <div className="split-layout">
              <div className="text-block css-reveal">
                <h3>Nature's Best<br/>In Every Drop</h3>
                <p>We source only the finest organic fruits and natural botanicals. No artificial colors, no synthetic flavors. Just pure, unadulterated refreshment that revitalizes your body and mind.</p>
                <ul style={{ marginTop: '1.8rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', color: 'var(--muted-color)' }}>
                    <li><span style={{ color: 'var(--accent-color)', marginRight: '12px' }}>✓</span> 100% Organic & Ethically Sourced</li>
                    <li><span style={{ color: 'var(--accent-color)', marginRight: '12px' }}>✓</span> Rich in natural antioxidants</li>
                    <li><span style={{ color: 'var(--accent-color)', marginRight: '12px' }}>✓</span> Smooth, enduring energy lift</li>
                    <li><span style={{ color: 'var(--accent-color)', marginRight: '12px' }}>✓</span> Zero artificial preservatives</li>
                </ul>
              </div>
              <div className="image-block css-reveal">
                <img src="/assets/Blue_Soda.png" alt="Natural Ingredients" />
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="scrolling-section">
            <div className="section-content">
                <h2 className="section-title text-center css-reveal">Why Pure Zero?</h2>
                <div className="benefits-grid" ref={benefitsRef}>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">✨</div>
                        <h3>Zero Sugar</h3>
                        <p>Sweetened naturally. Experience full flavor with absolutely zero sugar or artificial aftertaste. Perfect for guilt-free daily hydration.</p>
                    </div>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">⚡</div>
                        <h3>Natural Energy</h3>
                        <p>Powered by Amazonian Guaraná to give you a clean, lasting energy boost throughout the day without the sudden caffeine crash.</p>
                    </div>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">🌿</div>
                        <h3>Clean Crisp Taste</h3>
                        <p>A refreshing, light profile that dances on your palate. Perfect for any occasion, from intense workouts to evening dinner parties.</p>
                    </div>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">💎</div>
                        <h3>Premium Quality</h3>
                        <p>Crafted with the finest, ethically-sourced ingredients to deliver a luxurious, top-tier beverage experience with every sip.</p>
                    </div>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">🌍</div>
                        <h3>Eco-Friendly</h3>
                        <p>Our cans are 100% recyclable. We are committed to a zero-carbon footprint and sustainable manufacturing processes.</p>
                    </div>
                    <div className="benefit-card glass css-reveal">
                        <div className="benefit-icon">🍎</div>
                        <h3>Essential Vitamins</h3>
                        <p>Fortified with essential B-vitamins and antioxidants to support your immune system and overall well-being.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="reviews" className="scrolling-section">
            <div className="section-content">
                <h2 className="section-title css-reveal text-center">The Verdict</h2>
                <div className="reviews-slider-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="reviews-slider" ref={reviewsRef}>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"The crispest diet soda I've ever tasted. The natural guarana kick is exactly what I need in the afternoon."</p>
                            <span className="reviewer">— Priya S.</span>
                        </div>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"Finally, a zero sugar drink that actually tastes premium. The branding is stunning, but the taste is even better."</p>
                            <span className="reviewer">— Rahul V.</span>
                        </div>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"A complete game-changer. The subtle berry notes mixed with the crisp carbonation make this my daily go-to."</p>
                            <span className="reviewer">— Ananya D.</span>
                        </div>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"I stopped drinking regular soda months ago, but this brought me back. It’s absolutely delicious and gives me a clean energy boost."</p>
                            <span className="reviewer">— Arjun K.</span>
                        </div>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"The glassmorphism-inspired can design matches the premium taste perfectly. It's my favorite drink to serve at gatherings."</p>
                            <span className="reviewer">— Neha R.</span>
                        </div>
                        <div className="review-card glass css-reveal">
                            <div className="stars">★★★★★</div>
                            <p className="review-text">"I love that there's no caffeine crash. It keeps me alert during long coding sessions without any weird aftertastes."</p>
                            <span className="reviewer">— Vikram M.</span>
                        </div>
                    </div>
                    <div className="reviews-slider-navigation">
                        <button className="slider-arrow-bottom glass" onClick={() => scrollReviews(-1)} aria-label="Previous review">←</button>
                        <button className="slider-arrow-bottom glass" onClick={() => scrollReviews(1)} aria-label="Next review">→</button>
                    </div>
                </div>
            </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Pure Zero</span>
            </div>
            <div className="footer-links">
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Home</a>
              <a href="#ingredients" onClick={(e) => scrollToSection(e, 'ingredients')}>Ingredients</a>
              <a href="#benefits" onClick={(e) => scrollToSection(e, 'benefits')}>Benefits</a>
              <a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')}>Reviews</a>
            </div>
            <div className="footer-legal-links" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); openModal('contact'); }} style={{ color: 'var(--muted-color)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s' }}>Contact Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openPolicy('privacy'); }} style={{ color: 'var(--muted-color)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s' }}>Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openPolicy('shipping'); }} style={{ color: 'var(--muted-color)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s' }}>Shipping Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openPolicy('returns'); }} style={{ color: 'var(--muted-color)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s' }}>Returns & Refunds</a>
            </div>
            <div className="copyright">© 2026 Pure Zero Beverages. All rights reserved.</div>
          </div>
        </footer>
      </main>

      {/* Modals and Overlays */}
      <div 
        className={`overlay-backdrop ${activeModal ? 'active' : ''}`} 
        onClick={closeModal}
      />

      {/* Cart Modal */}
      <div className={`cart-panel glass ${activeModal === 'cart' ? 'active' : ''}`} style={{ transform: activeModal === 'cart' ? 'translateX(0)' : 'translateX(100%)' }}>
          <div className="panel-header">
              <h3>Your Cart</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
          </div>
          <div className="cart-items" style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
              {cartItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted-color)', marginTop: '2rem' }}>Your cart is empty.</p>
              ) : (
                cartItems.map((item, idx) => {
                  const details = flavorDetails[item.flavor] || flavorDetails['classic'];
                  return (
                    <div className="cart-item" key={idx}>
                        <img src={details.img} alt={details.title} style={details.filter ? { filter: details.filter } : {}} />
                        <div className="cart-item-details">
                            <span className="cart-item-title">{details.title}</span>
                            <span className="cart-item-price">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="cart-qty">
                            <button className="qty-btn" onClick={() => updateQty(idx, -1)}>-</button>
                            <span className="qty-val">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQty(idx, 1)}>+</button>
                        </div>
                    </div>
                  );
                })
              )}
          </div>
          <div className="cart-footer" style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span id="cart-total-price">${cartTotal}</span>
              </div>
              <button className="primary-btn checkout-btn" onClick={() => openModal('checkout')} style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout
              </button>
          </div>
      </div>

      {/* Shop Modal */}
      <div 
        className="shop-modal glass" 
        style={{ 
          opacity: activeModal === 'shop' ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${activeModal === 'shop' ? 1 : 0.9})`,
          pointerEvents: activeModal === 'shop' ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex'
        }}
      >
          <div className="panel-header">
              <h3>Pure Zero Collection</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
          </div>
          <div className="shop-grid-container">
              <div className="shop-grid">
                  {shopProducts.map((prod, idx) => (
                    <ShopCard 
                      key={idx}
                      flavor={prod.flavor}
                      title={prod.title}
                      desc={prod.desc}
                      price={prod.price}
                      imgClass={prod.imgClass}
                      imgSrc={prod.imgSrc}
                      onAddToCart={addToCart}
                    />
                  ))}
              </div>
          </div>
      </div>

      {/* Policy Modal */}
      <div 
        className="contact-modal glass" 
        style={{ 
          opacity: activeModal === 'policy' ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${activeModal === 'policy' ? 1 : 0.9})`,
          pointerEvents: activeModal === 'policy' ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'block',
          maxWidth: '600px',
          width: '90vw',
          zIndex: 1002
        }}
      >
          <div className="panel-header">
              <h3>{policies[policyType]?.title || 'Policy'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
          </div>
          <div className="contact-form" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
              <div 
                style={{ color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1rem' }}
                dangerouslySetInnerHTML={{ __html: policies[policyType]?.content || '' }}
              />
          </div>
      </div>

      {/* Contact Us Modal */}
      <div 
        className="contact-modal glass" 
        style={{ 
          opacity: activeModal === 'contact' ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${activeModal === 'contact' ? 1 : 0.9})`,
          pointerEvents: activeModal === 'contact' ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'block',
          width: '90%', 
          maxWidth: '500px' 
        }}
      >
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Contact Us</h3>
              <button className="close-btn" onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
          </div>
          <div className="contact-form">
              <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>We'd love to hear from you. Drop us a line!</p>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <input type="text" placeholder="Name" className="glass-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }} />
              </div>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <input type="email" placeholder="Email" className="glass-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }} />
              </div>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <textarea placeholder="Message" className="glass-input" rows="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }}></textarea>
              </div>
              <button className="primary-btn" onClick={closeModal} style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message
              </button>
          </div>
      </div>

      {/* Checkout Modal */}
      <div 
        className="checkout-modal glass" 
        style={{ 
          opacity: activeModal === 'checkout' ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${activeModal === 'checkout' ? 1 : 0.9})`,
          pointerEvents: activeModal === 'checkout' ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          width: '90%', 
          maxWidth: '800px' 
        }}
      >
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Checkout</h3>
              <button className="close-btn" onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
          </div>
          <div className="checkout-content" style={{ display: 'flex', gap: '2rem' }}>
              <div className="checkout-form" style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '1rem' }}>Shipping Information</h4>
                  <input type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }} />
                  <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }} />
                  <input type="text" placeholder="Shipping Address" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }} />
                  <button className="primary-btn" onClick={() => { alert('Order placed!'); setCartItems([]); closeModal(); }} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                      Pay Now
                  </button>
              </div>
              <div className="checkout-summary" style={{ flex: 0.8, background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Order Summary</h4>
                  <div style={{ marginBottom: 'auto' }}>
                    {cartItems.map((item, idx) => {
                      const details = flavorDetails[item.flavor] || flavorDetails['classic'];
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ background: 'rgba(255,255,255,0.1)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.75rem' }}>{item.quantity}</span>
                            <span>{details.title}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontWeight: 'bold' }}>
                      <span>Total</span>
                      <span id="checkout-total-price">${cartTotal}</span>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
