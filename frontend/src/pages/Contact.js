import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alertActions';
import PropTypes from 'prop-types';

const Contact = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { name, email, subject, message } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!name || !email || !subject || !message) {
      setAlert('Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert('Пожалуйста, введите корректный email', 'error');
      return;
    }
    
    setLoading(true);
    
    // Имитация отправки формы
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setAlert('Ваше сообщение успешно отправлено', 'success');
    }, 1500);
  };
  
  const handleCloseSuccess = () => {
    setSuccess(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Связаться с нами
      </Typography>
      
      <Grid container spacing={4}>
        {/* Контактная информация */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Контактная информация
            </Typography>
            <Typography variant="body1" paragraph>
              Если у вас возникли вопросы или предложения, вы можете связаться с нами любым удобным способом.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    support@wishflick.ru
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Телефон
                  </Typography>
                  <Typography variant="body1">
                    +7 (800) 123-45-67
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Адрес
                  </Typography>
                  <Typography variant="body1">
                    Россия, г. Москва, ул. Примерная, д. 123
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" gutterBottom>
              Часы работы
            </Typography>
            <Typography variant="body1">
              Понедельник - Пятница: 9:00 - 18:00
            </Typography>
            <Typography variant="body1">
              Суббота - Воскресенье: Выходной
            </Typography>
          </Paper>
        </Grid>
        
        {/* Форма обратной связи */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Форма обратной связи
            </Typography>
            <Typography variant="body1" paragraph>
              Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ваше имя"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Тема"
                    name="subject"
                    value={subject}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Сообщение"
                    name="message"
                    multiline
                    rows={4}
                    value={message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? 'Отправка...' : 'Отправить сообщение'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Карта (заглушка) */}
      <Paper sx={{ p: 2, mt: 4, bgcolor: '#f5f5f5', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Здесь будет карта с расположением офиса
        </Typography>
      </Paper>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Ваше сообщение успешно отправлено!
        </Alert>
      </Snackbar>
    </Container>
  );
};

Contact.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Contact);