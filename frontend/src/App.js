import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './redux/store';

// Компоненты
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Страницы
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Wishlists from './pages/Wishlists';
import WishlistDetail from './pages/WishlistDetail';
import CreateWishlist from './pages/CreateWishlist';
import EditWishlist from './pages/EditWishlist';
import Donate from './pages/Donate';
import Feed from './pages/Feed';
import BloggerDashboard from './pages/blogger/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Маршруты с ограниченным доступом
import PrivateRoute from './components/routing/PrivateRoute';
import BloggerRoute from './components/routing/BloggerRoute';
import AdminRoute from './components/routing/AdminRoute';

// Создание темы
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#00c853',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Маршруты для авторизованных пользователей */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/wishlists/create" element={
                <PrivateRoute>
                  <CreateWishlist />
                </PrivateRoute>
              } />
              <Route path="/wishlists/edit/:id" element={
                <PrivateRoute>
                  <EditWishlist />
                </PrivateRoute>
              } />
              
              {/* Публичные маршруты */}
              <Route path="/wishlists" element={<Wishlists />} />
              <Route path="/wishlist/:id" element={<WishlistDetail />} />
              <Route path="/donate/:wishlistId/:itemId" element={<Donate />} />
              <Route path="/feed/:type" element={<Feed />} />
              
              {/* Маршруты для блогеров */}
              <Route path="/blogger/dashboard" element={
                <BloggerRoute>
                  <BloggerDashboard />
                </BloggerRoute>
              } />
              
              {/* Маршруты для администраторов */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;