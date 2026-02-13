import React, { useState } from 'react';
import './App.css';
import { ExpenseProvider, useExpenseContext } from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Statistics from './components/Statistics';
import { clearAllData } from './utils/storage';

// Компонент для отладки
const DebugButtons = () => {
  const { state } = useExpenseContext();
  
  return (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <button 
        className="btn btn-secondary"
        onClick={() => {
          console.log('Текущие расходы:', state.expenses);
          console.log('localStorage:', localStorage.getItem('expenses'));
          alert('Данные сохранены! Смотрите консоль (F12)');
        }}
      >
        🔍 Проверить данные
      </button>
      <button 
        className="btn btn-danger"
        onClick={clearAllData}
      >
        🗑️ Очистить все данные
      </button>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <ExpenseProvider>
      <div className="App">
        <div className="app-container">
          <header className="header">
            <h1>💰 Приложение для учета расходов</h1>
            <p>Контролируйте свои финансы легко и удобно</p>
          </header>

          <DebugButtons />

          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              ➕ Добавить расход
            </button>
            <button 
              className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              📋 Список расходов
            </button>
            <button 
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Статистика
            </button>
          </div>

          {activeTab === 'form' && <ExpenseForm />}
          {activeTab === 'list' && <ExpenseList />}
          {activeTab === 'stats' && <Statistics />}
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;