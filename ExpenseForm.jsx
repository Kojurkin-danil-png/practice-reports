import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';

const ExpenseForm = ({ editExpense, onCancel }) => {
  const { dispatch } = useExpenseContext();
  const [formData, setFormData] = useState(
    editExpense || {
      title: '',
      amount: '',
      currency: 'RUB',
      date: new Date().toISOString().split('T')[0],
      category: 'food'
    }
  );

  const categories = [
    { value: 'food', label: '🍔 Продукты' },
    { value: 'transport', label: '🚗 Транспорт' },
    { value: 'entertainment', label: '🎮 Развлечения' },
    { value: 'utilities', label: '💡 Коммунальные услуги' },
    { value: 'health', label: '🏥 Здоровье' },
    { value: 'education', label: '📚 Образование' },
    { value: 'other', label: '📦 Другое' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.date) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Сумма должна быть больше 0');
      return;
    }

    const expenseData = {
      ...formData,
      id: editExpense ? editExpense.id : Date.now(),
      amount: parseFloat(formData.amount)
    };

    if (editExpense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expenseData });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    }

    if (!editExpense) {
      setFormData({
        title: '',
        amount: '',
        currency: 'RUB',
        date: new Date().toISOString().split('T')[0],
        category: 'food'
      });
    }

    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form fade-in">
      <h2>{editExpense ? '✏️ Редактировать расход' : '➕ Добавить новый расход'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">📝 Название расхода *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Например: Продукты в магазине"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">💰 Сумма *</label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="currency">💱 Валюта</label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            <option value="RUB">🇷🇺 RUB</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">📅 Дата *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">🏷️ Категория</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editExpense ? '✏️ Обновить' : '✅ Добавить'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            ❌ Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;