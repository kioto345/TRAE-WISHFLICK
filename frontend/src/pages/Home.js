import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popularRes, newRes] = await Promise.all([
          axios.get('/api/feed/popular?limit=6'),
          axios.get('/api/feed/new?limit=6')
        ]);
        
        setPopularItems(popularRes.data);
        setNewItems(newRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency || 'RUB'
    }).format(price);
  };

  const renderWishItem = (item) => (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.image || 'https://via.placeholder.com/200'}
          alt={item.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description?.substring(0, 100)}...
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {formatPrice(item.price, item.currency)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Собрано: {formatPrice(item.currentAmount, item.currency)}
            </Typography>
          </Box>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgressWithLabel value={(item.currentAmount / item.price) * 100} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" variant="outlined" href={`/wishlist/${item.wishlistId}`}>
              Вишлист
            </Button>
            <Button size="small" variant="contained" color="primary" href={`/donate/${item.wishlistId}/${item._id}`}>
              Поддержать
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  // Компонент для отображения прогресс-бара с процентом
  const LinearProgressWithLabel = (props) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <div
            style={{
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#e0e0e0',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '4px',
                backgroundColor: '#2196f3',
                width: `${Math.min(props.value, 100)}%`,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      {/* Hero section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="inherit"
            gutterBottom
          >
            WishFlick
          </Typography>
          <Typography variant="h5" align="center" color="inherit" paragraph>
            Создавайте вишлисты, делитесь желаниями и получайте поддержку от своих подписчиков.
            Простой способ для блогеров и стримеров монетизировать свою аудиторию.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="secondary" href="/register">
              Создать аккаунт
            </Button>
            <Button variant="outlined" color="inherit" href="/wishlists">
              Смотреть вишлисты
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Popular items section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Популярные желания
        </Typography>
        <Grid container spacing={4}>
          {popularItems.length > 0 ? (
            popularItems.map(item => renderWishItem(item))
          ) : (
            <Typography variant="body1" sx={{ py: 2 }}>
              Пока нет популярных желаний
            </Typography>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" href="/feed/popular">
            Смотреть все популярные желания
          </Button>
        </Box>
      </Container>

      {/* New items section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Новые желания
        </Typography>
        <Grid container spacing={4}>
          {newItems.length > 0 ? (
            newItems.map(item => renderWishItem(item))
          ) : (
            <Typography variant="body1" sx={{ py: 2 }}>
              Пока нет новых желаний
            </Typography>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" href="/feed/new">
            Смотреть все новые желания
          </Button>
        </Box>
      </Container>

      {/* How it works section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Как это работает
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  1. Создайте вишлист
                </Typography>
                <Typography variant="body1">
                  Зарегистрируйтесь и создайте свой первый вишлист. Добавьте желания, укажите цены и описания.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  2. Поделитесь с аудиторией
                </Typography>
                <Typography variant="body1">
                  Поделитесь ссылкой на свой вишлист с подписчиками через социальные сети или стрим.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  3. Получайте поддержку
                </Typography>
                <Typography variant="body1">
                  Ваши подписчики могут поддержать вас, отправив донаты на конкретные желания из вашего списка.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" href="/register">
              Начать сейчас
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;