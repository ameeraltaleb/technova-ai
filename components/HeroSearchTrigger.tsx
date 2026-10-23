'use client';

export default function HeroSearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <div
      className="hero__search"
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      <span className="hero__search-icon">🔍</span>
      <input
        type="text"
        className="hero__search-input"
        id="heroSearch"
        placeholder="Search tools, reviews, AI models... (Ctrl+K)"
        readOnly
        style={{ cursor: 'pointer' }}
      />
      <button
        type="button"
        className="hero__search-btn"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        Search
      </button>
    </div>
  );
}
