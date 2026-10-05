import React from 'react';import ReactDOM from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';import {CartProvider} from './context/CartContext.jsx';import {ProductsProvider} from './context/ProductsContext.jsx';import {WishlistProvider} from './context/WishlistContext.jsx';import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><ProductsProvider><CartProvider><WishlistProvider><App/></WishlistProvider></CartProvider></ProductsProvider></BrowserRouter>);
