import React, { useState } from 'react'
import { api } from './api.js'

export default function Login({ setUser, setPage }) {
  const [mode, setMode]         = useState('login') // 'login' | 'register'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = mode === 'login'
        ? await api.login(email, password)
        : await api.register(name, email, password)

      localStorage.setItem('token', data.token)
      setUser({ _id: data._id, name: data.name, email: data.email })
      setPage('home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <form style={s.card} onSubmit={handleSubmit}>
        <h2 style={s.title}>{mode === 'login' ? 'Welcome Back 🌿' : 'Create Account'}</h2>

        {mode === 'register' && (
          <input
            style={s.input}
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}

        <input
          style={s.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <div style={s.passwordWrap}>
          <input
            style={{ ...s.input, width: '100%', paddingRight: 40 }}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <button style={s.btn} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        <p style={s.switch}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.link} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  )
}

const s = {
  page:   { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9f4', padding: '2rem' },
  card:   { background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 380, border: '1px solid #e8f0dc', display: 'flex', flexDirection: 'column', gap: 12 },
  title:  { fontSize: 22, fontWeight: 700, color: '#173404', textAlign: 'center', marginBottom: 8 },
  input:  { padding: '12px 14px', borderRadius: 8, border: '1px solid #e8f0dc', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  passwordWrap: { position: 'relative', display: 'flex', width: '100%' },
  eyeBtn: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', padding: 4, lineHeight: 1 },
  btn:    { background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  error:  { background: '#fdecea', color: '#c62828', fontSize: 13, borderRadius: 6, padding: '8px 12px' },
  switch: { textAlign: 'center', fontSize: 13, color: '#666', marginTop: 4 },
  link:   { color: '#3B6D11', fontWeight: 600, cursor: 'pointer' },
}
