import React, { useState, useEffect } from 'react';
import MultiSelect from './MultiSelect';
import './MultiSelect.css';

// Интерфейс для временных зон
interface Timezone {
  label: string; // Отображаемое название
  value: string; // Значение временной зоны
}

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
        // Запрос к API для получения временных зон
        const response = await fetch(
          'https://timeapi.io/api/timezone/availabletimezones'
        );
        
        // Проверка успешности запроса
        if (!response.ok) {
          throw new Error('Failed to fetch timezones');
        }
        
        // Парсинг ответа и преобразование в нужный формат
        const data = await response.json();
        setTimezones(
          data.map((tz: string) => ({
            label: tz,
            value: tz,
          }))
        );
      } catch (err) {
        // Обработка ошибок
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        // Снятие флага загрузки
        setIsLoading(false);
      }
    };

    fetchTimezones();
  }, []); // Пустой массив зависимостей - выполняется один раз при монтировании

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

  // Отображение ошибки
  if (error) {
    return <div className="status-message status-message--error">Error: {error}</div>;
  }

  // Основной рендеринг компонента
  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1>Timezone Selector</h1>
      
      {/* Компонент Multiselect */}
      <MultiSelect
        options={timezones} // Доступные опции
        selectedOptions={selectedTimezones} // Выбранные опции
        onSelectionChange={setSelectedTimezones} // Обработчик изменения выбора
        placeholder="Select timezones..." // Плейсхолдер
      />
      
      {/* Блок выбранных временных зон */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Selected Timezones:</h3>
          {/* Кнопка очистки (отображается только если есть выбранные зоны) */}
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
