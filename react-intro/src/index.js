
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {toast, ToastContainer} from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> 
   <ThemeProvider> 
    <App />
    <ToastContainer position="bottom-left" autoClose={2000}></ToastContainer>
    </ThemeProvider>
</Provider>
);

reportWebVitals();
