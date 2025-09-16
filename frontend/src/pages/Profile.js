import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { 
  getCurrentProfile, 
  updateProfile, 
  getReceivedDonations, 
  getSentDonations, 
  getBalance 
} from '../redux/actions/profileActions';
import { setAlert } from '../redux/actions/alertActions';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, receivedDonations, sentDonations, balance, loading } = useSelector(state => state.profile);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  
  const [tabValue, setTabValue] = useState(0);
  
  // Загрузка данных профиля при монтировании
  useEffect(() => {
    dispatch(getCurrentProfile());
    dispatch(getReceivedDonations());
    dispatch(getSentDonations());
    dispatch(getBalance());
  }, [dispatch]);
  
  // Заполнение формы данными из профиля
  useEffect(() => {
    if (user && !loading) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, loading]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      dispatch(setAlert('Имя пользователя обязательно', 'error'));
      return;
    }
    
    dispatch(updateProfile(formData));
    dispatch(setAlert('Профиль успешно обновлен', 'success'));
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Получение статуса доната
  const getDonationStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Завершен" color="success" size="small" />;
      case 'pending':
        return <Chip label="В обработке" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Ошибка" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Профиль
      </Typography>
      
      <Grid container spacing={4}>
        {/* Форма профиля */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Личная информация
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={formData.avatar}
                    alt={formData.username}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  >
                    {formData.username ? formData.username.charAt(0).toUpperCase() : <PersonIcon />}
                  </Avatar>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="avatar"
                    label="URL аватара"
                    value={formData.avatar}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="username"
                    label="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    disabled
                    helperText="Email нельзя изменить"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="bio"
                    label="О себе"
                    value={formData.bio}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Сохранить изменения
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        
        {/* Баланс и финансы */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Баланс
                </Typography>
              </Box>
              <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                {balance?.amount || 0} {balance?.currency || 'RUB'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Всего получено донатов: {receivedDonations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего отправлено донатов: {sentDonations.length}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
              >
                Вывести средства
              </Button>
            </CardContent>
          </Card>
          
          {/* Статистика */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Статистика
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Дата регистрации" 
                  secondary={user?.createdAt ? formatDate(user.createdAt) : 'Нет данных'} 
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Количество вишлистов" 
                  secondary={profile?.wishlists?.length || 0} 
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Полученные донаты" 
                  secondary={`${receivedDonations.length} на сумму ${receivedDonations.reduce((sum, donation) => sum + donation.amount, 0)} RUB`} 
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText 
                  primary="Отправленные донаты" 
                  secondary={`${sentDonations.length} на сумму ${sentDonations.reduce((sum, donation) => sum + donation.amount, 0)} RUB`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* История донатов */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              История донатов
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="donation tabs">
                  <Tab label="Полученные донаты" />
                  <Tab label="Отправленные донаты" />
                </Tabs>
              </Box>
              <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 2 }}>
                {tabValue === 0 && (
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {receivedDonations.length > 0 ? (
                      receivedDonations.map((donation) => (
                        <React.Fragment key={donation._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar alt="Donor" src={donation.donor?.avatar || ''}>
                                {donation.isAnonymous ? '?' : donation.donor?.username?.charAt(0) || '?'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" component="span">
                                    {donation.isAnonymous ? 'Анонимный донат' : donation.donor?.username || 'Пользователь'}
                                  </Typography>
                                  <Typography variant="h6" color="primary" component="span">
                                    {donation.amount} {donation.currency}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'block' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {donation.wishlistItem?.name || 'Желание'}
                                  </Typography>
                                  {donation.message && (
                                    <Typography variant="body2" component="span">
                                      {donation.message}
                                    </Typography>
                                  )}
                                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(donation.createdAt)}
                                    </Typography>
                                    {getDonationStatusChip(donation.status)}
                                  </Box>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                          У вас пока нет полученных донатов
                        </Typography>
                      </Box>
                    )}
                  </List>
                )}
              </Box>
              <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 2 }}>
                {tabValue === 1 && (
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {sentDonations.length > 0 ? (
                      sentDonations.map((donation) => (
                        <React.Fragment key={donation._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar alt="Recipient" src={donation.recipient?.avatar || ''}>
                                {donation.recipient?.username?.charAt(0) || '?'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" component="span">
                                    {donation.recipient?.username || 'Пользователь'}
                                  </Typography>
                                  <Typography variant="h6" color="primary" component="span">
                                    {donation.amount} {donation.currency}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'block' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {donation.wishlistItem?.name || 'Желание'}
                                  </Typography>
                                  {donation.message && (
                                    <Typography variant="body2" component="span">
                                      {donation.message}
                                    </Typography>
                                  )}
                                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(donation.createdAt)}
                                    </Typography>
                                    {getDonationStatusChip(donation.status)}
                                  </Box>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                          Вы пока не отправляли донаты
                        </Typography>
                      </Box>
                    )}
                  </List>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;