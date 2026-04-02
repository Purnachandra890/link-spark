import { useState, useContext } from 'react'
import ShortenerForm from './components/ShortenerForm'
import AnalyticsPanel from './components/AnalyticsPanel'
import AuthForms from './components/AuthForms'
import { LinkIcon, BarChart2, Scissors, LogOut } from 'lucide-react'
import { AuthContext } from './context/AuthContext'

// Main Application Component
function App() {
  // State to toggle between the 'Shorten' form and the 'Analytics' panel
  
  const [activeTab, setActiveTab] = useState('shorten')
  const { user, logout } = useContext(AuthContext)

  return (
    <>
      {/* Premium Header */}
      <header style={{ position: 'relative', width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
        <h1 className="gradient-text">
          <Scissors size={40} style={{marginRight: '10px'}}/>
          LinkSpark
        </h1>
        <p className="subtitle">Lightning fast URL shortening and analytics</p>
        
        {user && (
          <button 
             onClick={logout} 
             className="tab" 
             style={{
               position: 'absolute', 
               right: '0', 
               top: '0',
               padding: '0.6rem 1.2rem',
               fontSize: '0.9rem'
             }}
          >
             <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
               <LogOut size={16} /> Logout
             </span>
          </button>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'shorten' ? 'active' : ''}`}
          onClick={() => setActiveTab('shorten')}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <LinkIcon size={18} /> Shorten URL
          </span>
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <BarChart2 size={18} /> Analytics
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <main>
        {!user ? (
          <AuthForms />
        ) : (
          /* Render the appropriate component based on the active tab */
          activeTab === 'shorten' ? <ShortenerForm /> : <AnalyticsPanel />
        )}
      </main>
    </>
  )
}

export default App
