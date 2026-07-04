import React, { useState, useEffect } from 'react'
import { api } from './api.js'

const emptyForm = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

export default function Address({ setPage }) {
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => { loadAddresses() }, [])

  async function loadAddresses() {
    try {
      const data = await api.getAddresses()
      setAddresses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    try {
      const updated = await api.addAddress(form)
      setAddresses(updated)
      setForm(emptyForm)
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      const updated = await api.deleteAddress(id)
      setAddresses(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => setPage('home')}>← Back</button>
      <h2 style={s.title}>📍 My Addresses</h2>

      {loading && <p>Loading...</p>}
      {error && <div style={s.error}>{error}</div>}

      {addresses.map(a => (
        <div key={a._id} style={s.card}>
          <div style={s.label}>{a.label}</div>
          <div style={s.name}>{a.fullName} · {a.phone}</div>
          <div style={s.line}>
            {a.line1}, {a.line2 ? a.line2 + ', ' : ''}{a.city}, {a.state} - {a.pincode}
          </div>
          <button style={s.deleteBtn} onClick={() => handleDelete(a._id)}>Delete</button>
        </div>
      ))}

      {!showForm ? (
        <button style={s.addBtn} onClick={() => setShowForm(true)}>+ Add New Address</button>
      ) : (
        <form style={s.form} onSubmit={handleAdd}>
          <input style={s.input} placeholder="Label (Home/Office)" value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })} />
          <input style={s.input} placeholder="Full Name" value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          <input style={s.input} placeholder="Phone" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <input style={s.input} placeholder="Address Line 1" value={form.line1}
            onChange={e => setForm({ ...form, line1: e.target.value })} required />
          <input style={s.input} placeholder="Address Line 2 (optional)" value={form.line2}
            onChange={e => setForm({ ...form, line2: e.target.value })} />
          <input style={s.input} placeholder="City" value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })} required />
          <input style={s.input} placeholder="State" value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })} required />
          <input style={s.input} placeholder="Pincode" value={form.pincode}
            onChange={e => setForm({ ...form, pincode: e.target.value })} required />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.saveBtn} type="submit">Save Address</button>
            <button style={s.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

const s = {
  page:      { padding: '2rem', maxWidth: 600, margin: '0 auto', minHeight: '80vh' },
  back:      { background: 'none', border: 'none', color: '#3B6D11', fontSize: 14, cursor: 'pointer', marginBottom: 12, padding: 0 },
  title:     { fontSize: 22, fontWeight: 700, color: '#173404', marginBottom: 16 },
  error:     { background: '#fdecea', color: '#c62828', fontSize: 13, borderRadius: 6, padding: '8px 12px', marginBottom: 12 },
  card:      { background: '#fff', border: '1px solid #e8f0dc', borderRadius: 10, padding: '1rem', marginBottom: 10 },
  label:     { fontSize: 12, fontWeight: 700, color: '#3B6D11', textTransform: 'uppercase', marginBottom: 4 },
  name:      { fontSize: 14, fontWeight: 600, color: '#173404', marginBottom: 2 },
  line:      { fontSize: 13, color: '#666', marginBottom: 8 },
  deleteBtn: { background: 'none', border: '1px solid #e57373', color: '#e57373', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' },
  addBtn:    { width: '100%', background: '#fff', border: '1.5px dashed #3B6D11', color: '#3B6D11', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
  form:      { display: 'flex', flexDirection: 'column', gap: 10, background: '#fff', border: '1px solid #e8f0dc', borderRadius: 10, padding: '1rem', marginTop: 8 },
  input:     { padding: '10px 12px', borderRadius: 8, border: '1px solid #e8f0dc', fontSize: 14, fontFamily: 'inherit' },
  saveBtn:   { flex: 1, background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'none', border: '1px solid #ccc', color: '#666', borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' },
}
