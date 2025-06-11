import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from "./app/store/redux.ts";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root

  root.render(
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>
  );
} else {
  console.error("Root element not found. Ensure there is a div with id 'root' in your HTML.");
}

