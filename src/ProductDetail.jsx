import React, { useState } from 'react'

export default function ProductDetail({ product, setCart, setPage }) {
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  function addToCart() {
    for (let i = 0; i < qty; i++) setCart(prev => [...prev, product])
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{paddingBottom:100, background:'#f4f6f0', minHeight:'100vh'}}>

      {/* Back Button */}
      <button style={s.back} onClick={() => setPage('products')}>
        ← Back to Products
      </button>

      {/* Product Image */}
      <div style={s.imgBox}>
        {product.badge && (
          <span style={{...s.badge,
            background: product.badge==='Hot'?'#FF6B35':product.badge==='New'?'#2196F3':product.badge==='Popular'?'#9C27B0':'#3B6D11'
          }}>{product.badge}</span>
        )}
        <span style={{position:'absolute',top:16,right:16,background:'#FF6B35',color:'#fff',fontSize:12,fontWeight:700,borderRadius:6,padding:'4px 10px'}}>
          {discountPercent}% off
        </span>
        <span style={{fontSize:100}}>{product.emoji}</span>
      </div>

      {/* Product Info */}
      <div style={s.info}>

        {/* Category tag */}
        <div style={s.catTag}>{product.category}</div>

        {/* Name */}
        <h1 style={s.name}>{product.name}</h1>
        <div style={s.sub}>{product.sub}</div>

        {/* Rating */}
        <div style={s.ratingRow}>
          <span style={{fontSize:14}}>⭐⭐⭐⭐☆</span>
          <span style={{fontSize:12,color:'#888',marginLeft:8}}>4.2 · 128 reviews</span>
        </div>

        {/* Price Box */}
        <div style={s.priceBox}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <span style={s.priceMain}>₹{product.price}</span>
            <span style={s.mrpCut}>₹{product.mrp}</span>
          </div>
          <div style={s.saveBadge}>
            🎉 You save ₹{product.mrp - product.price} ({discountPercent}% off)
          </div>
        </div>

        {/* Description */}
        <p style={s.desc}>{product.desc}</p>

        {/* Benefits */}
        <div style={s.benefits}>
          {['🌿 100% Natural','✅ Lab Tested','🚚 Fast Delivery','↩️ Easy Returns'].map(b => (
            <div key={b} style={s.benefit}>{b}</div>
          ))}
        </div>

        {/* Quantity Selector */}
        <div style={s.qtySection}>
          <span style={{fontSize:14,color:'#555',fontWeight:500}}>Quantity</span>
          <div style={s.qtyControls}>
            <button style={s.qBtn} onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
            <span style={s.qNum}>{qty}</span>
            <button style={s.qBtn} onClick={() => setQty(q => q+1)}>+</button>
          </div>
          <span style={{fontSize:16,fontWeight:700,color:'#3B6D11'}}>
            ₹{product.price * qty}
          </span>
        </div>

        {/* Info Cards */}
        <div style={s.infoCards}>
          {[['🚚','Free delivery','Above ₹499'],
            ['🔒','Secure pay','UPI · Cards · COD'],
            ['↩️','7 Day return','Easy policy'],
            ['📞','Support','24/7 help'],
          ].map(([ic,ti,de]) => (
            <div key={ti} style={s.infoCard}>
              <span style={{fontSize:20}}>{ic}</span>
              <div style={{fontSize:11,fontWeight:600,color:'#173404'}}>{ti}</div>
              <div style={{fontSize:10,color:'#aaa'}}>{de}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Fixed Bottom Buttons */}
      <div style={s.fixedBtns}>
        <button style={s.addBtn} onClick={addToCart}>
          {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
        </button>
        <button style={s.buyBtn} onClick={() => { addToCart(); setPage('cart') }}>
          Buy Now
        </button>
      </div>

    </div>
  )
}

const s = {
  back:        {background:'none',border:'none',color:'#3B6D11',fontSize:14,padding:'14px 16px',display:'block',fontWeight:500,cursor:'pointer'},
  imgBox:      {background:'linear-gradient(135deg,#EAF3DE,#E1F5EE)',height:260,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'},
  badge:       {position:'absolute',top:16,left:16,color:'#fff',fontSize:12,fontWeight:700,borderRadius:6,padding:'4px 12px'},
  info:        {padding:'16px'},
  catTag:      {fontSize:11,color:'#3B6D11',fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:6},
  name:        {fontSize:24,fontWeight:800,color:'#173404',marginBottom:4},
  sub:         {fontSize:13,color:'#888',marginBottom:10},
  ratingRow:   {display:'flex',alignItems:'center',marginBottom:14},
  priceBox:    {background:'#f0f7e6',borderRadius:12,padding:'14px',marginBottom:16},
  priceMain:   {fontSize:30,fontWeight:800,color:'#3B6D11'},
  mrpCut:      {fontSize:16,color:'#aaa',textDecoration:'line-through'},
  saveBadge:   {display:'inline-block',background:'#FF6B35',color:'#fff',borderRadius:6,padding:'4px 12px',fontSize:12,fontWeight:600,marginTop:4},
  desc:        {fontSize:14,color:'#555',lineHeight:1.7,marginBottom:16},
  benefits:    {display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16},
  benefit:     {background:'#EAF3DE',color:'#27500A',borderRadius:8,padding:'8px 10px',fontSize:12,fontWeight:500},
  qtySection:  {display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',borderRadius:12,padding:'14px',marginBottom:16,border:'1px solid #e8f0dc'},
  qtyControls: {display:'flex',alignItems:'center',gap:16},
  qBtn:        {width:34,height:34,borderRadius:'50%',border:'1.5px solid #3B6D11',background:'#fff',color:'#3B6D11',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},
  qNum:        {fontSize:18,fontWeight:700,color:'#173404',minWidth:24,textAlign:'center'},
  infoCards:   {display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8},
  infoCard:    {background:'#fff',borderRadius:10,padding:'10px 6px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:4,border:'1px solid #e8f0dc'},
  fixedBtns:   {position:'fixed',bottom:56,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'#fff',borderTop:'1px solid #e8f0dc',padding:'12px 16px',display:'flex',gap:10,zIndex:150},
  addBtn:      {flex:1,background:'#fff',color:'#3B6D11',border:'2px solid #3B6D11',borderRadius:12,padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer'},
  buyBtn:      {flex:1,background:'#3B6D11',color:'#fff',border:'none',borderRadius:12,padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer'},
}
