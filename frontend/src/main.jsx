import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './store/store';
import { setStore } from './api/axios';
import './index.css';

// Set store reference for axios interceptors (avoids circular dependency)
setStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#1e1b4b', color: '#fff', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 32px rgba(99,102,241,0.15)' },
            success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
