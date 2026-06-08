const FilterBar = ({ value, setValue, onFilter, placeholder }) => (
  <div className="filter-bar">
    <input
      className="filter-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onFilter()}
    />
    <button className="btn btn-outline" onClick={onFilter}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
      </svg>
      Filter
    </button>
  </div>
);

export default FilterBar;
