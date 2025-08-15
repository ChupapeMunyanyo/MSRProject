import React, { useState, useEffect } from 'react';
import MultiSelect from './MultiSelect';
import './MultiSelect.css';

// Интерфейс для временных зон
interface Timezone {
  label: string; // Отображаемое название
  value: string; // Значение временной зоны
}

// Мок-данные временных зон
const mockTimezones: Timezone[] = [
  { label: "Europe/Moscow", value: "Europe/Moscow" },
  { label: "America/New_York", value: "America/New_York" },
  { label: "America/Los_Angeles", value: "America/Los_Angeles" },
  { label: "Europe/London", value: "Europe/London" },
  { label: "Asia/Tokyo", value: "Asia/Tokyo" },
  { label: "Australia/Sydney", value: "Australia/Sydney" },
  { label: "Africa/Cairo", value: "Africa/Cairo" },
  { label: "Asia/Dubai", value: "Asia/Dubai" },
  { label: "Asia/Shanghai", value: "Asia/Shanghai" },
  { label: "Europe/Berlin", value: "Europe/Berlin" },
  { label: "Europe/Paris", value: "Europe/Paris" },
  { label: "Pacific/Honolulu", value: "Pacific/Honolulu" },
  { label: "Asia/Kolkata", value: "Asia/Kolkata" },
  { label: "America/Chicago", value: "America/Chicago" },
  { label: "America/Toronto", value: "America/Toronto" },
];

const App: React.FC = () => {
  // Состояния компонента
  const [timezones, setTimezones] = useState<Timezone[]>([]); // Список доступных временных зон
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([]); // Выбранные временные зоны
  const [isLoading, setIsLoading] = useState(true); // Флаг загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка при загрузке

  // Эффект для загрузки временных зон при монтировании
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        // Сначала пробуем получить данные с API
        const response = await fetch(
          'https://timeapi.io/api/timezone/availabletimezones'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch timezones');
        }
        
        const data = await response.json();
        setTimezones(
          data.map((tz: string) => ({
            label: tz,
            value: tz,
          }))
        );
      } catch (err) {
        // Если API не работает, используем мок-данные
        console.warn('API request failed, using mock data instead');
        setTimezones(mockTimezones);
        setError(null); // Сбрасываем ошибку, так как у нас есть fallback
      } finally {
        setIsLoading(false);
      }
    };

    // Для демонстрации можно сразу использовать мок-данные без запроса:
    // setTimezones(mockTimezones);
    // setIsLoading(false);
    
    fetchTimezones();
  }, []);

  // Удаление конкретной временной зоны
  const handleRemoveTimezone = (timezoneToRemove: string) => {
    setSelectedTimezones(prev => 
      prev.filter(tz => tz !== timezoneToRemove)
    );
  };

  // Очистка всех выбранных временных зон
  const handleClearAll = () => {
    setSelectedTimezones([]);
  };

  // Отображение состояния загрузки
  if (isLoading) {
    return <div className="status-message">Loading timezones...</div>;
  }

  // Отображение ошибки (если нет мок-данных)
  if (error && timezones.length === 0) {
    return <div className="status-message status-message--error">Error: {error}</div>;
  }

  // Основной рендеринг компонента
  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1>Timezone Selector</h1>
      
      {/* Компонент Multiselect */}
      <MultiSelect
        options={timezones}
        selectedOptions={selectedTimezones}
        onSelectionChange={setSelectedTimezones}
        placeholder="Select timezones..."
      />
      
      {/* Блок выбранных временных зон */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Selected Timezones:</h3>
          {selectedTimezones.length > 0 && (
            <button 
              onClick={handleClearAll}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Список выбранных временных зон */}
        <div className="multiselect__selected-items">
          {selectedTimezones.length === 0 ? (
            <div style={{ color: '#999' }}>No timezones selected</div>
          ) : (
            selectedTimezones.map(tz => (
              <div key={tz} className="multiselect__selected-item">
                {tz}
                <button 
                  className="multiselect__selected-item-remove"
                  onClick={() => handleRemoveTimezone(tz)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
