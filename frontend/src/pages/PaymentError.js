import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorCode = queryParams.get('error_code');
  const errorMessage = queryParams.get('error_message') || 'Произошла ошибка при обработке платежа';
  
  const handleTryAgain = () => {
    navigate('/balance');
  };
  
  const handleGoToSupport = () => {
    navigate('/contact');
  };
  
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
          Ошибка платежа
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
          {errorMessage}
        </Typography>
        
        {errorCode && (
          <Typography variant="body2" color="text.secondary" paragraph>
            Код ошибки: {errorCode}
          </Typography>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleTryAgain}
          >
            Попробовать снова
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleGoToSupport}
          >
            Связаться с поддержкой
          </Button>
        </Box>
        
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Возможные причины ошибки:
          </Typography>
          
          <Typography variant="body2" component="ul" sx={{ textAlign: 'left', pl: 2 }}>
            <li>Недостаточно средств на карте</li>
            <li>Банк отклонил транзакцию</li>
            <li>Проблемы с платежной системой</li>
            <li>Превышен лимит транзакций</li>
            <li>Технические неполадки</li>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Если проблема повторяется, пожалуйста, свяжитесь с нашей службой поддержки.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentError;