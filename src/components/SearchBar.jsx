import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="search-input"
      />
    </div>
  );
}
