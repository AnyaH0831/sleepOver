import { useState, useEffect } from 'react';

export default function Archive({ isDarkMode }) {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/dreams');
      if (!response.ok) throw new Error('Failed to fetch dreams');
      const data = await response.json();
      setDreams(data);
      setError('');
    } catch (err) {
      setError(`Error loading dreams: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const containerStyle = {
    flex: 1,
    padding: '2rem 1.5rem',
    minHeight: 'calc(100vh - 52px)',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'background 0.3s ease',
    background: isDarkMode
      ? 'linear-gradient(180deg, #0f1b2e 0%, #4a2a5f 100%)'
      : 'linear-gradient(180deg, #e8f4ff 0%, #f0d4e8 100%)',
  };

  const contentWrapperStyle = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle = {
    marginBottom: '3rem',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: isDarkMode ? '#e0d4f0' : '#333',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: isDarkMode ? '#c0b4d0' : '#666',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const postsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };

  const postStyle = {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.6)' : 'rgba(255, 255, 255, 0.7)',
    border: `1px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.3)' : 'rgba(189, 224, 254, 0.5)'}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const postHoverStyle = {
    ...postStyle,
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    boxShadow: isDarkMode
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  };

  const dateStyle = {
    fontSize: '0.9rem',
    color: isDarkMode ? '#b080c0' : '#aa3bff',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const descriptionStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: isDarkMode ? '#e0d4f0' : '#333',
    marginBottom: '1rem',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const videoContainerStyle = {
    marginTop: '1rem',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  };

  const statusStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    display: 'inline-block',
    marginTop: '1rem',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const statusCompleteStyle = {
    ...statusStyle,
    backgroundColor: isDarkMode ? 'rgba(100, 200, 120, 0.2)' : 'rgba(200, 255, 200, 0.6)',
    color: isDarkMode ? '#90ee90' : '#2d7a2d',
  };

  const statusProcessingStyle = {
    ...statusStyle,
    backgroundColor: isDarkMode ? 'rgba(255, 200, 100, 0.2)' : 'rgba(255, 220, 100, 0.6)',
    color: isDarkMode ? '#ffc857' : '#996600',
  };

  const statusErrorStyle = {
    ...statusStyle,
    backgroundColor: isDarkMode ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 150, 150, 0.6)',
    color: isDarkMode ? '#ff6b6b' : '#cc0000',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    color: isDarkMode ? '#c0b4d0' : '#999',
    fontFamily: "'Courier New', Courier, monospace",
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'complete':
        return statusCompleteStyle;
      case 'processing':
        return statusProcessingStyle;
      case 'error':
        return statusErrorStyle;
      default:
        return statusStyle;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Dream Archive</h1>
          <p style={subtitleStyle}>Your collection of generated dreams</p>
        </div>

        {error && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: isDarkMode ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 200, 200, 0.6)',
              color: isDarkMode ? '#ff6b6b' : '#cc0000',
              marginBottom: '2rem',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.2rem' }}>Loading dreams...</p>
          </div>
        ) : dreams.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.5rem' }}>No dreams yet</p>
            <p>Create your first dream to see it here!</p>
          </div>
        ) : (
          <div style={postsContainerStyle}>
            {dreams.map((dream, index) => (
              <DreamPost
                key={dream._id}
                dream={dream}
                isDarkMode={isDarkMode}
                postStyle={postStyle}
                postHoverStyle={postHoverStyle}
                dateStyle={dateStyle}
                descriptionStyle={descriptionStyle}
                videoContainerStyle={videoContainerStyle}
                getStatusStyle={getStatusStyle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DreamPost({
  dream,
  isDarkMode,
  postStyle,
  postHoverStyle,
  dateStyle,
  descriptionStyle,
  videoContainerStyle,
  getStatusStyle,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={isHovered ? postHoverStyle : postStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={dateStyle}>Date: {formatDate(dream.createdAt)}</div>

      <p style={descriptionStyle}>{dream.description}</p>

      {dream.videoUrl && (
        <div style={videoContainerStyle}>
          <video
            width="100%"
            controls
            style={{
              borderRadius: '0.5rem',
              backgroundColor: isDarkMode ? '#0a0a0a' : '#f0f0f0',
            }}
          >
            <source src={dream.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div style={getStatusStyle(dream.status)}>
        {dream.status === 'complete' && 'Complete'}
        {dream.status === 'processing' && 'Processing'}
        {dream.status === 'error' && 'Error'}
      </div>
    </div>
  );
}
