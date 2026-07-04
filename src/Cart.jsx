import React from 'react'

export default function Cart({ cart, setCart, setPage, onCheckout }) {

  // Remove one item from cart
  function removeItem(indexToRemove) {
    setCart(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  // Clear entire cart
  function clearCart() {
    setCart([])
  }

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  // Group items by id to show quantity
  const grouped = cart.reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += 1
      existing.subtotal += item.price
    } else {
      acc.push({ ...item, quantity: 1, subtotal: item.price })
    }
    return acc
  }, [])

  // Empty cart screen
  if (cart.length === 0) {
    return (
      <div style={s.emptyPage}>
        <div style={{ fontSize: 64 }}>🛒</div>
        <h2 style={s.emptyTitle}>Your cart is empty!</h2>
        <p style={s.emptyDesc}>
          Looks like you haven't added anything yet.
        </p>
        <button
          style={s.continuBtn}
          onClick={() => setPage('products')}
        >
          Browse Products →
        </button>
      </div>
    )
  }

  return (
    <div style={s.page}>

      {/* Page Title */}
      <div style={s.header}>
        <h1 style={s.title}>🛒 Your Cart</h1>
        <button style={s.clearBtn} onClick={clearCart}>
          Clear All
        </button>
      </div>

      <div style={s.layout}>

        {/* Left — Cart Items */}
        <div style={s.itemsList}>
          {grouped.map((item, index) => (
            <div key={index} style={s.cartItem}>

              {/* Product Emoji */}
              <div style={s.itemEmoji}>{item.emoji}</div>

              {/* Product Info */}
              <div style={s.itemInfo}>
                <div style={s.itemName}>{item.name}</div>
                <div style={s.itemSub}>{item.sub}</div>
                <div style={s.itemPrice}>₹{item.price} each</div>
              </div>

              {/* Quantity */}
              <div style={s.itemQty}>
                <div style={s.qtyLabel}>Qty</div>
                <div style={s.qtyNum}>{item.quantity}</div>
              </div>

              {/* Subtotal */}
              <div style={s.itemSubtotal}>
                ₹{item.subtotal}
              </div>

              {/* Remove Button */}
              <button
                style={s.removeBtn}
                onClick={() => removeItem(index)}
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        {/* Right — Order Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>

          <div style={s.summaryRow}>
            <span>Items ({cart.length})</span>
            <span>₹{total}</span>
          </div>

          <div style={s.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: '#3B6D11' }}>
              {total >= 499 ? '🎉 FREE' : `₹49`}
            </span>
          </div>

          {total < 499 && (
            <div style={s.freeShipMsg}>
              Add ₹{499 - total} more for FREE delivery!
            </div>
          )}

          <div style={s.divider} />

          <div style={s.totalRow}>
            <span>Total</span>
            <span>₹{total >= 499 ? total : total + 49}</span>
          </div>

          <button style={s.checkoutBtn} onClick={onCheckout}>
            Proceed to Checkout →
          </button>

          <button
            style={s.continueShop}
            onClick={() => setPage('products')}
          >
            ← Continue Shopping
          </button>

          {/* Trust badges */}
          <div style={s.trustBadges}>
            <div style={s.badge}>🔒 Secure Payment</div>
            <div style={s.badge}>🚚 Fast Delivery</div>
            <div style={s.badge}>↩️ Easy Returns</div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────
const s = {
  page:         { padding: '2rem', background: '#f8f9f4', minHeight: '100vh' },
  header:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
  title:        { fontSize: 26, fontWeight: 700, color: '#173404' },
  clearBtn:     { background: 'none', border: '1.5px solid #e57373', color: '#e57373', borderRadius: 8, padding: '6px 16px', fontSize: 13, cursor: 'pointer' },
  layout:       { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' },
  itemsList:    { display: 'flex', flexDirection: 'column', gap: 12 },
  cartItem:     { background: '#fff', border: '1px solid #e8f0dc', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 16 },
  itemEmoji:    { fontSize: 40, minWidth: 50, textAlign: 'center' },
  itemInfo:     { flex: 1 },
  itemName:     { fontSize: 15, fontWeight: 600, color: '#173404', marginBottom: 3 },
  itemSub:      { fontSize: 12, color: '#888', marginBottom: 4 },
  itemPrice:    { fontSize: 13, color: '#3B6D11' },
  itemQty:      { textAlign: 'center', minWidth: 40 },
  qtyLabel:     { fontSize: 11, color: '#888' },
  qtyNum:       { fontSize: 18, fontWeight: 700, color: '#173404' },
  itemSubtotal: { fontSize: 16, fontWeight: 700, color: '#3B6D11', minWidth: 60, textAlign: 'right' },
  removeBtn:    { background: 'none', border: 'none', color: '#ccc', fontSize: 18, cursor: 'pointer', padding: '4px 8px' },
  summary:      { background: '#fff', border: '1px solid #e8f0dc', borderRadius: 12, padding: '1.5rem', position: 'sticky', top: 80 },
  summaryTitle: { fontSize: 18, fontWeight: 700, color: '#173404', marginBottom: '1rem' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 },
  freeShipMsg:  { background: '#EAF3DE', color: '#27500A', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 10 },
  divider:      { borderTop: '1px solid #e8f0dc', margin: '12px 0' },
  totalRow:     { display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: '#173404', marginBottom: '1.2rem' },
  checkoutBtn:  { width: '100%', background: '#3B6D11', color: '#EAF3DE', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10 },
  continueShop: { width: '100%', background: 'none', border: '1.5px solid #3B6D11', color: '#3B6D11', borderRadius: 8, padding: '10px', fontSize: 14, cursor: 'pointer', marginBottom: '1rem' },
  trustBadges:  { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 },
  badge:        { fontSize: 12, color: '#888', textAlign: 'center' },
  emptyPage:    { textAlign: 'center', padding: '5rem 2rem' },
  emptyTitle:   { fontSize: 24, fontWeight: 700, color: '#173404', margin: '1rem 0 0.5rem' },
  emptyDesc:    { fontSize: 15, color: '#888', marginBottom: '1.5rem' },
  continuBtn:   { background: '#3B6D11', color: '#EAF3DE', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 15, cursor: 'pointer' },
}