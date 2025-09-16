import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  MonetizationOn as MonetizationOnIcon,
  CardGiftcard as CardGiftcardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getWishlists } from '../redux/actions/wishlistActions';
import { getReceivedDonations, getSentDonations, getBalance } from '../redux/actions/profileActions';

// Компонент для отображения табов с донатами
const DonationTabs = ({ receivedDonations, sentDonations }) => {
  const [tabValue, setTabValue] = useState(0);

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

  return (
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
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { wishlists, loading: wishlistsLoading } = useSelector(state => state.wishlist);
  const { receivedDonations, sentDonations, balance, loading: profileLoading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getWishlists());
    dispatch(getReceivedDonations());
    dispatch(getSentDonations());
    dispatch(getBalance());
  }, [dispatch]);

  const loading = wishlistsLoading || profileLoading;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Личный кабинет
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Добро пожаловать, {user?.username}!
          </Typography>
        </Grid>

        {/* Карточки с основной информацией */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Профиль
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {user?.bio || 'Расскажите о себе в профиле'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar src={user?.avatar} alt={user?.username} sx={{ width: 56, height: 56, mr: 2 }}>
                  {user?.username?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{user?.username}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/profile">
                Редактировать профиль
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CardGiftcardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Мои вишлисты
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                У вас {wishlists.length} {wishlists.length === 1 ? 'вишлист' : 
                  wishlists.length >= 2 && wishlists.length <= 4 ? 'вишлиста' : 'вишлистов'}
              </Typography>
              {wishlists.slice(0, 3).map(wishlist => (
                <Box key={wishlist._id} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component={RouterLink} to={`/wishlist/${wishlist._id}`} 
                    sx={{ textDecoration: 'none', color: 'primary.main' }}>
                    {wishlist.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {wishlist.items.length} {wishlist.items.length === 1 ? 'желание' : 
                      wishlist.items.length >= 2 && wishlist.items.length <= 4 ? 'желания' : 'желаний'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/wishlists/create"
                startIcon={<AddIcon />}
              >
                Создать вишлист
              </Button>
              {wishlists.length > 0 && (
                <Button size="small" component={RouterLink} to="/wishlists">
                  Все вишлисты
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
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
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/profile/balance">
                Управление балансом
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Секция с донатами */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              История донатов
            </Typography>
            <DonationTabs 
              receivedDonations={receivedDonations} 
              sentDonations={sentDonations} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;