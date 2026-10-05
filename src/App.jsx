import {Route,Routes,useLocation} from 'react-router-dom';import {useEffect} from 'react';
import Navbar from './components/Navbar.jsx';import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';import Shop from './pages/Shop.jsx';import ProductDetails from './pages/ProductDetails.jsx';import Cart from './pages/Cart.jsx';import Wishlist from './pages/Wishlist.jsx';import {About,Contact,Login,NotFound} from './pages/Info.jsx';
import Checkout,{OrderSuccess,PaymentFailed} from './pages/Checkout.jsx';import ErrorBoundary from './components/ErrorBoundary.jsx';import ProductListing from './components/ProductListing.jsx';
export default function App(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0)},[pathname]);
return <><Navbar/><main id="main" className="min-h-[70vh]"><ErrorBoundary key={pathname}><Routes>
<Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/>
<Route path="/clothing" element={<ProductListing key="clothing" title="Clothing" category="Clothing"/>}/>
<Route path="/self-grooming" element={<ProductListing key="grooming" title="Self Grooming" category="Self Grooming"/>}/>
<Route path="/search" element={<Shop search/>}/><Route path="/product/:productId" element={<ProductDetails/>}/>
<Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/>
<Route path="/checkout" element={<Checkout/>}/><Route path="/order-success" element={<OrderSuccess/>}/><Route path="/payment-failed" element={<PaymentFailed/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Login signup/>}/><Route path="*" element={<NotFound/>}/></Routes></ErrorBoundary></main><Footer/></>}
