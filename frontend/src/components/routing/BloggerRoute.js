import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

// Компонент для защищенных маршрутов, доступных только пользователям с ролью блогера
const BloggerRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если пользователь авторизован, но не имеет роли блогера, перенаправляем на главную страницу
  if (user && user.role !== 'blogger') {
    return <Navigate to="/" />;
  }

  // Если пользователь авторизован и имеет роль блогера, показываем запрашиваемый компонент
  return children;
};

export default BloggerRoute;