import React, { useState } from 'react'

const allProducts = [
  { id: 1,  emoji: '🌿', name: 'Giloy Ark',          sub: '500ml · Immunity Booster',   price: 199, category: 'Ark',         badge: 'Bestseller' },
  { id: 2,  emoji: '🍯', name: 'Wild Forest Honey',   sub: '250g · Raw & Unfiltered',    price: 349, category: 'Honey',       badge: 'Hot' },
  { id: 3,  emoji: '💊', name: 'Safed Musli Tabs',    sub: '60 tabs · Vitality',         price: 449, category: 'Tablets',     badge: '' },
  { id: 4,  emoji: '🧴', name: 'Neem Tulsi Soap',     sub: '100g · Antibacterial',       price: 89,  category: 'Soap',        badge: 'New' },
  { id: 5,  emoji: '🫚', name: 'Bhringraj Oil',       sub: '200ml · Hair Growth',        price: 279, category: 'Oil',         badge: '' },
  { id: 6,  emoji: '🌸', name: 'Rose Face Wash',      sub: '100ml · Glowing Skin',       price: 149, category: 'Face Wash',   badge: 'New' },
  { id: 7,  emoji: '🌱', name: 'Ashwagandha Ark',     sub: '500ml · Stress Relief',      price: 229, category: 'Ark',         badge: '' },
  { id: 8,  emoji: '🍋', name: 'Neem Honey',          sub: '250g · Skin & Immunity',     price: 299, category: 'Honey',       badge: '' },
  { id: 9,  emoji: '🌹', name: 'Rose Ittar',          sub: '10ml · Pure & Long Lasting', price: 499, category: 'Ittar',       badge: 'Bestseller' },
  { id: 10, emoji: '🧘', name: 'Shatavari Tablets',   sub: '60 tabs · Women Wellness',   price: 399, category: 'Tablets',     badge: 'Popular' },
  { id: 11, emoji: '🌻', name: 'Sesame Oil',          sub: '200ml · Joint Pain Relief',  price: 249, category: 'Oil',         badge: '' },
  { id: 12, emoji: '🫧', name: 'Aloe Vera Face Wash', sub: '100ml · Oil Control',        price: 129, category: 'Face Wash',   badge: 'Popular' },
  { id: 13, emoji: '🌺', name: 'Mogra Ittar',         sub: '10ml · Floral & Fresh',      price: 449, category: 'Ittar',       badge: '' },
  { id: 14, emoji: '✨', name: 'Oud Perfume',          sub: '50ml · Premium Fragrance',   price: 799, category: 'Perfume',     badge: 'Hot' },
  { id: 15, emoji: '💐', name: 'Floral Perfume',      sub: '50ml · Light & Refreshing',  price: 599, category: 'Perfume',     badge: 'New' },
  { id: 16, emoji: '🪔', name: 'Sandalwood Dhoop',    sub: '20 sticks · Pure Fragrance', price: 99,  category: 'Dhoop',       badge: '' },
  { id: 17, emoji: '🌙', name: 'Guggal Dhoop',        sub: '20 sticks · Vastu & Pooja',  price: 89,  category: 'Dhoop',       badge: 'Popular' },
  { id: 18, emoji: '🕯️', name: 'Rose Aggarbatti',     sub: '20 sticks · Daily Pooja',    price: 49,  category: 'Aggarbatti',  badge: '' },
  { id: 19, emoji: '🌿', name: 'Chandan Aggarbatti',  sub: '20 sticks · Meditation',     price: 59,  category: 'Aggarbatti',  badge: 'Bestseller' },
  { id: 20, emoji: '🧴', name: 'Turmeric Face Wash',  sub: '100ml · Brightening',        price: 159, category: 'Face Wash',   badge: '' },
]

const categories = ['All', 'Ark', 'Honey', 'Soap', 'Oil', 'Tablets', 'Face Wash', 'Ittar', 'Perfume', 'Dhoop', 'Aggarbatti']

function ProductCard({ product, onAdd }) {
  return (
    <div style={s.card}>
      <div style={s.cardImg}>
        {product.badge && (
          <span style={{
            ...s.badge,
            background: product.badge === 'Hot' ? '#FAC775' :
                        product.badge === 'New' ? '#B5D4F4' : '#C0DD97',
            color:      product.badge === 'Hot' ? '#412402' :
                        product.badge === 'New' ? '#0C447C' : '#27500A',
          }}>
            {product.badge}
          </span>
        )}
        <span style={{ fontSize: 52 }}>{product.emoji}</span>
      </div>
      <div style={s.cardBody}>
        <div style={s.cardName}>{product.name}</div>
        <div style={s.cardSub}>{product.sub}</div>
        <div style={s.cardFooter}>
          <span style={s.price}>₹{product.price}</span>
          <button style={s.addBtn} onClick={() => onAdd(product)}>
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Products({ cart, setCart }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  function addToCart(product) {
    setCart(prev => [...prev, product])
    alert(`✅ ${product.name} added to cart!`)
  }

  let filtered = allProducts

  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory)
  }

  if (search.trim() !== '') {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (sortBy === 'low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  }

  return (
    <div style={s.page}>

      <div style={s.header}>
        <h1 style={s.title}>Our Products</h1>
        <p style={s.subtitle}>{filtered.length} products found</p>
      </div>

      <div style={s.toolbar}>
        <input
          style={s.searchInput}
          type="text"
          placeholder="🔍  Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={s.sortSelect}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div style={s.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...s.catChip,
              background: activeCategory === cat ? '#3B6D11' : '#f0f7e6',
              color:      activeCategory === cat ? '#EAF3DE' : '#3B6D11',
              border:     activeCategory === cat ? '1.5px solid #3B6D11' : '1.5px solid #C0DD97',
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48 }}>🌿</div>
          <div>No products found for "{search}"</div>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}

    </div>
  )
}

const s = {
  page:        { padding: '2rem', background: '#f8f9f4', minHeight: '100vh' },
  header:      { marginBottom: '1.5rem' },
  title:       { fontSize: 28, fontWeight: 700, color: '#173404' },
  subtitle:    { fontSize: 14, color: '#888', marginTop: 4 },
  toolbar:     { display: 'flex', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, border: '1.5px solid #C0DD97', fontSize: 14, background: '#fff', outline: 'none' },
  sortSelect:  { padding: '10px 16px', borderRadius: 8, border: '1.5px solid #C0DD97', fontSize: 14, background: '#fff', color: '#333', outline: 'none' },
  categories:  { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' },
  catChip:     { padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' },
  card:        { background: '#fff', border: '1px solid #e8f0dc', borderRadius: 12, overflow: 'hidden' },
  cardImg:     { height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#EAF3DE,#E1F5EE)', position: 'relative' },
  badge:       { position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 600, borderRadius: 4, padding: '2px 8px' },
  cardBody:    { padding: '12px 14px' },
  cardName:    { fontSize: 14, fontWeight: 600, color: '#173404', marginBottom: 4 },
  cardSub:     { fontSize: 12, color: '#888', marginBottom: 10 },
  cardFooter:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price:       { fontSize: 16, fontWeight: 700, color: '#3B6D11' },
  addBtn:      { background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' },
  empty:       { textAlign: 'center', padding: '4rem', color: '#888', fontSize: 16, lineHeight: 2 },
}