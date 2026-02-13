import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';

const ExpenseFilter = () => {
  const { state, dispatch } = useExpenseContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'food', label: '🍔 Продукты' },
    { value: 'transport', label: '🚗 Транспорт' },
    { value: 'entertainment', label: '🎮 Развлечения' },
    { value: 'utilities', label: '💡 Коммунальные услуги' },
    { value: 'health', label: '🏥 Здоровье' },
    { value: 'education', label: '📚 Образование' },
    { value: 'other', label: '📦 Другое' }
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { searchQuery: query }
    });
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { category: cat }
    });
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
      dispatch({ type: 'SET_FILTERS', payload: { startDate: value } });
    } else {
      setEndDate(value);
      dispatch({ type: 'SET_FILTERS', payload: { endDate: value } });
    }
  };

  const handleSort = (sortBy) => {
    const currentOrder = state.filters.sortOrder;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { sortBy, sortOrder: newOrder }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setCategory('');
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { 
        searchQuery: '',
        category: '',
        startDate: null,
        endDate: null,
        sortBy: 'date',
        sortOrder: 'desc'
      }
    });
  };

  return (
    <div className="filters-panel">
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <select value={category} onChange={handleCategoryChange}>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          placeholder="От"
          value={startDate}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />

        <input
          type="date"
          placeholder="До"
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />

        <button className="btn btn-secondary" onClick={clearFilters}>
          🧹 Сбросить фильтры
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px' }}>Сортировать по:</span>
        <button 
          className="btn btn-secondary" 
          onClick={() => handleSort('date')}
          style={{ marginRight: '5px' }}
        >
          📅 Дата {state.filters.sortBy === 'date' && (state.filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => handleSort('amount')}
          style={{ marginRight: '5px' }}
        >
          💰 Сумма {state.filters.sortBy === 'amount' && (state.filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => handleSort('category')}
        >
          🏷️ Категория {state.filters.sortBy === 'category' && (state.filters.sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;