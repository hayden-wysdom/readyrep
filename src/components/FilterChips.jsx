const activeStyle = {
  background: '#3B8EC4',
  backgroundColor: '#3B8EC4',
  borderColor: '#3B8EC4',
  color: '#FFFFFF',
};

export default function FilterChips({ options, selected, onSelect, allLabel = 'All' }) {
  return (
    <div className="filter-chips">
      <button
        className={`filter-chip ${selected === null ? 'filter-chip-active' : ''}`}
        style={selected === null ? activeStyle : {}}
        onClick={() => onSelect(null)}
      >
        {allLabel}
      </button>
      {options.map((option) => {
        const isActive = selected === (option.id || option);
        return (
          <button
            key={option.id || option}
            className={`filter-chip ${isActive ? 'filter-chip-active' : ''}`}
            style={isActive ? activeStyle : {}}
            onClick={() => onSelect(option.id || option)}
          >
            {option.name || option}
          </button>
        );
      })}
    </div>
  );
}
