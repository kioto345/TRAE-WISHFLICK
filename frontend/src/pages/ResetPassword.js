import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { setAlert } from '../redux/actions/alertActions';
// Предполагаем, что у нас есть соответствующее действие в authActions
// import { resetPassword } from '../redux/actions/authActions';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { password, password2 } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  
  const validateForm = () => {
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return false;
    }
    
    if (password !== password2) {
      setError('Пароли не совпадают');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    // Имитация запроса на сброс пароля
    // В реальном приложении здесь будет вызов API
    setTimeout(() => {
      // dispatch(resetPassword(token, password))
      //   .then(() => {
      //     setSuccess(true);
      //     dispatch(setAlert('Пароль успешно изменен', 'success'));
      //   })
      //   .catch(err => {
      //     setError(err.message || 'Ошибка при сбросе пароля');
      //     setLoading(false);
      //   });
      
      // Временная имитация успешного сброса пароля
      setSuccess(true);
      dispatch(setAlert('Пароль успешно изменен', 'success'));
    }, 1500);
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  if (success) {
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
          <LockResetIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Пароль изменен!
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 4 }}>
            Ваш пароль был успешно изменен. Теперь вы можете войти в свой аккаунт, используя новый пароль.
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleGoToLogin}
          >
            Войти в аккаунт
          </Button>
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
        <LockResetIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Сброс пароля
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 3, textAlign: 'center' }}>
          Пожалуйста, введите новый пароль для вашего аккаунта.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {!token && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            Отсутствует токен сброса пароля. Пожалуйста, убедитесь, что вы перешли по корректной ссылке из письма.
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Новый пароль"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handleChange}
            disabled={loading || !token}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Подтвердите пароль"
            type={showPassword2 ? 'text' : 'password'}
            id="password2"
            value={password2}
            onChange={handleChange}
            disabled={loading || !token}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword2}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !token || !password || !password2}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Изменить пароль'}
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

export default ResetPassword;