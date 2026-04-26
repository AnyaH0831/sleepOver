import { useState, useEffect } from 'react';

export default function Archive({ isDarkMode }) {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  useEffect(() => {
    fetchDreams();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, customStartDate, customEndDate, itemsPerPage]);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/dreams');
      if (!response.ok) throw new Error('Failed to fetch dreams');
      const data = await response.json();
      setDreams(Array.isArray(data) ? data : data.dreams || []);
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

  const paginationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  };

  const paginationButtonStyle = (isActive) => ({
    padding: '0.4rem 0.75rem',
    fontSize: '0.9rem',
    borderRadius: '0.4rem',
    border: `2px solid ${isActive 
      ? (isDarkMode ? '#b080c0' : '#aa3bff') 
      : (isDarkMode ? 'rgba(176, 128, 192, 0.3)' : 'rgba(189, 224, 254, 0.5)')}`,
    backgroundColor: isActive 
      ? (isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.3)') 
      : (isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)'),
    color: isActive 
      ? (isDarkMode ? '#b080c0' : '#aa3bff') 
      : (isDarkMode ? '#c0b4d0' : '#666'),
    cursor: isActive ? 'default' : 'pointer',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'all 0.2s ease',
    fontWeight: isActive ? '600' : '400',
  });

  const perPageWrapperStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const perPageButtonStyle = {
    padding: '0.4rem 0.75rem',
    fontSize: '0.85rem',
    borderRadius: '0.4rem',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.8)',
    color: isDarkMode ? '#e0d4f0' : '#333',
    fontFamily: "'Courier New', Courier, monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  };

  const perPageDropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    borderRadius: '0.5rem',
    minWidth: '100px',
    boxShadow: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    backdropFilter: 'blur(10px)',
  };

  const perPageItemStyle = (isActive) => ({
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    backgroundColor: isActive 
      ? (isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.3)')
      : 'transparent',
    color: isActive
      ? (isDarkMode ? '#b080c0' : '#aa3bff')
      : (isDarkMode ? '#c0b4d0' : '#666'),
    borderBottom: `1px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.2)'}`,
    transition: 'all 0.2s ease',
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: isActive ? '600' : '400',
  });

  const perPageItemHoverStyle = (isActive) => ({
    ...perPageItemStyle(isActive),
    backgroundColor: isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)',
  });

  const searchContainerStyle = {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const searchInputStyle = {
    flex: 1,
    minWidth: '250px',
    maxWidth: '500px',
    padding: '0.4rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.8)',
    color: isDarkMode ? '#e0d4f0' : '#333',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const searchInputFocusStyle = {
    ...searchInputStyle,
    borderColor: isDarkMode ? 'rgba(176, 128, 192, 1)' : 'rgba(189, 224, 254, 1)',
    boxShadow: isDarkMode ? '0 0 8px rgba(176, 128, 192, 0.3)' : '0 0 8px rgba(189, 224, 254, 0.3)',
  };

  const filterContainerStyle = {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  };

  const dropdownWrapperStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const filterButtonStyle = {
    padding: '0.4rem 1.25rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.8)',
    color: isDarkMode ? '#e0d4f0' : '#333',
    fontFamily: "'Courier New', Courier, monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '0.5rem',
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    borderRadius: '0.5rem',
    minWidth: '180px',
    boxShadow: isDarkMode ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    backdropFilter: 'blur(10px)',
  };

  const dropdownItemStyle = (isActive) => ({
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    backgroundColor: isActive 
      ? (isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.3)')
      : 'transparent',
    color: isActive
      ? (isDarkMode ? '#b080c0' : '#aa3bff')
      : (isDarkMode ? '#c0b4d0' : '#666'),
    borderBottom: `1px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.2)'}`,
    transition: 'all 0.2s ease',
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: isActive ? '600' : '400',
  });

  const dropdownItemHoverStyle = (isActive) => ({
    ...dropdownItemStyle(isActive),
    backgroundColor: isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)',
  });

  const dateInputStyle = {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '0.5rem',
    border: `2px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)'}`,
    backgroundColor: isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.8)',
    color: isDarkMode ? '#e0d4f0' : '#333',
    fontFamily: "'Courier New', Courier, monospace",
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const customDateContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
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

  const getDateRange = () => {
    const now = new Date();
    let startDate = null;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { start: startDate, end: now };
      case 'past7days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        return { start: startDate, end: now };
      case 'pastMonth':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        return { start: startDate, end: now };
      case 'pastYear':
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        return { start: startDate, end: now };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate),
          };
        }
        return null;
      default:
        return null;
    }
  };

  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch = dream.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const dateRange = getDateRange();
    if (!dateRange) return true;

    const dreamDate = new Date(dream.createdAt);
    return dreamDate >= dateRange.start && dreamDate <= dateRange.end;
  });

  // Calculate total pages based on filtered dreams
  const calculatedTotalPages = Math.ceil(filteredDreams.length / itemsPerPage) || 1;

  // Slice dreams for current page
  const paginatedDreams = filteredDreams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update totalPages if it changed
  useEffect(() => {
    if (calculatedTotalPages !== totalPages) {
      setTotalPages(calculatedTotalPages);
    }
  }, [calculatedTotalPages, totalPages]);

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
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

        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search your dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 1)' : 'rgba(189, 224, 254, 1)';
              e.target.style.boxShadow = isDarkMode ? '0 0 8px rgba(176, 128, 192, 0.3)' : '0 0 8px rgba(189, 224, 254, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={dropdownWrapperStyle}>
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              style={filterButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 1)' : 'rgba(189, 224, 254, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)';
              }}
            >
              {dateFilter === 'all'
                ? 'All Time'
                : dateFilter === 'today'
                ? 'Today'
                : dateFilter === 'past7days'
                ? 'Past 7 Days'
                : dateFilter === 'pastMonth'
                ? 'Past Month'
                : dateFilter === 'pastYear'
                ? 'Past Year'
                : 'Custom Range'}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                {showDateDropdown ? '▲' : '▼'}
              </span>
            </button>

            {showDateDropdown && (
              <div style={dropdownMenuStyle}>
                <div
                  style={dropdownItemStyle(dateFilter === 'all')}
                  onClick={() => {
                    setDateFilter('all');
                    setShowDateDropdown(false);
                    setShowCustomDatePicker(false);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownItemHoverStyle(dateFilter === 'all'))}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownItemStyle(dateFilter === 'all'))}
                >
                  All Time
                </div>
                <div
                  style={dropdownItemStyle(dateFilter === 'today')}
                  onClick={() => {
                    setDateFilter('today');
                    setShowDateDropdown(false);
                    setShowCustomDatePicker(false);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownItemHoverStyle(dateFilter === 'today'))}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownItemStyle(dateFilter === 'today'))}
                >
                  Today
                </div>
                <div
                  style={dropdownItemStyle(dateFilter === 'past7days')}
                  onClick={() => {
                    setDateFilter('past7days');
                    setShowDateDropdown(false);
                    setShowCustomDatePicker(false);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownItemHoverStyle(dateFilter === 'past7days'))}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownItemStyle(dateFilter === 'past7days'))}
                >
                  Past 7 Days
                </div>
                <div
                  style={dropdownItemStyle(dateFilter === 'pastMonth')}
                  onClick={() => {
                    setDateFilter('pastMonth');
                    setShowDateDropdown(false);
                    setShowCustomDatePicker(false);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownItemHoverStyle(dateFilter === 'pastMonth'))}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownItemStyle(dateFilter === 'pastMonth'))}
                >
                  Past Month
                </div>
                <div
                  style={dropdownItemStyle(dateFilter === 'pastYear')}
                  onClick={() => {
                    setDateFilter('pastYear');
                    setShowDateDropdown(false);
                    setShowCustomDatePicker(false);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, dropdownItemHoverStyle(dateFilter === 'pastYear'))}
                  onMouseLeave={(e) => Object.assign(e.target.style, dropdownItemStyle(dateFilter === 'pastYear'))}
                >
                  Past Year
                </div>
                <div
                  style={{
                    ...dropdownItemStyle(dateFilter === 'custom'),
                    borderBottom: 'none',
                  }}
                  onClick={() => {
                    setDateFilter('custom');
                    setShowCustomDatePicker(!showCustomDatePicker);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, { ...dropdownItemHoverStyle(dateFilter === 'custom'), borderBottom: 'none' })}
                  onMouseLeave={(e) => Object.assign(e.target.style, { ...dropdownItemStyle(dateFilter === 'custom'), borderBottom: 'none' })}
                >
                  Custom Range
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          {showCustomDatePicker && dateFilter === 'custom' && (
            <div style={customDateContainerStyle}>
              <div>
                <label style={{ color: isDarkMode ? '#c0b4d0' : '#666', marginRight: '0.5rem' }}>
                  From:
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>
              <div>
                <label style={{ color: isDarkMode ? '#c0b4d0' : '#666', marginRight: '0.5rem' }}>
                  To:
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.2rem' }}>Loading dreams...</p>
          </div>
        ) : filteredDreams.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.5rem' }}>{searchQuery ? 'No dreams found' : 'No dreams yet'}</p>
            <p>{searchQuery ? 'Try a different search term' : 'Create your first dream to see it here!'}</p>
          </div>
        ) : (
          <>
            <div style={postsContainerStyle}>
              {paginatedDreams.map((dream, index) => (
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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={perPageWrapperStyle}>
                <button
                  onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                  style={perPageButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 1)' : 'rgba(189, 224, 254, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = isDarkMode ? 'rgba(176, 128, 192, 0.5)' : 'rgba(189, 224, 254, 0.8)';
                  }}
                >
                  {itemsPerPage} per page
                  <span style={{ fontSize: '0.7rem' }}>
                    {showPerPageDropdown ? '▲' : '▼'}
                  </span>
                </button>

                {showPerPageDropdown && (
                  <div style={perPageDropdownMenuStyle}>
                    {[5, 10, 15, 20, 25].map((num) => (
                      <div
                        key={num}
                        style={{
                          ...perPageItemStyle(itemsPerPage === num),
                          borderBottom: num === 25 ? 'none' : `1px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.2)'}`,
                        }}
                        onClick={() => {
                          setItemsPerPage(num);
                          setShowPerPageDropdown(false);
                          setCurrentPage(1);
                        }}
                        onMouseEnter={(e) => Object.assign(e.target.style, perPageItemHoverStyle(itemsPerPage === num))}
                        onMouseLeave={(e) => Object.assign(e.target.style, { ...perPageItemStyle(itemsPerPage === num), borderBottom: num === 25 ? 'none' : `1px solid ${isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.2)'}` })}
                      >
                        {num} items
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    style={paginationButtonStyle(false)}
                    onMouseEnter={(e) => {
                      if (currentPage > 1) {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)';
                    }}
                  >
                    ≪
                  </button>

                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={paginationButtonStyle(false)}
                    onMouseEnter={(e) => {
                      if (currentPage > 1) {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)';
                    }}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={paginationButtonStyle(currentPage === page)}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.target.style.backgroundColor = isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = currentPage === page 
                          ? (isDarkMode ? 'rgba(176, 128, 192, 0.2)' : 'rgba(189, 224, 254, 0.3)')
                          : (isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)');
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={paginationButtonStyle(false)}
                    onMouseEnter={(e) => {
                      if (currentPage < totalPages) {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)';
                    }}
                  >
                    ›
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    style={paginationButtonStyle(false)}
                    onMouseEnter={(e) => {
                      if (currentPage < totalPages) {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(176, 128, 192, 0.15)' : 'rgba(189, 224, 254, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDarkMode ? 'rgba(30, 20, 50, 0.4)' : 'rgba(255, 255, 255, 0.6)';
                    }}
                  >
                    ≫
                  </button>
                </>
              )}
            </div>
          </>
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
