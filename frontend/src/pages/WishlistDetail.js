import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  Avatar,
  IconButton,
  Link,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MonetizationOn as MonetizationOnIcon,
  OpenInNew as OpenInNewIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getWishlist, clearWishlist } from '../redux/actions/wishlistActions';
import { createDonation } from '../redux/actions/donationActions';
import { setAlert } from '../redux/actions/alertActions';

const WishlistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector(state => state.wishlist);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  useEffect(() => {
    dispatch(getWishlist(id));
    
    // Очистка при размонтировании
    return () => {
      dispatch(clearWishlist());
    };
  }, [dispatch, id]);

  // Проверка, является ли текущий пользователь владельцем вишлиста
  const isOwner = isAuthenticated && user && wishlist && wishlist.user && user._id === wishlist.user._id;

  // Обработчики для диалога доната
  const handleDonationDialogOpen = (item) => {
    if (!isAuthenticated) {
      dispatch(setAlert('Для доната необходимо авторизоваться', 'info'));
      return;
    }
    
    if (isOwner) {
      dispatch(setAlert('Вы не можете донатить на собственный вишлист', 'info'));
      return;
    }
    
    setSelectedItem(item);
    setDonationAmount(item.price || '');
    setDonationDialogOpen(true);
  };

  const handleDonationDialogClose = () => {
    setDonationDialogOpen(false);
    setSelectedItem(null);
    setDonationAmount('');
    setDonationMessage('');
    setIsAnonymous(false);
  };

  const handleDonationSubmit = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      dispatch(setAlert('Введите корректную сумму доната', 'error'));
      return;
    }
    
    const donationData = {
      wishlistId: wishlist._id,
      wishlistItemId: selectedItem._id,
      amount: parseFloat(donationAmount),
      currency: selectedItem.currency || 'RUB',
      message: donationMessage,
      isAnonymous
    };
    
    dispatch(createDonation(donationData));
    handleDonationDialogClose();
  };

  // Функция для копирования ссылки на вишлист
  const handleShareWishlist = () => {
    const wishlistUrl = window.location.href;
    navigator.clipboard.writeText(wishlistUrl)
      .then(() => {
        dispatch(setAlert('Ссылка скопирована в буфер обмена', 'success'));
      })
      .catch(err => {
        dispatch(setAlert('Не удалось скопировать ссылку', 'error'));
      });
  };

  // Форматирование цены
  const formatPrice = (price, currency) => {
    if (!price) return 'Цена не указана';
    return `${price} ${currency || 'RUB'}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!wishlist) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Вишлист не найден или у вас нет доступа к нему.
        </Alert>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to={isOwner ? '/wishlists' : '/'}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        {isOwner ? 'К моим вишлистам' : 'Назад'}
      </Button>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {wishlist.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={wishlist.user?.avatar} 
                alt={wishlist.user?.username}
                sx={{ mr: 1 }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="subtitle1">
                {wishlist.user?.username || 'Пользователь'}
              </Typography>
              {wishlist.category && (
                <Chip 
                  label={wishlist.category} 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
              {wishlist.isPrivate && (
                <Chip 
                  label="Приватный" 
                  size="small" 
                  color="default" 
                  sx={{ ml: 1 }} 
                />
              )}
            </Box>
          </Box>
          <Box>
            <Tooltip title="Поделиться">
              <IconButton onClick={handleShareWishlist}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            {isOwner && (
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to={`/wishlists/edit/${wishlist._id}`}
                sx={{ ml: 1 }}
              >
                Редактировать
              </Button>
            )}
          </Box>
        </Box>

        {wishlist.description && (
          <Typography variant="body1" paragraph>
            {wishlist.description}
          </Typography>
        )}
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Желания ({wishlist.items.length})
      </Typography>

      {wishlist.items.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          В этом вишлисте пока нет желаний.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {wishlist.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description}
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(item.price, item.currency)}
                  </Typography>
                  {item.url && (
                    <Link 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                    >
                      Ссылка на товар
                      <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Link>
                  )}
                  <Box sx={{ mt: 'auto' }}>
                    {!isOwner && (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<MonetizationOnIcon />}
                        onClick={() => handleDonationDialogOpen(item)}
                      >
                        Донат
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог доната */}
      <Dialog open={donationDialogOpen} onClose={handleDonationDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Донат на желание</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedItem.name}
                </Typography>
                {selectedItem.price && (
                  <Typography variant="body2" color="text.secondary">
                    Рекомендуемая сумма: {formatPrice(selectedItem.price, selectedItem.currency)}
                  </Typography>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Сумма доната"
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: selectedItem.currency || 'RUB',
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Сообщение (необязательно)"
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Анонимный донат"
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDonationDialogClose}>Отмена</Button>
          <Button onClick={handleDonationSubmit} color="primary" variant="contained">
            Отправить донат
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WishlistDetail;