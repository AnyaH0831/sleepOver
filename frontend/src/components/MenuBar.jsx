import { useState } from 'react';

export default function MenuBar({ isDarkMode, toggleDarkMode, currentView, onViewChange }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const lightModeStyle = {
    nav: {
      width: '100%',
      backgroundColor: '#ffafcc',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '0.5rem 1.5rem',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.3s ease'
    },
    title: { fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#333', fontFamily: "'Courier New', Courier, monospace" },
    addButton: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#bde0fe',
      color: '#333',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.2s ease',
      transform: hoveredButton === 'add' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'add' ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
    },
    archiveButton: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#a2d2ff',
      color: '#333',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.2s ease',
      transform: hoveredButton === 'archive' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'archive' ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
    },
    darkToggle: {
      padding: '0.25rem',
      backgroundColor: '#cdb4db',
      color: '#333',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.3s ease',
      transform: hoveredButton === 'dark' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'dark' ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
    }
  };

  const darkModeStyle = {
    nav: {
      width: '100%',
      backgroundColor: '#1a2d4d',
      boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
      padding: '0.5rem 1.5rem',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.3s ease'
    },
    title: { fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#e0d4f0', fontFamily: "'Courier New', Courier, monospace" },
    addButton: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#b080c0',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.2s ease',
      transform: hoveredButton === 'add' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'add' ? '0 4px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)'
    },
    archiveButton: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#7d5ba8',
      color: '#e0d4f0',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.2s ease',
      transform: hoveredButton === 'archive' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'archive' ? '0 4px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)'
    },
    darkToggle: {
      padding: '0.25rem',
      backgroundColor: '#8a6bb8',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontFamily: "'Courier New', Courier, monospace",
      transition: 'all 0.3s ease',
      transform: hoveredButton === 'dark' ? 'scale(1.1)' : 'scale(1)',
      boxShadow: hoveredButton === 'dark' ? '0 4px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)'
    }
  };

  const styles = isDarkMode ? darkModeStyle : lightModeStyle;

  return (
    <nav style={styles.nav}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side - Dream Journal title */}
        <div>
          <h1 style={styles.title}>
            Dream Journal
          </h1>
        </div>

        {/* Right side - Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Add New button - just '+' */}
          <button
            style={{
              ...styles.addButton,
              backgroundColor: currentView === 'chat' 
                ? (isDarkMode ? '#b080c0' : '#bde0fe')
                : (isDarkMode ? '#8a6bb8' : '#cdb4db')
            }}
            onMouseEnter={() => setHoveredButton('add')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => onViewChange('chat')}
            title="Create new dream"
          >
            +
          </button>

          {/* Archive button */}
          <button
            style={{
              ...styles.archiveButton,
              backgroundColor: currentView === 'archive' 
                ? (isDarkMode ? '#b080c0' : '#bde0fe')
                : (isDarkMode ? '#8a6bb8' : '#cdb4db')
            }}
            onMouseEnter={() => setHoveredButton('archive')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => onViewChange('archive')}
            title="View archived dreams"
          >
            Archive
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            style={styles.darkToggle}
            onMouseEnter={() => setHoveredButton('dark')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
