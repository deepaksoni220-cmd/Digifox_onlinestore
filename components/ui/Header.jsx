export default function Header({ onOpenCart, onOpenContact, onOpenShop, cartCount = 0, activeSection = 'home', onScrollToSection }) {
  return (
    <header className="header">
      <div className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        Pure Zero
      </div>
      
      <nav className="nav desktop-nav">
        <a 
          href="#home" 
          className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={(e) => onScrollToSection(e, 'home')}
        >Home</a>
        <a 
          href="#ingredients" 
          className={`nav-item ${activeSection === 'ingredients' ? 'active' : ''}`}
          onClick={(e) => onScrollToSection(e, 'ingredients')}
        >Ingredients</a>
        <a 
          href="#benefits" 
          className={`nav-item ${activeSection === 'benefits' ? 'active' : ''}`}
          onClick={(e) => onScrollToSection(e, 'benefits')}
        >Benefits</a>
        <a 
          href="#reviews" 
          className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
          onClick={(e) => onScrollToSection(e, 'reviews')}
        >Reviews</a>
      </nav>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="shop-btn" id="header-shop-btn" onClick={onOpenShop}>
          <span className="shop-text">Shop Now</span>
          <svg className="shop-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>

        <button className="cart-btn" onClick={onOpenCart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className={`cart-badge ${cartCount > 0 ? 'has-items' : ''}`}>{cartCount}</span>
        </button>

        <button className="contact-btn" onClick={onOpenContact}>
          <span className="contact-text">Contact Us</span>
          <svg className="contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </button>
      </div>
    </header>
  );
}
