import React, { useState, useEffect } from 'react'
import './index.css'
import Products from './Products.jsx'
import Cart from './Cart.jsx'
import ProductDetail from './ProductDetail.jsx'
import Login from './Login.jsx'
import Address from './Address.jsx'
import Checkout from './Checkout.jsx'
import { api } from './api.js'

export const allProducts = [
  { id:1,  emoji:'🌿', name:'Giloy Ark',          sub:'500ml · Immunity',        mrp:299,  price:199, badge:'Bestseller', category:'Ark',        desc:'Pure Giloy Ark extracted using traditional methods. Boosts immunity, fights infections and purifies blood naturally.' },
  { id:2,  emoji:'🍯', name:'Wild Forest Honey',   sub:'250g · Raw & Pure',       mrp:499,  price:349, badge:'Hot',        category:'Honey',      desc:'Collected from wild forest beehives. Raw, unprocessed and full of natural enzymes.' },
  { id:3,  emoji:'💊', name:'Safed Musli Tabs',    sub:'60 tabs · Vitality',      mrp:599,  price:449, badge:'',           category:'Tablets',    desc:'Premium Safed Musli tablets for strength and vitality. 100% natural.' },
  { id:4,  emoji:'🧴', name:'Neem Tulsi Soap',     sub:'100g · Antibacterial',    mrp:120,  price:89,  badge:'New',        category:'Soap',       desc:'Handmade soap with pure Neem and Tulsi extracts. Kills bacteria and prevents acne.' },
  { id:5,  emoji:'🫚', name:'Bhringraj Oil',       sub:'200ml · Hair Growth',     mrp:399,  price:279, badge:'',           category:'Oil',        desc:'Traditional Bhringraj hair oil. Reduces hair fall and promotes growth.' },
  { id:6,  emoji:'🌹', name:'Rose Ittar',          sub:'10ml · Long Lasting',     mrp:699,  price:499, badge:'Popular',    category:'Ittar',      desc:'Pure Rose Ittar distilled from fresh rose petals. Alcohol-free and long lasting.' },
  { id:7,  emoji:'🌱', name:'Ashwagandha Ark',     sub:'500ml · Stress Relief',   mrp:349,  price:229, badge:'',           category:'Ark',        desc:'Ashwagandha Ark for stress relief and better sleep.' },
  { id:8,  emoji:'🍋', name:'Neem Honey',          sub:'250g · Skin & Immunity',  mrp:399,  price:299, badge:'',           category:'Honey',      desc:'Neem infused honey for skin health and immunity.' },
  { id:9,  emoji:'🌸', name:'Rose Face Wash',      sub:'100ml · Glowing Skin',    mrp:199,  price:149, badge:'New',        category:'Face Wash',  desc:'Gentle rose face wash for glowing skin.' },
  { id:10, emoji:'🧘', name:'Shatavari Tablets',   sub:'60 tabs · Women Health',  mrp:549,  price:399, badge:'Popular',    category:'Tablets',    desc:'Shatavari tablets for women wellness and hormonal balance.' },
  { id:11, emoji:'🌻', name:'Sesame Oil',          sub:'200ml · Joint Relief',    mrp:349,  price:249, badge:'',           category:'Oil',        desc:'Pure cold pressed sesame oil for joint pain.' },
  { id:12, emoji:'✨', name:'Oud Perfume',          sub:'50ml · Premium',          mrp:1199, price:799, badge:'',           category:'Perfume',    desc:'Premium Oud perfume with rich woody fragrance.' },
  { id:13, emoji:'💐', name:'Floral Perfume',      sub:'50ml · Fresh & Light',    mrp:899,  price:599, badge:'New',        category:'Perfume',    desc:'Light floral perfume perfect for daily wear.' },
  { id:14, emoji:'🌺', name:'Mogra Ittar',         sub:'10ml · Floral & Fresh',   mrp:599,  price:449, badge:'',           category:'Ittar',      desc:'Pure Mogra Ittar with beautiful floral scent.' },
  { id:15, emoji:'🫧', name:'Aloe Face Wash',      sub:'100ml · Oil Control',     mrp:179,  price:129, badge:'Popular',    category:'Face Wash',  desc:'Aloe vera face wash for oily skin.' },
  { id:16, emoji:'🪔', name:'Sandalwood Dhoop',    sub:'20 sticks · Fragrance',   mrp:149,  price:99,  badge:'',           category:'Dhoop',      desc:'Pure sandalwood dhoop sticks for meditation.' },
  { id:17, emoji:'🌙', name:'Guggal Dhoop',        sub:'20 sticks · Pooja',       mrp:129,  price:89,  badge:'Popular',    category:'Dhoop',      desc:'Traditional Guggal dhoop for vastu and pooja.' },
  { id:18, emoji:'🌸', name:'Rose Aggarbatti',     sub:'20 sticks · Daily Pooja', mrp:79,   price:49,  badge:'',           category:'Aggarbatti', desc:'Rose fragrance aggarbatti for daily pooja.' },
  { id:19, emoji:'🌿', name:'Chandan Aggarbatti',  sub:'20 sticks · Meditation',  mrp:99,   price:59,  badge:'Bestseller', category:'Aggarbatti', desc:'Chandan aggarbatti for meditation and peace.' },
  { id:20, emoji:'🧴', name:'Turmeric Face Wash',  sub:'100ml · Brightening',     mrp:229,  price:159, badge:'',           category:'Face Wash',  desc:'Turmeric face wash for bright and glowing skin.' },
]

// ── Product Card ──────────────────────────────────────────────
export function ProductCard({ product, count = 0, onAdd, onRemove, onView }) {
  const [tapped, setTapped] = useState(false)
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  function handleAdd(e) {
    e.stopPropagation()
    onAdd()
    setTapped(true)
    setTimeout(() => setTapped(false), 600)
  }

  function handleRemove(e) {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div style={pc.card} onClick={onView}>
      <div style={pc.imgBox}>
        {product.badge
          ? <span style={{...pc.badge,
              background: product.badge==='New'?'#2196F3':product.badge==='Popular'?'#9C27B0':'#3B6D11'
            }}>{product.badge}</span>
          : null}
        <span style={pc.discTag}>{discount}% off</span>
        <span style={{fontSize:40}}>{product.emoji}</span>
      </div>
      <div style={pc.body}>
        <div style={pc.name}>{product.name}</div>
        <div style={pc.sub}>{product.sub}</div>
        <div style={pc.priceRow}>
          <span style={pc.mrp}>₹{product.mrp}</span>
          <span style={pc.price}>₹{product.price}</span>
        </div>
        <div style={pc.foot}>
          <span style={pc.save}>Save ₹{product.mrp - product.price}</span>
          {count === 0 ? (
            <button
              style={{...pc.addBtn, background: tapped ? '#27500A' : '#3B6D11'}}
              onClick={handleAdd}
            >
              {tapped ? '✓' : '+'}
            </button>
          ) : (
            <div style={pc.stepper} onClick={e => e.stopPropagation()}>
              <button style={pc.stepBtn} onClick={handleRemove}>−</button>
              <span style={pc.stepCount}>{count}</span>
              <button style={pc.stepBtn} onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const pc = {
  card:     {background:'#fff',borderRadius:12,overflow:'hidden',border:'1px solid #e8f0dc',cursor:'pointer'},
  imgBox:   {height:130,background:'linear-gradient(135deg,#EAF3DE,#E1F5EE)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'},
  badge:    {position:'absolute',top:8,left:8,color:'#fff',fontSize:10,fontWeight:700,borderRadius:4,padding:'2px 8px'},
  discTag:  {position:'absolute',top:8,right:8,background:'#FF6B35',color:'#fff',fontSize:10,fontWeight:700,borderRadius:4,padding:'2px 8px'},
  body:     {padding:'10px 12px 12px'},
  name:     {fontSize:13,fontWeight:600,color:'#173404',marginBottom:3,lineHeight:1.3},
  sub:      {fontSize:11,color:'#999',marginBottom:6},
  priceRow: {display:'flex',alignItems:'center',gap:8,marginBottom:4},
  mrp:      {fontSize:11,color:'#aaa',textDecoration:'line-through'},
  price:    {fontSize:15,fontWeight:700,color:'#3B6D11'},
  foot:     {display:'flex',alignItems:'center',justifyContent:'space-between'},
  save:     {fontSize:10,fontWeight:600,color:'#FF6B35'},
  addBtn:   {width:28,height:28,borderRadius:'50%',border:'none',color:'#fff',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.15s'},
  stepper:   {display:'flex',alignItems:'center',gap:6,background:'#3B6D11',borderRadius:16,padding:'2px 4px'},
  stepBtn:   {width:22,height:22,borderRadius:'50%',border:'none',background:'#fff',color:'#3B6D11',fontSize:14,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',lineHeight:1},
  stepCount: {color:'#fff',fontSize:13,fontWeight:700,minWidth:14,textAlign:'center'},
}

// ── Horizontal Scroll Section ─────────────────────────────────
function HScrollSection({ title, products, cart = [], onAdd, onRemove, onView }) {
  const scrollRef = React.useRef(null)
  const [showArrow, setShowArrow] = useState(true)

  function scrollRight() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' })
    }
  }

  return (
    <div style={hs.wrap}>
      <div style={hs.head}>
        <h2 style={hs.title}>{title}</h2>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {showArrow && (
            <button style={hs.arrowBtn} onClick={scrollRight}>
              <span style={hs.arrowInner}>›</span>
            </button>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        style={hs.scroll}
        onScroll={e => {
          const el = e.target
          setShowArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
        }}
      >
        {products.map(p => (
          <div key={p.id} style={hs.cardWrap}>
            <ProductCard
              product={p}
              count={cart.filter(item => item.id === p.id).length}
              onAdd={() => onAdd(p)}
              onRemove={() => onRemove(p.id)}
              onView={() => onView(p)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const hs = {
  wrap:      {padding:'1.5rem 2rem 0.5rem'},
  head:      {display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'},
  title:     {fontSize:20,fontWeight:700,color:'#173404'},
  arrowBtn:  {background:'#3B6D11',border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',animation:'pulse 1.2s infinite'},
  arrowInner:{color:'#fff',fontSize:22,fontWeight:700,lineHeight:1},
  scroll:    {display:'flex',gap:14,overflowX:'auto',paddingBottom:12,scrollbarWidth:'none',msOverflowStyle:'none',WebkitOverflowScrolling:'touch'},
  cardWrap:  {minWidth:180,maxWidth:180,flexShrink:0},
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ cartCount, page, setPage, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={st.navbar}>
      <div style={st.navInner}>
        <div style={st.logo} onClick={() => setPage('home')}>
          <span style={{fontSize:26}}>🌿</span>
          <div>
            <div style={st.logoText}>Aadesh Herbal</div>
            <div style={st.logoSub}>& Perfume</div>
          </div>
        </div>

        <ul style={st.navLinks}>
          {['home','products'].map(p => (
            <li key={p}>
              <button onClick={() => setPage(p)} style={{
                ...st.navLink,
                fontWeight: page===p ? 700 : 400,
                color: page===p ? '#3B6D11' : '#555',
              }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            </li>
          ))}
          <li><button style={{...st.navLink,color:'#555'}}>About</button></li>
          <li><button style={{...st.navLink,color:'#555'}}>Contact</button></li>
          {user && (
            <li><button style={{...st.navLink,color:'#555'}} onClick={() => setPage('address')}>My Addresses</button></li>
          )}
        </ul>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={st.userGreet}>Hi, {user.name?.split(' ')[0]}</span>
              <button style={st.logoutBtn} onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <button style={st.loginBtn} onClick={() => setPage('login')}>Login</button>
          )}
          <button style={st.cartBtn} onClick={() => setPage('cart')}>
            🛒 Cart
            <span style={st.cartBadge}>{cartCount}</span>
          </button>
          <button style={st.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={st.mobileMenu}>
          {['home','products'].map(p => (
            <button key={p} style={st.mobileLink}
              onClick={() => { setPage(p); setMenuOpen(false) }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button style={st.mobileLink}>About</button>
          <button style={st.mobileLink}>Contact</button>
          {user ? (
            <>
              <button style={st.mobileLink} onClick={() => { setPage('address'); setMenuOpen(false) }}>My Addresses</button>
              <button style={st.mobileLink} onClick={() => { onLogout(); setMenuOpen(false) }}>Logout</button>
            </>
          ) : (
            <button style={st.mobileLink} onClick={() => { setPage('login'); setMenuOpen(false) }}>Login</button>
          )}
        </div>
      )}
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ setPage }) {
  return (
    <div style={st.heroBg}>
      <div style={st.hero}>
        <div style={st.heroLeft}>
          <span style={st.heroTag}>🌱 100% Natural & Ayurvedic</span>
          <h1 style={st.heroTitle}>
            Nature's Best,<br/>
            <span style={{color:'#3B6D11'}}>Delivered Pure</span>
          </h1>
          <p style={st.heroDesc}>
            Authentic herbal products — Arks, Oils, Soaps, Honey,
            Ittars, Perfumes and more. Trusted Ayurvedic wellness.
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button style={st.btnPrimary} onClick={() => setPage('products')}>Shop Now →</button>
            <button style={st.btnSecondary}>Our Story</button>
          </div>
        </div>
        <div style={st.heroRight}>
          {allProducts.slice(0,4).map(p => (
            <div key={p.id} style={st.heroCard}>
              <span style={{fontSize:26}}>{p.emoji}</span>
              <span style={{fontSize:12,fontWeight:600,color:'#173404',textAlign:'center'}}>{p.name}</span>
              <div>
                <span style={{fontSize:10,color:'#aaa',textDecoration:'line-through'}}>₹{p.mrp}</span>
                <span style={{fontSize:13,fontWeight:700,color:'#3B6D11',marginLeft:4}}>₹{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Home ──────────────────────────────────────────────────────
function Home({ cart = [], setPage, setCart, setSelectedProduct }) {
  function addToCart(p) { setCart(prev => [...prev, p]) }

  // Removes ONE instance of this product id from the cart
  function removeFromCart(id) {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  function countOf(id)    { return cart.filter(item => item.id === id).length }
  function viewProduct(p) { setSelectedProduct(p); setPage('detail') }

  const bestsellers = allProducts.filter(p => p.badge === 'Bestseller')
  const newLaunches = allProducts.filter(p => p.badge === 'New')

  return (
    <div style={{background:'#f8f9f4'}}>

      <Hero setPage={setPage} />

      {/* Offer Strip */}
      <div style={st.offerStrip}>
        🚚 Free delivery above ₹499 &nbsp;·&nbsp; Use <b>HERBAL10</b> for 10% off your first order 🎁
      </div>

      {/* Stats */}
      <div style={st.statsBar}>
        {[['500+','Products'],['50K+','Customers'],['100%','Natural'],['15+','Years']].map(([n,l]) => (
          <div key={l} style={st.statItem}>
            <div style={st.statNum}>{n}</div>
            <div style={st.statLabel}>{l}</div>
          </div>
        ))}
      </div>

      {/* Bestsellers - horizontal scroll */}
      <HScrollSection
        title="🏆 Bestsellers"
        products={bestsellers}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onView={viewProduct}
      />

      {/* New Launches - horizontal scroll */}
      <HScrollSection
        title="🆕 New Launches"
        products={newLaunches}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onView={viewProduct}
      />

      {/* All Products */}
      <div style={st.section}>
        <div style={st.secHead}>
          <h2 style={st.secTitle}>All Products</h2>
          <button style={st.seeAll} onClick={() => setPage('products')}>View all →</button>
        </div>
        <div style={st.grid}>
          {allProducts.slice(0,8).map(p => (
            <ProductCard key={p.id} product={p}
              count={countOf(p.id)}
              onAdd={() => addToCart(p)}
              onRemove={() => removeFromCart(p.id)}
              onView={() => viewProduct(p)} />
          ))}
        </div>
        <button style={st.viewAllBtn} onClick={() => setPage('products')}>
          View All 20 Products →
        </button>
      </div>

      <footer style={st.footer}>
        <p>© 2025 Aadesh Herbal & Perfume · Made with 🌿 in India</p>
      </footer>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [cart, setCart]                       = useState([])
  const [page, setPage]                       = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [user, setUser]                       = useState(null)
  const [authLoading, setAuthLoading]         = useState(true)

  // On first load, check if a saved token still belongs to a real logged-in user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setAuthLoading(false); return }

    api.me()
      .then(data => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setAuthLoading(false))
  }, [])

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setPage('home')
  }

  // Cart → Checkout must be logged in first
  function goToCheckout() {
    setPage(user ? 'checkout' : 'login')
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8f9f4',width:'100%'}}>
      <Navbar cartCount={cart.length} page={page} setPage={setPage} user={user} onLogout={logout} />
      {page==='home'     && <Home cart={cart} setPage={setPage} setCart={setCart} setSelectedProduct={setSelectedProduct} />}
      {page==='products' && <Products cart={cart} setCart={setCart} setPage={setPage} setSelectedProduct={setSelectedProduct} />}
      {page==='cart'     && <Cart cart={cart} setCart={setCart} setPage={setPage} onCheckout={goToCheckout} />}
      {page==='detail'   && selectedProduct && <ProductDetail product={selectedProduct} setCart={setCart} setPage={setPage} />}
      {page==='login'    && !authLoading && <Login setUser={setUser} setPage={setPage} />}
      {page==='address'  && <Address setPage={setPage} />}
      {page==='checkout' && <Checkout cart={cart} setCart={setCart} user={user} setPage={setPage} />}
    </div>
  )
}

// ── Global Styles ─────────────────────────────────────────────
const st = {
  navbar:       {background:'#fff',borderBottom:'1px solid #e8f0dc',position:'sticky',top:0,zIndex:100,width:'100%'},
  navInner:     {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.9rem 2rem',maxWidth:1200,margin:'0 auto'},
  logo:         {display:'flex',alignItems:'center',gap:10,cursor:'pointer'},
  logoText:     {fontSize:16,fontWeight:700,color:'#173404'},
  logoSub:      {fontSize:11,color:'#3B6D11'},
  navLinks:     {display:'flex',gap:'1.5rem',listStyle:'none'},
  navLink:      {fontSize:14,background:'none',border:'none',cursor:'pointer',fontFamily:'inherit'},
  cartBtn:      {display:'flex',alignItems:'center',gap:6,background:'#3B6D11',color:'#EAF3DE',border:'none',borderRadius:8,padding:'8px 16px',fontSize:14,cursor:'pointer'},
  loginBtn:     {background:'none',border:'1.5px solid #3B6D11',color:'#3B6D11',borderRadius:8,padding:'7px 16px',fontSize:13,fontWeight:600,cursor:'pointer'},
  logoutBtn:    {background:'none',border:'1px solid #e57373',color:'#e57373',borderRadius:8,padding:'6px 14px',fontSize:12,cursor:'pointer'},
  userGreet:    {fontSize:13,color:'#173404',fontWeight:600},
  cartBadge:    {background:'#EF9F27',color:'#412402',borderRadius:'50%',width:20,height:20,fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700},
  hamburger:    {display:'none',background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#173404'},
  mobileMenu:   {background:'#fff',borderTop:'1px solid #e8f0dc',width:'100%'},
  mobileLink:   {display:'block',width:'100%',background:'none',border:'none',padding:'14px 2rem',fontSize:15,textAlign:'left',cursor:'pointer',color:'#333',borderBottom:'1px solid #f0f0f0',fontFamily:'inherit'},
  heroBg:       {background:'linear-gradient(135deg,#EAF3DE,#E1F5EE)',width:'100%'},
  hero:         {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',padding:'3rem 2rem',maxWidth:1200,margin:'0 auto',alignItems:'center'},
  heroLeft:     {},
  heroTag:      {display:'inline-block',background:'#C0DD97',color:'#27500A',borderRadius:20,padding:'4px 14px',fontSize:12,fontWeight:500,marginBottom:'1rem'},
  heroTitle:    {fontSize:36,fontWeight:700,lineHeight:1.2,color:'#173404',marginBottom:'1rem'},
  heroDesc:     {fontSize:15,color:'#3B6D11',lineHeight:1.7,marginBottom:'1.5rem'},
  btnPrimary:   {background:'#3B6D11',color:'#EAF3DE',border:'none',borderRadius:8,padding:'12px 24px',fontSize:14,cursor:'pointer',fontWeight:600},
  btnSecondary: {background:'transparent',color:'#3B6D11',border:'1.5px solid #3B6D11',borderRadius:8,padding:'12px 24px',fontSize:14,cursor:'pointer'},
  heroRight:    {display:'grid',gridTemplateColumns:'1fr 1fr',gap:12},
  heroCard:     {background:'#fff',borderRadius:12,border:'1px solid #dcedc8',padding:'1rem',display:'flex',flexDirection:'column',alignItems:'center',gap:6},
  offerStrip:   {background:'#EF9F27',color:'#412402',fontSize:13,fontWeight:500,padding:'10px',textAlign:'center',width:'100%'},
  statsBar:     {display:'flex',background:'#f0f7e6',borderTop:'1px solid #dcedc8',borderBottom:'1px solid #dcedc8',width:'100%'},
  statItem:     {flex:1,textAlign:'center',padding:'1rem',borderRight:'1px solid #dcedc8'},
  statNum:      {fontSize:22,fontWeight:700,color:'#3B6D11'},
  statLabel:    {fontSize:12,color:'#666',marginTop:2},
  section:      {padding:'1.5rem 2rem',maxWidth:1200,margin:'0 auto'},
  secHead:      {display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'},
  secTitle:     {fontSize:20,fontWeight:700,color:'#173404'},
  seeAll:       {fontSize:13,color:'#3B6D11',background:'none',border:'none',cursor:'pointer',fontWeight:500},
  grid:         {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'},
  viewAllBtn:   {width:'100%',marginTop:16,background:'#fff',border:'1.5px solid #3B6D11',color:'#3B6D11',borderRadius:10,padding:'12px',fontSize:14,fontWeight:600,cursor:'pointer'},
  footer:       {textAlign:'center',padding:'2rem',background:'#EAF3DE',color:'#3B6D11',fontSize:13,borderTop:'1px solid #dcedc8',width:'100%'},
}