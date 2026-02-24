import { useEffect, useRef } from 'react';

const activeStyle = {
  background: '#3B8EC4',
  backgroundColor: '#3B8EC4',
  borderColor: '#3B8EC4',
  color: '#FFFFFF',
};

// Force active chip styles via DOM to beat Kajabi !important overrides
function useForceChipStyles(containerRef, selected) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const apply = () => {
      const chips = container.querySelectorAll('.filter-chip');
      chips.forEach((chip) => {
        if (chip.classList.contains('filter-chip-active')) {
          chip.style.setProperty('background', '#3B8EC4', 'important');
          chip.style.setProperty('background-color', '#3B8EC4', 'important');
          chip.style.setProperty('border-color', '#3B8EC4', 'important');
          chip.style.setProperty('color', '#FFFFFF', 'important');
        } else {
          chip.style.removeProperty('background');
          chip.style.removeProperty('background-color');
          chip.style.removeProperty('border-color');
          chip.style.removeProperty('color');
        }
      });
    };
    apply();
    const t1 = setTimeout(apply, 100);
    const t2 = setTimeout(apply, 500);
    const t3 = setTimeout(apply, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [selected]);
}

export default function FilterChips({ options, selected, onSelect, allLabel = 'All' }) {
  const containerRef = useRef(null);
  useForceChipStyles(containerRef, selected);

  return (
    <div className="filter-chips" ref={containerRef}>
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
