// src/index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Session from './Account/Session';
import store from './redux/store';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Session>
        <App />
      </Session>
    </Provider>
  </StrictMode>
);
