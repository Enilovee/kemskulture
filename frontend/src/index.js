import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import {HelmetProvider} from 'react-helmet-async'
import { Provider } from 'react-redux';
import store from './store'
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style/bootstrap.custom.css';
import './assets/style/index.css';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute ';
import reportWebVitals from './reportWebVitals';


const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const ShippingScreen = lazy(() => import('./screens/ShippingScreen'));
const PaymentScreen = lazy(() => import('./screens/PaymentScreen'));
const PlaceOrdersScreen = lazy(() => import('./screens/PlaceOrdersScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const SizeDescScreen = lazy(() => import('./screens/SizeDescScreen'));
const BlogScreen = lazy(() => import('./screens/BlogScreen'));
const BlogDetailScreen = lazy(() => import('./screens/BlogDetailScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const OrderListScreen = lazy(() => import('./screens/admin/OrderListScreen'));
const ProductListScreen = lazy(() => import('./screens/admin/ProductListScreen'));
const ProductEditScreen = lazy(() => import('./screens/admin/ProductEditScreen'));
const UserListScreen = lazy(() => import('./screens/admin/UserListScreen'));
const UserEditScreen = lazy(() => import('./screens/admin/UserEditScreen'));
const BlogPostListScreen = lazy(() => import('./screens/admin/BlogPostListScreen'));
const BlogPostEditScreen = lazy(() => import('./screens/admin/BlogPostEditScreen'));
const HomePageScreen = lazy(() => import('./screens/HomePageScreen'));
const TermsScreen = lazy(() => import('./screens/TermsScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('./screens/ResetPasswordScreen'));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
       <Route index={true} path='/' element={<HomePageScreen />} />
      <Route  path='/products' element={<HomeScreen />} />
      <Route  path='/products/search/:keyword' element={<HomeScreen />} />
      <Route  path='/products/filter/:category' element={<HomeScreen />} />
      <Route  path='/products/filter/:category/:brand' element={<HomeScreen />} />
      <Route  path='/products/filter' element={<HomeScreen />} />
     
      <Route  path='/products/page/:pageNumber' element={<HomeScreen />} />     
      <Route  path='/products/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route  path='/products/filter/:category/page/:pageNumber' element={<HomeScreen />} />
      <Route  path='/products/filter/:category/:brand/page/:pageNumber' element={<HomeScreen />} />
   
      <Route  path='/product/:id' element={<ProductScreen />} />
      <Route  path='/blog-post/:id' element={<BlogDetailScreen />} />
      <Route  path='/cart' element={<CartScreen />} />
      <Route  path='/login' element={<LoginScreen />} />
      <Route  path='/terms&condition' element={<TermsScreen />} />
      <Route  path='/sizeDesc' element={<SizeDescScreen />} />
      <Route  path='/blog-posts' element={<BlogScreen />} />
      <Route  path='/register' element={<RegisterScreen />} />
      <Route  path='/forgot-password' element={<ForgotPasswordScreen />} />
      <Route  path='/reset-password/:token' element={<ResetPasswordScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route  path='/shipping' element={<ShippingScreen />} />
        <Route  path='/payment' element={<PaymentScreen />} />
        <Route  path='/placeorder' element={<PlaceOrdersScreen />} />
        <Route  path='/order/:id' element={<OrderScreen />} />
        <Route  path='/profile' element={<ProfileScreen />} />

      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route  path='/admin/orderlist' element={<OrderListScreen />} />
        <Route  path='/admin/productlist' element={<ProductListScreen />} />
        <Route  path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
        <Route  path='/admin/userlist' element={<UserListScreen />} />
        <Route  path='/admin/bloglist' element={<BlogPostListScreen />} />
        <Route  path='/admin/bloglist/:pageNumber' element={<BlogPostListScreen />} />
        <Route  path='/admin/blog-post/:id/edit' element={<BlogPostEditScreen />} />
        <Route  path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route  path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
    <Provider store={store}> 
    <PayPalScriptProvider deferLoading={true}>
    <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
    </Suspense>
    </PayPalScriptProvider>
    </Provider>
   </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
