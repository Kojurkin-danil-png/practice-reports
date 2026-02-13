import React, { useState } from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import ExpenseFilter from './ExpenseFilter';
import ExpenseForm from './ExpenseForm';

const ExpenseList = () => {
  const { state, dispatch } = useExpenseContext();
  const [editingExpense, setEditingExpense] = useState(null);

  // Функция для фильтрации расходов
  const getFilteredExpenses = () => {
    let filtered = [...state.expenses];
    const { searchQuery, category, startDate, endDate, sortBy, sortOrder } = state.filters;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по категории
    if (category) {
      filtered = filtered.filter(exp => exp.category === category);
    }

    // Фильтр по дате
    if (startDate) {
      filtered = filtered.filter(exp => exp.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(exp => exp.date <= endDate);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryLabels = {
    food: '🍔 Продукты',
    transport: '🚗 Транспорт',
    entertainment: '🎮 Развлечения',
    utilities: '💡 Коммунальные услуги',
    health: '🏥 Здоровье',
    education: '📚 Образование',
    other: '📦 Другое'
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2 className="expenses-title">📋 Список расходов</h2>
        <div className="total-amount">
          Всего: <strong>{totalAmount.toFixed(2)} ₽</strong>
        </div>
      </div>

      <ExpenseFilter />

      {editingExpense && (
        <ExpenseForm 
          editExpense={editingExpense} 
          onCancel={handleCancelEdit}
        />
      )}

      {filteredExpenses.length === 0 ? (
        <p className="text-center">📭 Расходов не найдено</p>
      ) : (
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Категория</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>
                  <strong>{expense.amount.toFixed(2)}</strong> {expense.currency}
                </td>
                <td>{new Date(expense.date).toLocaleDateString('ru-RU')}</td>
                <td>
                  <span className={`category-badge category-${expense.category}`}>
                    {categoryLabels[expense.category] || expense.category}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-btn edit"
                      onClick={() => handleEdit(expense)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => handleDelete(expense.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;