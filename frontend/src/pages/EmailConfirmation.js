import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { setAlert } from '../redux/actions/alertActions';
// Предполагаем, что у нас есть соответствующее действие в authActions
// import { verifyEmail } from '../redux/actions/authActions';

const EmailConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Токен подтверждения отсутствует');
      return;
    }
    
    // Имитация запроса на подтверждение email
    // В реальном приложении здесь будет вызов API
    const timer = setTimeout(() => {
      // dispatch(verifyEmail(token))
      //   .then(() => {
      //     setVerified(true);
      //     setLoading(false);
      //     dispatch(setAlert('Email успешно подтвержден', 'success'));
      //   })
      //   .catch(err => {
      //     setError(err.message || 'Ошибка при подтверждении email');
      //     setLoading(false);
      //   });
      
      // Временная имитация успешной верификации
      setVerified(true);
      setLoading(false);
      dispatch(setAlert('Email успешно подтвержден', 'success'));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [token, dispatch]);
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleResendVerification = () => {
    setLoading(true);
    
    // Имитация запроса на повторную отправку письма
    setTimeout(() => {
      setLoading(false);
      dispatch(setAlert('Письмо с подтверждением отправлено повторно', 'success'));
    }, 1500);
  };
  
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Проверка подтверждения
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Пожалуйста, подождите, мы проверяем ваш токен подтверждения...
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Ошибка подтверждения
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 4 }}>
            {error}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Отправить повторно'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to="/contact"
            >
              Связаться с поддержкой
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Email подтвержден!
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 4 }}>
          Ваш адрес электронной почты был успешно подтвержден. Теперь вы можете использовать все функции нашего сервиса.
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleGoToDashboard}
          >
            Перейти в личный кабинет
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleGoToLogin}
          >
            Войти в аккаунт
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmailConfirmation;