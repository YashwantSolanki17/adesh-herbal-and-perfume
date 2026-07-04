import React, { useState, useEffect } from 'react'
import { api } from './api.js'

const COD_EXTRA_CHARGE = 50

export default function Checkout({ cart, setCart, user, setPage }) {
  const [addresses, setAddresses]     = useState([])
  const [selectedId, setSelectedId]   = useState(null)
  const [method, setMethod]           = useState('online') // 'online' | 'cod'
  const [loading, setLoading]         = useState(true)
  const [placing, setPlacing]         = useState(false)
  const [error, setError]             = useState('')

  // Group cart items by product id so we show quantity, not repeated rows
  const grouped = cart.reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id)
    if (existing) { existing.quantity += 1; existing.subtotal += item.price }
    else acc.push({ ...item, quantity: 1, subtotal: item.price })
    return acc
  }, [])

  const subtotal   = cart.reduce((sum, i) => sum + i.price, 0)
  const delivery   = subtotal >= 499 ? 0 : 49
  const codCharge  = method === 'cod' ? COD_EXTRA_CHARGE : 0
  const total      = subtotal + delivery + codCharge

  useEffect(() => { loadAddresses() }, [])

  async function loadAddresses() {
    try {
      const data = await api.getAddresses()
      setAddresses(data)
      if (data.length) setSelectedId(data[0]._id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Razorpay's checkout.js is loaded once, on demand
  function loadRazorpayScript() {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function handlePlaceOrder() {
    setError('')
    const address = addresses.find(a => a._id === selectedId)
    if (!address) { setError('Please select a delivery address'); return }
    if (cart.length === 0) { setError('Your cart is empty'); return }

    setPlacing(true)
    try {
      const items = grouped.map(i => ({
        productId: i.id, name: i.name, emoji: i.emoji, price: i.price, quantity: i.quantity,
      }))

      // Backend creates the order record either way (COD = no gateway involved)
      const orderData = await api.createOrder(items, address, total, method)

      if (method === 'cod') {
        // Order is placed directly, nothing to pay online
        setCart([])
        setPage('home')
        alert(`✅ Order placed! Pay ₹${total} (incl. ₹${COD_EXTRA_CHARGE} COD charge) on delivery.`)
        return
      }

      // ── Online payment via Razorpay ──
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) throw new Error('Failed to load payment gateway. Check your internet connection.')

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aadesh Herbal & Perfume',
        description: 'Order Payment',
        order_id: orderData.razorpayOrderId,
        // Razorpay's popup itself lists Cards, UPI, Netbanking, and wallets
        // (including Paytm) — no separate integration needed for each one.
        handler: async function (response) {
          try {
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            })
            setCart([])
            setPage('home')
            alert('🎉 Payment successful! Your order has been placed.')
          } catch (err) {
            setError('Payment succeeded but verification failed: ' + err.message)
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: address.phone },
        theme: { color: '#3B6D11' },
        modal: { ondismiss: () => setPlacing(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError(err.message)
    } finally {
      if (method === 'cod') setPlacing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div style={s.emptyPage}>
        <p>Your cart is empty.</p>
        <button style={s.btn} onClick={() => setPage('products')}>Browse Products →</button>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <h2 style={s.title}>🧾 Checkout</h2>

      {error && <div style={s.error}>{error}</div>}

      {/* Delivery Address */}
      <div style={s.section}>
        <div style={s.sectionHead}>
          <h3 style={s.sectionTitle}>Delivery Address</h3>
          <button style={s.addLink} onClick={() => setPage('address')}>+ Manage Addresses</button>
        </div>

        {loading && <p>Loading addresses...</p>}
        {!loading && addresses.length === 0 && (
          <div style={s.noAddress}>
            <p>No saved addresses yet.</p>
            <button style={s.btn} onClick={() => setPage('address')}>Add Address</button>
          </div>
        )}
        {addresses.map(a => (
          <label key={a._id} style={{ ...s.addrCard, ...(selectedId === a._id ? s.addrCardActive : {}) }}>
            <input
              type="radio"
              name="address"
              checked={selectedId === a._id}
              onChange={() => setSelectedId(a._id)}
              style={{ marginRight: 10 }}
            />
            <div>
              <div style={s.addrLabel}>{a.label} — {a.fullName}</div>
              <div style={s.addrLine}>{a.line1}, {a.city}, {a.state} - {a.pincode}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Payment Method */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>Payment Method</h3>

        <label style={{ ...s.payOption, ...(method === 'online' ? s.payOptionActive : {}) }}>
          <input type="radio" name="method" checked={method === 'online'}
            onChange={() => setMethod('online')} style={{ marginRight: 10 }} />
          <div>
            <div style={s.payTitle}>💳 Pay Online</div>
            <div style={s.paySub}>Credit/Debit Card · UPI · Paytm & other wallets</div>
          </div>
        </label>

        <label style={{ ...s.payOption, ...(method === 'cod' ? s.payOptionActive : {}) }}>
          <input type="radio" name="method" checked={method === 'cod'}
            onChange={() => setMethod('cod')} style={{ marginRight: 10 }} />
          <div>
            <div style={s.payTitle}>💵 Cash on Delivery</div>
            <div style={s.paySub}>Pay when your order arrives (+₹{COD_EXTRA_CHARGE} COD charge)</div>
          </div>
        </label>
      </div>

      {/* Order Summary */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>Order Summary</h3>
        {grouped.map(item => (
          <div key={item.id} style={s.itemRow}>
            <span>{item.emoji} {item.name} × {item.quantity}</span>
            <span>₹{item.subtotal}</span>
          </div>
        ))}
        <div style={s.divider} />
        <div style={s.itemRow}>
          <span>Delivery</span>
          <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
        </div>
        {method === 'cod' && (
          <div style={s.itemRow}>
            <span>COD Charge</span>
            <span>₹{COD_EXTRA_CHARGE}</span>
          </div>
        )}
        <div style={s.divider} />
        <div style={s.totalRow}><span>Total</span><span>₹{total}</span></div>
      </div>

      <button style={s.payBtn} onClick={handlePlaceOrder} disabled={placing}>
        {placing ? 'Processing...' : method === 'cod' ? `Place Order · ₹${total} →` : `Pay ₹${total} →`}
      </button>
    </div>
  )
}

const s = {
  page:          { padding: '2rem', maxWidth: 600, margin: '0 auto', minHeight: '80vh' },
  title:         { fontSize: 24, fontWeight: 700, color: '#173404', marginBottom: 16 },
  error:         { background: '#fdecea', color: '#c62828', fontSize: 13, borderRadius: 6, padding: '8px 12px', marginBottom: 12 },
  section:       { background: '#fff', border: '1px solid #e8f0dc', borderRadius: 10, padding: '1rem', marginBottom: 14 },
  sectionHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle:  { fontSize: 15, fontWeight: 700, color: '#173404', marginBottom: 10 },
  addLink:       { background: 'none', border: 'none', color: '#3B6D11', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  noAddress:     { textAlign: 'center', padding: '1rem' },
  addrCard:      { display: 'flex', alignItems: 'flex-start', border: '1px solid #e8f0dc', borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'pointer' },
  addrCardActive:{ borderColor: '#3B6D11', background: '#f0f7e6' },
  addrLabel:     { fontSize: 13, fontWeight: 600, color: '#173404' },
  addrLine:      { fontSize: 12, color: '#888', marginTop: 2 },
  payOption:     { display: 'flex', alignItems: 'flex-start', border: '1px solid #e8f0dc', borderRadius: 8, padding: '12px', marginBottom: 8, cursor: 'pointer' },
  payOptionActive:{ borderColor: '#3B6D11', background: '#f0f7e6' },
  payTitle:      { fontSize: 14, fontWeight: 600, color: '#173404' },
  paySub:        { fontSize: 12, color: '#888', marginTop: 2 },
  itemRow:       { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 6 },
  divider:       { borderTop: '1px solid #e8f0dc', margin: '8px 0' },
  totalRow:      { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#173404' },
  payBtn:        { width: '100%', background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 10, padding: '16px', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  btn:           { background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer', marginTop: 10 },
  emptyPage:     { textAlign: 'center', padding: '4rem 2rem' },
}
