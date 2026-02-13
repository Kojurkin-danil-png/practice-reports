import React from 'react';
import { useExpenseContext } from '../context/ExpenseContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Statistics = () => {
  const { state } = useExpenseContext();
  const { expenses } = state;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  const categoryLabels = {
    food: '🍔 Продукты',
    transport: '🚗 Транспорт',
    entertainment: '🎮 Развлечения',
    utilities: '💡 Коммунальные услуги',
    health: '🏥 Здоровье',
    education: '📚 Образование',
    other: '📦 Другое'
  };

  // Данные по категориям для круговой диаграммы
  const getCategoryData = () => {
    const categoryMap = {};
    expenses.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0;
      }
      categoryMap[expense.category] += expense.amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name: categoryLabels[name] || name,
      value: Number(value.toFixed(2))
    }));
  };

  // Данные по месяцам для сравнения
  const getMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const monthlyData = [];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    for (let i = 0; i < 12; i++) {
      const currentYearTotal = expenses
        .filter(exp => {
          const date = new Date(exp.date);
          return date.getFullYear() === currentYear && date.getMonth() === i;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      const lastYearTotal = expenses
        .filter(exp => {
          const date = new Date(exp.date);
          return date.getFullYear() === lastYear && date.getMonth() === i;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      monthlyData.push({
        name: months[i],
        'Текущий год': Number(currentYearTotal.toFixed(2)),
        'Прошлый год': Number(lastYearTotal.toFixed(2))
      });
    }

    return monthlyData;
  };

  // Тренд расходов по дням (последние 30 дней)
  const getDailyTrend = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyTotal = expenses
        .filter(exp => exp.date === dateStr)
        .reduce((sum, exp) => sum + exp.amount, 0);

      last30Days.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        сумма: Number(dailyTotal.toFixed(2))
      });
    }

    return last30Days;
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const dailyData = getDailyTrend();

  // Общая статистика
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const maxExpense = expenses.length > 0 
    ? Math.max(...expenses.map(exp => exp.amount)) 
    : 0;
  const thisMonth = expenses
    .filter(exp => {
      const date = new Date(exp.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="statistics-container">
      <h2>📊 Анализ расходов</h2>

      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">💰 Всего расходов</span>
          <span className="stat-value">{totalExpenses.toFixed(2)} ₽</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">📊 Средний чек</span>
          <span className="stat-value">{averageExpense.toFixed(2)} ₽</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">📈 Макс. расход</span>
          <span className="stat-value">{maxExpense.toFixed(2)} ₽</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">📅 За этот месяц</span>
          <span className="stat-value">{thisMonth.toFixed(2)} ₽</span>
        </div>
      </div>

      {expenses.length > 0 ? (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>📅 Сравнение по месяцам</h3>
              <BarChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Текущий год" fill="#8884d8" />
                <Bar dataKey="Прошлый год" fill="#82ca9d" />
              </BarChart>
            </div>

            <div className="chart-card">
              <h3>🥧 Распределение по категориям</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={categoryData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="chart-card" style={{ gridColumn: 'span 2' }}>
              <h3>📈 Тренд расходов (последние 30 дней)</h3>
              <LineChart width={900} height={300} data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="сумма" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">📭 Добавьте расходы, чтобы увидеть статистику</p>
      )}
    </div>
  );
};

export default Statistics;