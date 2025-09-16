import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getBalance } from '../redux/actions/profileActions';
import { setAlert } from '../redux/actions/alertActions';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount');
  const paymentId = queryParams.get('payment_id');
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    // Имитация проверки статуса платежа
    const timer = setTimeout(() => {
      setLoading(false);
      // Обновляем баланс пользователя после успешного платежа
      dispatch(getBalance());
      dispatch(setAlert('Платеж успешно обработан', 'success'));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  const handleGoToBalance = () => {
    navigate('/balance');
  };
  
  const handleGoToWishlists = () => {
    navigate('/feed');
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
            Проверяем статус платежа
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Пожалуйста, подождите, мы обрабатываем вашу транзакцию...
          </Typography>
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
          Платеж успешно выполнен!
        </Typography>
        
        {amount && (
          <Typography variant="h5" color="primary" gutterBottom>
            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)}
          </Typography>
        )}
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
          Ваш платеж был успешно обработан. Средства были добавлены на ваш баланс и теперь доступны для использования.
        </Typography>
        
        {paymentId && (
          <Typography variant="body2" color="text.secondary" paragraph>
            Идентификатор платежа: {paymentId}
          </Typography>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleGoToBalance}
          >
            Перейти к балансу
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleGoToWishlists}
          >
            Просмотреть вишлисты
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;