import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { createDonation } from '../redux/actions/donationActions';
import { setAlert } from '../redux/actions/alertActions';
import { getWishlistById } from '../redux/actions/wishlistActions';

const Donate = () => {
  const { wishlistId, itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { wishlist, loading: wishlistLoading } = useSelector(state => state.wishlist);
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    isAnonymous: false
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const { amount, message, isAnonymous } = formData;
  
  useEffect(() => {
    if (wishlistId) {
      dispatch(getWishlistById(wishlistId));
    }
  }, [dispatch, wishlistId]);
  
  useEffect(() => {
    if (wishlist && wishlist.items && itemId) {
      const item = wishlist.items.find(item => item._id === itemId);
      if (item) {
        setSelectedItem(item);
      } else {
        dispatch(setAlert('Желаемый предмет не найден', 'error'));
        navigate(`/wishlist/${wishlistId}`);
      }
    }
  }, [wishlist, itemId, navigate, dispatch, wishlistId]);
  
  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      dispatch(setAlert('Введите корректную сумму доната', 'error'));
      return;
    }
    
    setPaymentProcessing(true);
    
    const donationData = {
      recipient: wishlist.user._id,
      wishlistItem: itemId,
      amount: parseFloat(amount),
      currency: selectedItem.currency || 'RUB',
      message,
      isAnonymous
    };
    
    // Здесь можно добавить интеграцию с платежной системой
    // Например, Stripe, PayPal и т.д.
    
    // После успешной обработки платежа:
    setTimeout(() => {
      dispatch(createDonation(donationData, navigate));
      setPaymentProcessing(false);
    }, 1500); // Имитация обработки платежа
  };
  
  if (wishlistLoading || !wishlist || !selectedItem) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  const remainingAmount = selectedItem.price - selectedItem.currentAmount;
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Поддержать желание
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={selectedItem.image || 'https://via.placeholder.com/300x200?text=Нет+изображения'}
              alt={selectedItem.name}
            />
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedItem.description || 'Без описания'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Стоимость: {selectedItem.price} {selectedItem.currency || 'RUB'}
                </Typography>
                <Typography variant="body1">
                  Собрано: {selectedItem.currentAmount} {selectedItem.currency || 'RUB'}
                </Typography>
                <Typography variant="body1">
                  Осталось собрать: {remainingAmount} {selectedItem.currency || 'RUB'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Автор вишлиста: {wishlist.user.username}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Отправить донат
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Сумма доната"
                name="amount"
                type="number"
                value={amount}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 1 }}
                helperText={`Минимальная сумма: 1 ${selectedItem.currency || 'RUB'}`}
              />
              
              <TextField
                fullWidth
                label="Сообщение (необязательно)"
                name="message"
                value={message}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                inputProps={{ maxLength: 200 }}
                helperText={`${message.length}/200 символов`}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="isAnonymous"
                    checked={isAnonymous}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Отправить анонимно"
                sx={{ mt: 2 }}
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 2 }}>
                <Alert severity="info">
                  Нажимая кнопку "Отправить", вы соглашаетесь с условиями сервиса и политикой конфиденциальности.
                </Alert>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/wishlist/${wishlistId}`)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Обработка...
                    </>
                  ) : (
                    'Отправить'
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Donate;