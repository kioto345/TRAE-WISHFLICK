import axios from 'axios';

// Функция для установки токена авторизации в заголовки запросов
const setAuthToken = token => {
  if (token) {
    // Если токен есть, устанавливаем его в заголовок для всех запросов
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Если токена нет, удаляем заголовок
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;