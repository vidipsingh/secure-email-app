import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailItem from './EmailItem';
import SearchBar from './SearchBar';

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/emails`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmails(response.data);
        setFilteredEmails(response.data);
      } catch (error) {
        console.error(error);
        navigate('/');
      } finally {
        setLoading(false); // Set loading to false when done (success or error)
      }
    };
    fetchEmails();
  }, [navigate]);

  const handleSearch = (query) => {
    const filtered = emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(query.toLowerCase()) ||
        email.sender.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmails(filtered);
  };

  const handleFilter = (filter) => {
    if (filter === 'with-attachments') {
      setFilteredEmails(emails.filter((email) => email.attachments.length > 0));
    } else {
      setFilteredEmails(emails);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent dark:border-blue-400"></div>
          <p className="mt-4 text-lg text-gray-900 dark:text-gray-100">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-6">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-md"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Email Documents</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        <div className="space-y-4">
          {filteredEmails.map((email, index) => (
            <EmailItem key={index} email={email} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmailList;