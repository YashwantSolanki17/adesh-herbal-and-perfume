import React, { useState } from 'react'
import { allProducts, ProductCard } from './App.jsx'

// ── Products Page ────────────────────────────────────────────
// This is the "All Products" page: search bar + category chips + grid.
// (It reuses `allProducts` and `ProductCard` from App.jsx instead of
// redefining them, so there's only ONE source of truth for products.)
export default function Products({ cart = [], setCart, setPage, setSelectedProduct }) {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')

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

  // Build category chip list dynamically from the product data
  const categories = ['All', ...new Set(allProducts.map(p => p.category))]

  // Filter by search text + selected category
  const filtered = allProducts.filter(p => {
    const matchesSearch   = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Search Toolbar */}
      <div style={s.toolbar}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {/* Category Chips */}
      <div style={s.chipsRow}>
        {categories.map(c => (
          <button
            key={c}
            style={{ ...s.chip, ...(category === c ? s.chipActive : {}) }}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Result Count */}
      <div style={s.resultCount}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Product Grid */}
      <div style={s.gridWrap}>
        {filtered.length > 0 ? (
          <div style={s.grid}>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                count={countOf(p.id)}
                onAdd={() => addToCart(p)}
                onRemove={() => removeFromCart(p.id)}
                onView={() => viewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div style={s.empty}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  toolbar:     { padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e8f0dc' },
  searchInput: { width: '100%', maxWidth: 1200, margin: '0 auto', display: 'block', padding: '10px 16px', borderRadius: 8, border: '1px solid #e8f0dc', fontSize: 14, outline: 'none' },
  chipsRow:    { display: 'flex', gap: 8, overflowX: 'auto', padding: '1rem 2rem', background: '#fff' },
  chip:        { flexShrink: 0, background: '#f0f7e6', border: '1px solid #dcedc8', color: '#3B6D11', borderRadius: 20, padding: '6px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  chipActive:  { background: '#3B6D11', color: '#EAF3DE', border: '1px solid #3B6D11' },
  resultCount: { padding: '10px 2rem', fontSize: 13, color: '#888' },
  gridWrap:    { padding: '0 2rem 2rem' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', maxWidth: 1200, margin: '0 auto' },
  empty:       { textAlign: 'center', padding: '4rem 2rem', color: '#888' },
}
