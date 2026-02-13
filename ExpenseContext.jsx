import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  filters: {
    category: '',
    startDate: null,
    endDate: null,
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc'
  }
};

const expenseReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_EXPENSE':
      newState = {
        ...state,
        expenses: [action.payload, ...state.expenses]
      };
      break;
      
    case 'UPDATE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
      break;
      
    case 'DELETE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
      break;
      
    case 'SET_FILTERS':
      newState = {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
      break;
      
    case 'LOAD_EXPENSES':
      newState = {
        ...state,
        expenses: action.payload
      };
      break;
      
    default:
      return state;
  }
  
  // Сохраняем в localStorage после каждого изменения
  if (newState && action.type !== 'SET_FILTERS' && action.type !== 'LOAD_EXPENSES') {
    localStorage.setItem('expenses', JSON.stringify(newState.expenses));
  }
  
  return newState;
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Загрузка из localStorage при инициализации
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    console.log('Загружаем из localStorage:', savedExpenses); // Для отладки
    
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        console.log('Распарсенные данные:', parsed); // Для отладки
        dispatch({ type: 'LOAD_EXPENSES', payload: parsed });
      } catch (error) {
        console.error('Ошибка при загрузке из localStorage:', error);
      }
    }
  }, []);

  // Для отладки - следим за изменениями
  useEffect(() => {
    console.log('Текущие расходы:', state.expenses);
  }, [state.expenses]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};