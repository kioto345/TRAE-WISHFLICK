import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import { setAlert } from '../redux/actions/alertActions';
// Предполагаем, что у нас есть соответствующее действие в authActions
// import { forgotPassword } from '../redux/actions/authActions';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Имитация запроса на восстановление пароля
    // В реальном приложении здесь будет вызов API
    setTimeout(() => {
      // dispatch(forgotPassword(email))
      //   .then(() => {
      //     setEmailSent(true);
      //     dispatch(setAlert('Инструкции по сбросу пароля отправлены на ваш email', 'success'));
      //   })
      //   .catch(err => {
      //     setError(err.message || 'Ошибка при отправке инструкций');
      //     setLoading(false);
      //   });
      
      // Временная имитация успешной отправки
      setEmailSent(true);
      dispatch(setAlert('Инструкции по сбросу пароля отправлены на ваш email', 'success'));
    }, 1500);
  };
  
  const handleResend = () => {
    setLoading(true);
    
    // Имитация повторной отправки
    setTimeout(() => {
      setLoading(false);
      dispatch(setAlert('Инструкции по сбросу пароля отправлены повторно', 'success'));
    }, 1500);
  };
  
  if (emailSent) {
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
          <EmailIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Проверьте ваш email
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 2 }}>
            Мы отправили инструкции по сбросу пароля на адрес:
          </Typography>
          
          <Typography variant="h6" color="primary" paragraph sx={{ mb: 4 }}>
            {email}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 4 }}>
            Пожалуйста, проверьте вашу электронную почту и следуйте инструкциям в письме для сброса пароля. Если вы не получили письмо, проверьте папку "Спам" или нажмите кнопку ниже для повторной отправки.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Отправить повторно'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to="/login"
            >
              Вернуться к входу
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
          alignItems: 'center'
        }}
      >
        <LockOpenIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Восстановление пароля
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 3, textAlign: 'center' }}>
          Введите ваш email, и мы отправим вам инструкции по сбросу пароля.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !email}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Отправить инструкции'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Вспомнили пароль?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Войти
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;