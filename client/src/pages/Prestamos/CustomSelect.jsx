import { useState, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function CustomSelect({ value, onChange, options = [], placeholder = 'Selecciona una opción', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const opt = options.find(o => o.value === value);
    return opt ? opt.label : '';
  }, [options, value]);

  return (
    <div className={`custom-select ${className} ${isOpen ? 'open' : ''}`}>
      <div
        className="select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-value">
          {selectedLabel || placeholder}
        </span>
        <FiChevronDown className="select-arrow" />
      </div>
      {isOpen && (
        <div className="select-dropdown">
          {options.map((option, index) => (
            <div
              key={index}
              className={`select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}