import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Divider,
  Avatar,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  CardGiftcard as CardGiftcardIcon
} from '@mui/icons-material';
import { 
  getPopularWishlists, 
  getNewWishlists, 
  getCategoryWishlists, 
  searchWishlists, 
  clearFeed 
} from '../redux/actions/feedActions';

// Категории для фильтрации
const categories = [
  'День рождения',
  'Свадьба',
  'Новый год',
  'Годовщина',
  'Новоселье',
  'Выпускной',
  'Другое'
];

const Feed = () => {
  const dispatch = useDispatch();
  const { 
    popularWishlists, 
    newWishlists, 
    categoryWishlists, 
    searchResults, 
    loading 
  } = useSelector(state => state.feed);
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(getPopularWishlists());
    dispatch(getNewWishlists());
    
    // Очистка при размонтировании
    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch]);
  
  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Сброс поиска и категории при смене вкладки
    setSearchQuery('');
    setSelectedCategory('');
    
    // Загрузка данных в зависимости от выбранной вкладки
    if (newValue === 0) {
      dispatch(getPopularWishlists());
    } else if (newValue === 1) {
      dispatch(getNewWishlists());
    }
  };
  
  // Обработчик поиска
  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchWishlists(searchQuery));
      setTabValue(2); // Переключение на вкладку с результатами поиска
    }
  };
  
  // Обработчик очистки поиска
  const handleClearSearch = () => {
    setSearchQuery('');
    setTabValue(0); // Возврат на вкладку с популярными вишлистами
    dispatch(getPopularWishlists());
  };
  
  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      setTabValue(0); // Возврат на вкладку с популярными вишлистами
      dispatch(getPopularWishlists());
    } else {
      setSelectedCategory(category);
      setTabValue(3); // Переключение на вкладку с категориями
      dispatch(getCategoryWishlists(category));
    }
  };
  
  // Получение текущего списка вишлистов в зависимости от выбранной вкладки
  const getCurrentWishlists = () => {
    switch (tabValue) {
      case 0:
        return popularWishlists;
      case 1:
        return newWishlists;
      case 2:
        return searchResults;
      case 3:
        return categoryWishlists;
      default:
        return [];
    }
  };
  
  // Компонент для отображения карточки вишлиста
  const WishlistCard = ({ wishlist }) => {
    // Получение изображения для карточки вишлиста
    const getWishlistImage = () => {
      if (wishlist.items && wishlist.items.length > 0) {
        // Используем изображение первого элемента, если оно есть
        const firstItemWithImage = wishlist.items.find(item => item.image);
        if (firstItemWithImage) {
          return firstItemWithImage.image;
        }
      }
      // Заглушка, если изображений нет
      return 'https://via.placeholder.com/300x200?text=Wishlist';
    };
    
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={getWishlistImage()}
          alt={wishlist.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={wishlist.user?.avatar} 
              alt={wishlist.user?.username}
              sx={{ width: 32, height: 32, mr: 1 }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="subtitle2">
              {wishlist.user?.username || 'Пользователь'}
            </Typography>
          </Box>
          <Typography gutterBottom variant="h6" component="div">
            {wishlist.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {wishlist.description ? (
              wishlist.description.length > 100 ?
                `${wishlist.description.substring(0, 100)}...` :
                wishlist.description
            ) : 'Нет описания'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CardGiftcardIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {wishlist.items.length} {wishlist.items.length === 1 ? 'желание' : 
                wishlist.items.length >= 2 && wishlist.items.length <= 4 ? 'желания' : 'желаний'}
            </Typography>
          </Box>
          {wishlist.category && (
            <Chip 
              label={wishlist.category} 
              size="small" 
              sx={{ mt: 1 }} 
              onClick={() => handleCategorySelect(wishlist.category)}
            />
          )}
        </CardContent>
        <Divider />
        <CardActions>
          <Button size="small" component={RouterLink} to={`/wishlist/${wishlist._id}`}>
            Просмотр
          </Button>
        </CardActions>
      </Card>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Лента желаний
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Исследуйте вишлисты других пользователей и находите интересные идеи для подарков
        </Typography>
      </Box>
      
      {/* Поиск */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Поиск вишлистов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategorySelect(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Paper>
      
      {/* Вкладки */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="feed tabs">
          <Tab label="Популярные" />
          <Tab label="Новые" />
          {tabValue === 2 && <Tab label="Результаты поиска" />}
          {tabValue === 3 && <Tab label={`Категория: ${selectedCategory}`} />}
        </Tabs>
      </Box>
      
      {/* Содержимое вкладок */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {getCurrentWishlists().length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" paragraph>
                  {tabValue === 2 ? 'По вашему запросу ничего не найдено' : 'Нет доступных вишлистов'}
                </Typography>
                {tabValue !== 0 && (
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setTabValue(0);
                      dispatch(getPopularWishlists());
                    }}
                  >
                    Показать популярные
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {getCurrentWishlists().map((wishlist) => (
                  <Grid item xs={12} sm={6} md={4} key={wishlist._id}>
                    <WishlistCard wishlist={wishlist} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Feed;