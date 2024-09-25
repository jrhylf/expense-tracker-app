import { Button, Input } from './Components';
import './App.css';
import React, { useState, useEffect } from 'react';
import CurrencyList from './CurrencyList';

function App() {
  const [currentDate, setCurrentDate] = useState('');

  // Currency Exchange
  // const [fromCurrency, setFromCurrency] = useState('');
  // Set new currency every currency is changed
  // const [toCurrency, setToCurrency] = useState('');

  // Search Currency
  const [searchQuery, setSearchQuery] = useState('');

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

  const [isOpen, setIsOpen] = useState(false); // State for dropdown open/close

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
      // Create a new expense object
      const newExpense = { name: expenseName, price: parseFloat(expensePrice) };
      
      // Update the state with the new expense added to the existing expenses
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
    
      // Clear the input fields after adding the expense
      setExpenseName('');
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

  const currencies = CurrencyList();

  // Find the selected currency object by code
  const selectedCurrency = currencies.find(curr => curr.code === currency);

  // console.log("From Currency: " + fromCurrency);
  // console.log("To Currency: " + toCurrency);

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
            
            {/* Custom Currency Selector */}
            <div className='relative'>
              <div 
                className='h-auto w-full p-2 border rounded-md cursor-pointer'
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
              >
                {selectedCurrency ? `${selectedCurrency.code} - ${selectedCurrency.name}` : currency}
              </div>

              {isOpen && (
                <div className='absolute z-10 w-full bg-white border rounded-md shadow-lg'>
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                    className='w-full p-2 border-b'
                  />

                  {/* Currency List */}
                  <ul className='max-h-60 overflow-y-auto'>
                    {currencies
                      .filter(curr => 
                        curr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        curr.code.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((curr) => (
                        <li 
                          key={curr.code} 
                          onClick={() => {
                            setCurrency(curr.code); // Update the currency state
                            // setFromCurrency(currency); // Previous currency state
                            // setToCurrency(curr.code); // Update the toCurrency state
                            setIsOpen(false); // Close dropdown after selection
                            setSearchQuery(''); // Clear search query
                          }}
                          className='p-2 hover:bg-gray-200 cursor-pointer'
                        >
                          {curr.code} - {curr.name}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
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

      <footer className='h-14 w-full p-4 flex content-center justify-center text-center'>
        <span className='h-auto w-max text-base font-normal'>
          Developed by John Rhyl Fernandez
        </span>
      </footer>
    </div>
  );
}

export default App;
