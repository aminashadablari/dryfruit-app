import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError('Wrong password. Try again.')
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>🔒 Mama Mia Souk</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '280px' }}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.6rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: '0.6rem', fontSize: '1rem', borderRadius: '6px',
            background: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Enter
        </button>
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      </form>
    </div>
  )
}
