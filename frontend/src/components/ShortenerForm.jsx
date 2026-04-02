import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Link2, AlertCircle, Wand2 } from 'lucide-react'
import ResultCard from './ResultCard'
import { AuthContext } from '../context/AuthContext'

// The backend API URL (runs on port 5000 during dev)
// const API_URL = 'https://shorter-url-ltpr.onrender.com'
const API_URL = 'http://localhost:5000'

const ShortenerForm = () => {
  const { token } = useContext(AuthContext)
  // State variables for our form fields
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')

  // State for handling loading, success data, and errors
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const [resetTime, setResetTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')

  // Calculate time remaining if rate limited
  useEffect(() => {
    let interval;
    if (resetTime) {
      // Calculate immediately before interval starts
      const updateTimer = () => {
        const now = new Date();
        const resetDate = new Date(resetTime);
        const diff = resetDate - now;

        if (diff <= 0) {
          setTimeLeft('');
          setResetTime(null);
          setError(null);
          clearInterval(interval);
        } else {
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      };
      
      updateTimer(); // Run once instantly
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [resetTime]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent the page from reloading
    setLoading(true)
    setError(null)
    setResult(null)
    setResetTime(null)
    setTimeLeft('')

    try {
      // Send a POST request to our Express backend
      const response = await axios.post(`${API_URL}/api/url/shorten`, {
        originalUrl,
        customAlias,
        expiresInDays: expiresInDays ? parseInt(expiresInDays) : null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // If successful, save the returned data (the new short code) to state
      setResult(response.data)
      setOriginalUrl('')
      setCustomAlias('')
      setExpiresInDays('')

    } catch (err) {
      // Capture any error messages sent from the backend
      setError(err.response?.data?.error || 'Failed to shorten URL. Please try again.')
      
      // If we got rate limited, capture the reset time
      if (err.response?.data?.resetTime) {
        setResetTime(err.response.data.resetTime)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel">
      {/* If we have a successful result, show the ResultCard component. Otherwise, show the Form */}
      {result ? (
        <ResultCard result={result} onReset={() => setResult(null)} />
      ) : (
        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="url">Long URL <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              id="url"
              type="url"
              placeholder="https://very-long-link.com/article/1"
              className="input-field"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="alias">Custom Alias (Optional)</label>
            <input
              id="alias"
              type="text"
              placeholder="e.g. summer-sale"
              className="input-field"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              pattern="[a-zA-Z0-9-]+"
              title="Only letters, numbers, and hyphens"
            />
          </div>

          <div className="input-group">
            <label htmlFor="expiry">Expires In (Days - Optional)</label>
            <input
              id="expiry"
              type="number"
              placeholder="Leave blank for never"
              className="input-field"
              min="1"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-msg" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                <AlertCircle size={16} /> {error}
              </div>
              {timeLeft && (
                 <div style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,76,76,0.1)', borderRadius: '8px', border: '1px solid rgba(255,76,76,0.2)', color: 'var(--error)'}}>
                   Try again in: <span style={{fontWeight: 'bold'}}>{timeLeft}</span>
                 </div>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Generating...' : <><Wand2 size={20} /> Shorten URL</>}
          </button>
        </form>
      )}
    </div>
  )
}

export default ShortenerForm
