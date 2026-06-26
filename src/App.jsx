import './index.css'

// ─── Product Data ───────────────────────────────────────────
const products = [
  { id: 1, emoji: '🌿', name: 'Giloy Ark',        sub: '500ml · Immunity Booster', price: 199, badge: 'Bestseller' },
  { id: 2, emoji: '🍯', name: 'Wild Forest Honey', sub: '250g · Raw & Unfiltered',  price: 349, badge: 'Hot' },
  { id: 3, emoji: '💊', name: 'Safed Musli Tabs',  sub: '60 tabs · Vitality',       price: 449, badge: '' },
  { id: 4, emoji: '🧴', name: 'Neem Tulsi Soap',   sub: '100g · Antibacterial',     price: 89,  badge: 'New' },
  { id: 5, emoji: '🫚', name: 'Bhringraj Oil',     sub: '200ml · Hair Growth',      price: 279, badge: '' },
  { id: 6, emoji: '🌼', name: 'Triphala Churna',   sub: '200g · Digestion',         price: 159, badge: 'Popular' },
]

// ─── Navbar ──────────────────────────────────────────────────
function Navbar({ cartCount }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🌿</div>
        <div>
          <div style={styles.logoText}>Aadesh Herbal</div>
          <div style={styles.logoSub}>& Perfume Store</div>
        </div>
      </div>

      <ul style={styles.navLinks}>
        {['Home', 'Products', 'About', 'Contact'].map(link => (
          <li key={link}><a href="#" style={styles.navLink}>{link}</a></li>
        ))}
      </ul>

      <button style={styles.cartBtn}>
        🛒 Cart <span style={styles.cartBadge}>{cartCount}</span>
      </button>
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────
function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <span style={styles.heroTag}>🌱 100% Natural & Ayurvedic</span>
        <h1 style={styles.heroTitle}>
          Nature's Best,<br />
          <span style={{ color: '#3B6D11' }}>Delivered Pure</span>
        </h1>
        <p style={styles.heroDesc}>
          Authentic herbal products — Arks, Oils, Soaps, Honey, Musli Tablets
          and more. Trusted Ayurvedic wellness for your family.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.btnPrimary}>Shop Now →</button>
          <button style={styles.btnSecondary}>Our Story</button>
        </div>
      </div>

      <div style={styles.heroGrid}>
        {products.slice(0, 4).map(p => (
          <div key={p.id} style={styles.heroCard}>
            <span style={{ fontSize: 28 }}>{p.emoji}</span>
            <span style={styles.heroCardName}>{p.name}</span>
            <span style={styles.heroCardPrice}>₹{p.price}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  return (
    <div style={styles.productCard}>
      <div style={styles.productImg}>
        {product.badge && (
          <span style={{
            ...styles.badge,
            background: product.badge === 'Hot' ? '#FAC775' : '#C0DD97',
            color:      product.badge === 'Hot' ? '#412402' : '#27500A',
          }}>
            {product.badge}
          </span>
        )}
        <span style={{ fontSize: 48 }}>{product.emoji}</span>
      </div>
      <div style={styles.productInfo}>
        <div style={styles.productName}>{product.name}</div>
        <div style={styles.productSub}>{product.sub}</div>
        <div style={styles.productFooter}>
          <span style={styles.productPrice}>₹{product.price}</span>
          <button style={styles.addBtn} onClick={() => onAdd(product)}>+</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  // useState stores data that can change — here it's the cart
  const [cart, setCart] = React.useState([])

  // This function runs when user clicks "+" on a product
  function addToCart(product) {
    setCart(prev => [...prev, product])
    alert(`✅ ${product.name} added to cart!`)
  }

  return (
    <div>
      <Navbar cartCount={cart.length} />
      <Hero />

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        {[['500+','Products'],['50K+','Customers'],['100%','Natural'],['15+','Years']].map(([num, label]) => (
          <div key={label} style={styles.statItem}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <button style={styles.seeAll}>View all →</button>
        </div>
        <div style={styles.productsGrid}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Aadesh Herbal & Perfume Store · Made with 🌿 in India</p>
      </footer>
    </div>
  )
}

// ─── We need React for useState ───────────────────────────────
import React from 'react'

// ─── All Styles ───────────────────────────────────────────────
const styles = {
  navbar:        { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', background:'#fff', borderBottom:'1px solid #e8f0dc', position:'sticky', top:0, zIndex:100 },
  logo:          { display:'flex', alignItems:'center', gap:10 },
  logoIcon:      { fontSize:28 },
  logoText:      { fontSize:17, fontWeight:600, color:'#173404' },
  logoSub:       { fontSize:11, color:'#3B6D11', letterSpacing:1 },
  navLinks:      { display:'flex', gap:'1.5rem', listStyle:'none' },
  navLink:       { fontSize:14, color:'#555', transition:'color .2s' },
  cartBtn:       { display:'flex', alignItems:'center', gap:6, background:'#3B6D11', color:'#EAF3DE', border:'none', borderRadius:8, padding:'8px 16px', fontSize:14 },
  cartBadge:     { background:'#EF9F27', color:'#412402', borderRadius:'50%', width:18, height:18, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 },
  hero:          { display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:380, background:'linear-gradient(135deg,#EAF3DE,#E1F5EE)', padding:'3rem 2rem', gap:'2rem', alignItems:'center' },
  heroContent:   { },
  heroTag:       { display:'inline-block', background:'#C0DD97', color:'#27500A', borderRadius:20, padding:'4px 14px', fontSize:12, fontWeight:500, marginBottom:'1rem' },
  heroTitle:     { fontSize:36, fontWeight:700, lineHeight:1.2, color:'#173404', marginBottom:'1rem' },
  heroDesc:      { fontSize:15, color:'#3B6D11', lineHeight:1.7, marginBottom:'1.5rem', maxWidth:420 },
  heroBtns:      { display:'flex', gap:12 },
  btnPrimary:    { background:'#3B6D11', color:'#EAF3DE', border:'none', borderRadius:8, padding:'12px 24px', fontSize:14 },
  btnSecondary:  { background:'transparent', color:'#3B6D11', border:'1.5px solid #3B6D11', borderRadius:8, padding:'12px 24px', fontSize:14 },
  heroGrid:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  heroCard:      { background:'#fff', borderRadius:12, border:'1px solid #dcedc8', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:8 },
  heroCardName:  { fontSize:13, fontWeight:500, color:'#173404' },
  heroCardPrice: { fontSize:12, color:'#3B6D11' },
  statsBar:      { display:'flex', background:'#f0f7e6', borderTop:'1px solid #dcedc8', borderBottom:'1px solid #dcedc8' },
  statItem:      { flex:1, textAlign:'center', padding:'1rem', borderRight:'1px solid #dcedc8' },
  statNum:       { fontSize:22, fontWeight:700, color:'#3B6D11' },
  statLabel:     { fontSize:12, color:'#666', marginTop:2 },
  section:       { padding:'2.5rem 2rem' },
  sectionHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' },
  sectionTitle:  { fontSize:22, fontWeight:600 },
  seeAll:        { fontSize:13, color:'#3B6D11', background:'none', border:'none' },
  productsGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem' },
  productCard:   { background:'#fff', border:'1px solid #e8f0dc', borderRadius:12, overflow:'hidden' },
  productImg:    { height:140, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#EAF3DE,#E1F5EE)', position:'relative' },
  badge:         { position:'absolute', top:8, left:8, fontSize:10, fontWeight:600, borderRadius:4, padding:'2px 8px' },
  productInfo:   { padding:12 },
  productName:   { fontSize:13, fontWeight:600, marginBottom:4 },
  productSub:    { fontSize:11, color:'#888', marginBottom:8 },
  productFooter: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  productPrice:  { fontSize:15, fontWeight:600, color:'#3B6D11' },
  addBtn:        { width:28, height:28, borderRadius:'50%', background:'#3B6D11', color:'#fff', border:'none', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' },
  footer:        { textAlign:'center', padding:'2rem', background:'#EAF3DE', color:'#3B6D11', fontSize:13, borderTop:'1px solid #dcedc8' },
}