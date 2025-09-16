import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';

const RegisterSuccess = () => {
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
          Регистрация успешна!
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 500, mb: 3 }}>
          Ваш аккаунт был успешно создан. Теперь вы можете войти в систему и начать использовать все возможности нашего сервиса.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'info.light', 
          p: 2, 
          borderRadius: 1,
          mb: 4,
          maxWidth: 500
        }}>
          <EmailIcon sx={{ fontSize: 40, color: 'info.dark', mr: 2 }} />
          <Typography variant="body2" color="info.dark">
            Мы отправили письмо с подтверждением на ваш email. Пожалуйста, проверьте вашу почту и подтвердите адрес электронной почты, чтобы активировать все функции аккаунта.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/login"
          >
            Войти в аккаунт
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            component={Link}
            to="/"
          >
            На главную
          </Button>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Что можно сделать дальше:
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} to="/feed" color="secondary">
              Просмотреть ленту желаний
            </Button>
            <Button component={Link} to="/wishlists" color="secondary">
              Создать свой вишлист
            </Button>
            <Button component={Link} to="/profile" color="secondary">
              Заполнить профиль
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterSuccess;