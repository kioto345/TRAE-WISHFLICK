import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
// Предполагаем, что у нас есть соответствующее действие в authActions
// import { deleteAccount } from '../redux/actions/authActions';

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
  };
  
  const handleConfirmCheckChange = (e) => {
    setConfirmChecked(e.target.checked);
  };
  
  const handleCancel = () => {
    navigate('/profile');
  };
  
  const handleDeleteAccount = () => {
    // Проверка подтверждения
    if (confirmText !== 'УДАЛИТЬ') {
      setError('Пожалуйста, введите УДАЛИТЬ для подтверждения');
      return;
    }
    
    if (!confirmChecked) {
      setError('Пожалуйста, подтвердите, что вы понимаете последствия');
      return;
    }
    
    if (!password) {
      setError('Пожалуйста, введите ваш пароль');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Имитация запроса на удаление аккаунта
    // В реальном приложении здесь будет вызов API
    setTimeout(() => {
      // dispatch(deleteAccount(password))
      //   .then(() => {
      //     navigate('/');
      //   })
      //   .catch(err => {
      //     setError(err.message || 'Ошибка при удалении аккаунта');
      //     setLoading(false);
      //   });
      
      // Временная имитация успешного удаления
      navigate('/');
    }, 2000);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarningIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
          <Typography variant="h4" component="h1" color="error">
            Удаление аккаунта
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph align="center" sx={{ maxWidth: 600, mb: 4 }}>
          Вы собираетесь удалить свой аккаунт. Это действие необратимо и приведет к потере всех ваших данных, включая вишлисты, историю донатов и баланс.
        </Typography>
        
        <Box 
          sx={{ 
            bgcolor: 'error.light', 
            color: 'error.contrastText', 
            p: 3, 
            borderRadius: 1,
            width: '100%',
            mb: 4
          }}
        >
          <Typography variant="h6" gutterBottom>
            Последствия удаления аккаунта:
          </Typography>
          
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>Все ваши вишлисты будут удалены</li>
            <li>История донатов будет удалена</li>
            <li>Ваш баланс будет аннулирован без возможности вывода средств</li>
            <li>Ваш профиль и личные данные будут удалены</li>
            <li>Вы не сможете восстановить аккаунт после удаления</li>
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Для подтверждения удаления, пожалуйста, введите ваш пароль:
          </Typography>
          
          <TextField
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Ваш текущий пароль"
            value={password}
            onChange={handlePasswordChange}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="body1" gutterBottom>
            Введите УДАЛИТЬ для подтверждения:
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="УДАЛИТЬ"
            value={confirmText}
            onChange={handleConfirmTextChange}
            sx={{ mb: 3 }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={confirmChecked} 
                onChange={handleConfirmCheckChange} 
                color="error"
              />
            }
            label="Я понимаю, что это действие необратимо и все мои данные будут удалены"
          />
        </Box>
        
        <Divider sx={{ width: '100%', mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleCancel}
            disabled={loading}
          >
            Отмена
          </Button>
          
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={handleDeleteAccount}
            disabled={loading || !password || confirmText !== 'УДАЛИТЬ' || !confirmChecked}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Удалить аккаунт'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeleteAccount;