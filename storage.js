export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('expenseTrackerState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state from localStorage:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('expenseTrackerState', serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage:', err);
  }
};

export const exportData = () => {
  const data = localStorage.getItem('expenseTrackerState');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem('expenseTrackerState', JSON.stringify(data));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
// Функция для принудительного сохранения
export const saveToLocalStorage = (expenses) => {
  try {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    console.log('Сохранено в localStorage:', expenses);
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage:', error);
    return false;
  }
};

// Функция для загрузки из localStorage
export const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('expenses');
    console.log('Загружено из localStorage:', saved);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Ошибка при загрузке из localStorage:', error);
    return [];
  }
};

// Функция для очистки всех данных (на всякий случай)
export const clearAllData = () => {
  if (window.confirm('Вы уверены, что хотите удалить все данные?')) {
    localStorage.removeItem('expenses');
    window.location.reload();
  }
};
