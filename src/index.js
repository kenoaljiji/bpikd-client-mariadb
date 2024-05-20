import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import { RouteProvider } from './context/route/RouteProvider';
import { GlobalState } from './context/bpikd/GlobalState';
import { FooterProvaider } from './context/footer/FooterProvider';
import { SortedItemsProvider } from './context/sortedItems/SortedItemsProvider';
import { ThemeProvider } from './context/theme/ThemeContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AlertState>
      <AuthState>
        <ThemeProvider>
          <GlobalState>
            <RouteProvider>
              <FooterProvaider>
                <SortedItemsProvider>
                  <App />
                </SortedItemsProvider>
              </FooterProvaider>
            </RouteProvider>
          </GlobalState>
        </ThemeProvider>
      </AuthState>
    </AlertState>
  </BrowserRouter>
);
