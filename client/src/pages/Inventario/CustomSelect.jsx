import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

// Componente Select personalizado
export default function CustomSelect({ showLabel = true, value, onChange, options, placeholder, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`custom-select ${className} ${isOpen ? 'open' : ''}`}>
            <div
                className="select-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="select-value">
                    {showLabel ? (value || placeholder) : placeholder}
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
};