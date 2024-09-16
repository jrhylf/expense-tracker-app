import { Button, Input } from './Components';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [currentDate, setCurrentDate] = useState('');
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [expenseName, setExpenseName] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  
  // Error states for validation
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  // Currency state and localStorage
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency ? savedCurrency : 'PHP';
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  // Handle input changes
  const handleExpenseNameChange = (e) => {
    setExpenseName(e.target.value);
    if (e.target.value) {
      setNameError('');
    }
  };

  const handleExpensePriceChange = (e) => {
    setExpensePrice(e.target.value);
    if (e.target.value) {
      setPriceError('');
    }
  };

  // Add Expense with validation
  const handleAddExpense = () => {
    let valid = true;

    if (!expenseName) {
      setNameError('Please input expense name');
      valid = false;
    }

    if (!expensePrice) {
      setPriceError('Please input expense price');
      valid = false;
    }

    if (valid) {
      const newExpense = { name: expenseName, price: parseFloat(expensePrice) };
      setExpenses([...expenses, newExpense]);
      setExpenseName('');  // Clear the input fields after adding
      setExpensePrice('');
    }
  };

  // Delete Expense
  const handleDeleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  // Calculate Total
  const totalExpenses = expenses.reduce((total, expense) => total + expense.price, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="h-screen min-w-min">
      <header className="h-20 w-full p-4 bg-blue-950 flex flex-wrap content-center justify-evenly text-white">
        <div><span className='h-auto w-max text-2xl align-middle'>Expense Tracker</span></div>
        <div><span className='h-auto w-max text-lg align-middle'>Today's Date: {currentDate}</span></div>
      </header>

      <main className='h-auto w-full max-w-screen-md my-0 mx-auto p-4 flex flex-wrap content-center justify-center'>
        <div className='h-auto w-full my-0 mx-auto p-4 bg-white shadow-md rounded-xl'>
          <span className='h-auto w-max text-xl align-middle'>Add New Expense</span>
          <div className='h-auto w-full flex flex-col md:flex-row mb-8 gap-2'>
            {/* Expense Name Input */}
            <Input 
              type='text'
              placeholder='Expense name'
              value={expenseName}
              onChange={handleExpenseNameChange}
              error={nameError}
            />

            {/* Expense Price Input */}
            <Input 
              type='number'
              placeholder='Price'
              value={expensePrice}
              onChange={handleExpensePriceChange}
              error={priceError}
            />

            <Button 
              text={'Add'}
              onClick={handleAddExpense}
              className={'h-max w-full min-w-16 my-1 py-1 border-2 rounded-md border-blue-950 bg-blue-950 text-white hover:bg-blue-900 active:bg-blue-800'}
            />
          </div>

          {/* Currency Selector */}
          <div className='h-auto w-full mb-4'>
            <label htmlFor="currency" className='mr-2'>Currency:</label>
            <select 
              id="currency" 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className='h-auto w-full p-2 border rounded-md'>
              <option value="PHP">PHP - Philippine Peso</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>

          <span className='h-auto w-max text-xl align-middle'>Expenses</span>
          <div className='h-auto w-full p-4 border border-gray-300 rounded-md flex flex-col'>
            {expenses.length === 0 ? (
              <span className='h-auto w-full text-center text-gray-500'>No expenses added yet.</span>
            ) : (
              expenses.map((expense, index) => (
                <div key={index} className='h-auto w-full flex flex-row content-center justify-between gap-5'>
                  <div className='h-auto w-full m-auto flex justify-between'>
                    <span className='h-auto w-max align-middle'>{expense.name}</span>
                    <span className='h-auto w-max align-middle'>{formatCurrency(expense.price)}</span>
                  </div>
                  <Button 
                    text={'Delete'}
                    onClick={() => handleDeleteExpense(index)}
                    className={'h-max w-full max-w-24 ml-0 mr-1 my-1 p-1 border-none rounded-md bg-red-700 text-white hover:bg-red-600 active:bg-red-500'}
                  />
                </div>
              ))
            )}
          </div>

          <div className='h-auto w-full mt-3 p-4 border border-gray-300 rounded-md flex flex-row justify-between'>
              <span className='h-auto w-max align-middle text-2xl font-bold'>TOTAL:</span>
              <span className='h-auto w-max align-middle text-2xl font-bold'>{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
