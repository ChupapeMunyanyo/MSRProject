import React, { useState, useRef, useEffect } from 'react';
import "./MultiSelect.css"
import type { MultiselectProps } from './types';

const MultiSelect: React.FC<MultiselectProps> = ({
  options, // Доступные опции
  selectedOptions, // Выбранные опции
  onSelectionChange, // Обработчик изменения выбора
  placeholder = 'Select...', // Плейсхолдер по умолчанию
}) => {
  // Состояния компонента
  const [isOpen, setIsOpen] = useState(false); // Открыт ли dropdown
  const [searchTerm, setSearchTerm] = useState(''); // Текст поиска
  const [focusedIndex, setFocusedIndex] = useState(-1); // Индекс выделенной опции
  const wrapperRef = useRef<HTMLDivElement>(null); // Референс на обёртку
  const inputRef = useRef<HTMLInputElement>(null); // Референс на поле ввода

  // Фильтрация опций по поисковому запросу
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обработчик навигации с клавиатуры
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            toggleOption(filteredOptions[focusedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, filteredOptions]);

  // Переключение выбора опции
  const toggleOption = (value: string) => {
    const newSelected = selectedOptions.includes(value)
      ? selectedOptions.filter(v => v !== value) // Удаление если уже выбрана
      : [...selectedOptions, value]; // Добавление если не выбрана
    onSelectionChange(newSelected);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Удаление конкретной опции
  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие
    onSelectionChange(selectedOptions.filter(v => v !== value));
  };

  // Очистка всех выбранных опций
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  // Обработчик фокуса на поле ввода
  const handleInputFocus = () => {
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  // Обработчик наведения на опцию
  const handleOptionMouseEnter = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <div className="multiselect" ref={wrapperRef}>
      {/* Основной контрол */}
      <div
        className={`multiselect__control ${isOpen ? 'multiselect__control--focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Плейсхолдер если ничего не выбрано и нет поиска */}
        {selectedOptions.length === 0 && !searchTerm && (
          <div className="multiselect__placeholder"></div>
        )}

        {/* Контейнер для выбранных тегов */}
        <div className="multiselect__tags">
          {selectedOptions.map(value => {
            const option = options.find(opt => opt.value === value);
            return option ? (
              <div key={value} className="multiselect__tag">
                {option.label}
                <button
                  className="multiselect__tag-remove"
                  onClick={(e) => removeOption(value, e)}
                >
                  ×
                </button>
              </div>
            ) : null;
          })}
          {/* Поле ввода для поиска */}
          <input
            ref={inputRef}
            className="multiselect__input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={selectedOptions.length > 0 ? '' : placeholder}
          />
        </div>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="multiselect__dropdown">
          {filteredOptions.length === 0 ? (
            <div className="multiselect__no-options">
              {options.length === 0 ? 'No options available' : 'No options found'}
            </div>
          ) : (
            <>
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`multiselect__option ${
                    selectedOptions.includes(option.value)
                      ? 'multiselect__option--selected'
                      : ''
                  } ${
                    index === focusedIndex ? 'multiselect__option--focused' : ''
                  }`}
                  onClick={() => toggleOption(option.value)}
                  onMouseEnter={() => handleOptionMouseEnter(index)}
                >
                  {option.label}
                </div>
              ))}
            </>
          )}
          {/* Кнопка очистки всех выбранных опций */}
          {selectedOptions.length > 0 && (
            <button className="multiselect__clear-all" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;