export default function FilterChips({ options, selected, onSelect, allLabel = 'All' }) {
  return (
    <div className="filter-chips">
      <button
        className={`filter-chip ${selected === null ? 'filter-chip-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.id || option}
          className={`filter-chip ${selected === (option.id || option) ? 'filter-chip-active' : ''}`}
          onClick={() => onSelect(option.id || option)}
        >
          {option.name || option}
        </button>
      ))}
    </div>
  );
}
