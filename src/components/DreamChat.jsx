import { useState } from 'react';
import { generateDreamVideo, pollVideoJob } from '../../api.js';

export default function DreamChat({ isDarkMode }) {
  const [dreamText, setDreamText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = dreamText.trim();
    if (!text) return;

    setLoading(true);
    setMessage('');
    setVideoUrl('');

    try {
      // Generate video with Magic Hour
      setMessage('Creating your dream video...');
      setMessageType('success');
      const { jobId } = await generateDreamVideo(text);
      console.log('Job created:', jobId);

      // Save dream to MongoDB
      const saveDreamRes = await fetch('http://localhost:3001/api/save-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text, jobId })
      });
      
      if (!saveDreamRes.ok) {
        console.warn('Failed to save dream to database');
      } else {
        const savedDream = await saveDreamRes.json();
        console.log('Dream saved to MongoDB:', savedDream.dreamId);
      }

      // Poll backend for video
      setMessage('Generating video... this usually takes 1-2 minutes');
      const result = await pollVideoJob(jobId);

      if (result.status === 'complete' && result.url) {
        setMessage('✨ Your dream video is ready!');
        setMessageType('success');
        setVideoUrl(result.url);
      } else if (result.status === 'timeout') {
        setMessage(
          'Video is still generating. Check on Magic Hour'
        );
        setMessageType('success');
      } else if (result.status === 'error') {
        setMessage(`Error: ${result.error}`);
        setMessageType('error');
      } else {
        setMessage(`Unexpected response: ${JSON.stringify(result)}`);
        setMessageType('error');
      }

      setDreamText('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const lightModeContainerStyle = {
    flex: 1,
    background: 'linear-gradient(180deg, #e8f4ff 0%, #ffc0d9 100%)',
    padding: '2rem 1.5rem',
    minHeight: 'calc(100vh - 52px)',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'background 0.3s ease'
  };

  const darkModeContainerStyle = {
    flex: 1,
    background: 'linear-gradient(180deg, #0f1b2e 0%, #4a2a5f 100%)',
    padding: '2rem 1.5rem',
    minHeight: 'calc(100vh - 52px)',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'background 0.3s ease'
  };

  const containerStyle = isDarkMode ? darkModeContainerStyle : lightModeContainerStyle;

  const lightModeInputStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid #bde0fe',
    borderRadius: '0.5rem',
    outline: 'none',
    resize: 'none',
    minHeight: '12rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#333',
    fontSize: '1rem',
    fontFamily: "'Courier New', Courier, monospace"
  };

  const darkModeInputStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid #6b4fa0',
    borderRadius: '0.5rem',
    outline: 'none',
    resize: 'none',
    minHeight: '12rem',
    backgroundColor: 'rgba(30, 20, 50, 0.8)',
    color: '#e0d4f0',
    fontSize: '1rem',
    fontFamily: "'Courier New', Courier, monospace"
  };

  const inputStyle = isDarkMode ? darkModeInputStyle : lightModeInputStyle;

  const lightModeButtonStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffafcc',
    color: '#333',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: "'Courier New', Courier, monospace"
  };

  const darkModeButtonStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#b080c0',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: "'Courier New', Courier, monospace"
  };

  const buttonStyle = isDarkMode ? darkModeButtonStyle : lightModeButtonStyle;

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: isDarkMode ? '#e0d4f0' : '#333', fontFamily: "'Courier New', Courier, monospace" }}>
            Share Your Dream
          </h2>
          <p style={{ color: isDarkMode ? '#c0b4d0' : '#555', fontSize: '1rem', fontFamily: "'Courier New', Courier, monospace" }}>
            Write down your dream and we'll create a magical video for you
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="Write your dream here..."
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Save Dream'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: isDarkMode 
                ? (messageType === 'success' ? 'rgba(100, 200, 120, 0.2)' : 'rgba(255, 100, 100, 0.2)')
                : (messageType === 'success' ? 'rgba(200, 255, 200, 0.9)' : 'rgba(255, 200, 200, 0.9)'),
              color: isDarkMode
                ? (messageType === 'success' ? '#90ee90' : '#ff6b6b')
                : (messageType === 'success' ? '#1a4d1a' : '#4d1a1a'),
              border: `1px solid ${isDarkMode 
                ? (messageType === 'success' ? '#60c080' : '#ff6b6b')
                : (messageType === 'success' ? '#90ee90' : '#ffcccc')}`
            }}
          >
            {message}
          </div>
        )}

        {videoUrl && (
          <div style={{ marginTop: '2rem' }}>
            <video
              width="100%"
              controls
              style={{
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                margin: '0 auto',
                display: 'block'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
