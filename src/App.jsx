import { useState, useEffect } from 'react'
import './App.css'
import { playHoverSound, playClickSound, playFocusSound, playSubmitSound, initAudio } from './sounds'

function App() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Initialize audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleFirstInteraction)
    }
    document.addEventListener('click', handleFirstInteraction)
    return () => document.removeEventListener('click', handleFirstInteraction)
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        playSubmitSound()
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to connect. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const products = [
    { name: 'Midnight Lattice, 400TC', tag: 'SIGNATURE' },
    { name: 'Deccan Damask, King', tag: 'SIGNATURE' },
    { name: 'Monsoon Grid, Queen', tag: 'COMING' },
    { name: 'Temple Geometry, Double-woven', tag: 'COMING' },
    { name: 'Desert Rose, Cotton Sateen', tag: 'COMING' },
    { name: 'Morning Fog, 600TC', tag: 'COMING' },
    { name: 'Paisley Heritage, Aurangabad', tag: 'COMING' },
    { name: 'Raised Diamond, King', tag: 'COMING' },
  ]

  return (
    <>
      <header className="global-header">
        <span>The Textile Co.</span>
        <span>Est. 1990</span>
      </header>

      <div className="layout-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span>COLLECTION</span>
            <span style={{ opacity: 0.5 }}>(Preview)</span>
          </div>
          <div className="list-container">
            {products.map((product, i) => (
              <div 
                className="list-item" 
                key={i}
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
              >
                <span className="item-label">{product.name}</span>
                <span className="item-tag">{product.tag}</span>
              </div>
            ))}
          </div>
          
          <div className="heritage-section">
            <div className="heritage-title">HERITAGE</div>
            <div className="heritage-stats">
              <div className="stat">
                <span className="stat-value">5</span>
                <span className="stat-label">Generations</span>
              </div>
              <div className="stat">
                <span className="stat-value">35+</span>
                <span className="stat-label">Years</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="main-content">
          <div className="meta-data">
            LAT: 19.8762° N<br />
            LON: 75.3433° E<br />
            STATUS: PENDING
          </div>

          <div>
            <h1 className="hero-statement">
              PRINT FADES.<br />
              JACQUARD STAYS<span className="cursor"></span>
            </h1>
            <p className="hero-sub">
              Weaving modern utility with archival precision. A new standard in structural soft-goods.
            </p>
          </div>

          <div className="signup-container">
            {!submitted ? (
              <>
                <label className="signup-label">Get notified when we launch</label>
                <form className={`input-group ${focused ? 'focused' : ''}`} onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => { setFocused(true); playFocusSound(); }}
                    onBlur={() => setFocused(false)}
                    disabled={isSubmitting}
                    required
                  />
                  <button type="submit" className="submit-btn" onClick={playClickSound} disabled={isSubmitting}>
                    {isSubmitting ? '...' : '>'}
                  </button>
                </form>
                {error && <div className="error-message">{error}</div>}
              </>
            ) : (
              <div className="success-message">
                REGISTERED. WE'LL BE IN TOUCH.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default App
