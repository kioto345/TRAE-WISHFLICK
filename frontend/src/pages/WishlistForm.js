import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Divider,
  IconButton,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  getWishlist, 
  createWishlist, 
  updateWishlist, 
  addWishlistItem, 
  updateWishlistItem, 
  deleteWishlistItem, 
  clearWishlist 
} from '../redux/actions/wishlistActions';
import { setAlert } from '../redux/actions/alertActions';

// Категории для вишлистов
const categories = [
  'День рождения',
  'Свадьба',
  'Новый год',
  'Годовщина',
  'Новоселье',
  'Выпускной',
  'Другое'
];

// Компонент формы элемента вишлиста
const WishlistItemForm = ({ item, index, onUpdate, onDelete, isNew = false }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    currency: item?.currency || 'RUB',
    url: item?.url || '',
    image: item?.image || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Проверка обязательных полей
    if (!formData.name.trim()) {
      return;
    }
    
    onUpdate(index, formData);
  };

  return (
    <Draggable draggableId={`item-${index}`} index={index} isDragDisabled={isNew}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={2}
          sx={{ p: 2, mb: 2, position: 'relative' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
              <DragIndicatorIcon color="action" />
            </Box>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {isNew ? 'Новое желание' : `Желание #${index + 1}`}
            </Typography>
            <IconButton size="small" color="error" onClick={() => onDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Название*"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                size="small"
                onBlur={handleSubmit}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Описание"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
                onBlur={handleSubmit}
              />
            </Grid>
            <Grid item xs={8} sm={9}>
              <TextField
                name="price"
                label="Цена"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                size="small"
                onBlur={handleSubmit}
              />
            </Grid>
            <Grid item xs={4} sm={3}>
              <TextField
                name="currency"
                label="Валюта"
                select
                value={formData.currency}
                onChange={handleChange}
                fullWidth
                size="small"
                onBlur={handleSubmit}
              >
                <MenuItem value="RUB">RUB</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="url"
                label="Ссылка на товар"
                value={formData.url}
                onChange={handleChange}
                fullWidth
                size="small"
                onBlur={handleSubmit}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="image"
                label="Ссылка на изображение"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" disabled={!formData.image}>
                      <ImageIcon />
                    </IconButton>
                  ),
                }}
                onBlur={handleSubmit}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Draggable>
  );
};

const WishlistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector(state => state.wishlist);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isPrivate: false,
    items: []
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'RUB',
    url: '',
    image: ''
  });

  // Загрузка данных вишлиста при редактировании
  useEffect(() => {
    if (id) {
      dispatch(getWishlist(id));
    } else {
      dispatch(clearWishlist());
    }
    
    // Очистка при размонтировании
    return () => {
      dispatch(clearWishlist());
    };
  }, [dispatch, id]);

  // Заполнение формы данными из вишлиста
  useEffect(() => {
    if (!loading && wishlist && id) {
      setFormData({
        title: wishlist.title || '',
        description: wishlist.description || '',
        category: wishlist.category || '',
        isPrivate: wishlist.isPrivate || false,
        items: wishlist.items || []
      });
    }
  }, [wishlist, loading, id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isPrivate' ? checked : value
    });
  };

  // Обработка перетаскивания элементов
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(formData.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormData({ ...formData, items });
  };

  // Обработчики для элементов вишлиста
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      dispatch(setAlert('Введите название желания', 'error'));
      return;
    }
    
    setFormData({
      ...formData,
      items: [...formData.items, { ...newItem }]
    });
    
    // Сброс формы нового элемента
    setNewItem({
      name: '',
      description: '',
      price: '',
      currency: 'RUB',
      url: '',
      image: ''
    });
  };

  const handleUpdateItem = (index, updatedItem) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = updatedItem;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      dispatch(setAlert('Введите название вишлиста', 'error'));
      return;
    }
    
    if (formData.items.length === 0) {
      dispatch(setAlert('Добавьте хотя бы одно желание', 'error'));
      return;
    }
    
    if (id) {
      dispatch(updateWishlist(id, formData));
    } else {
      dispatch(createWishlist(formData));
    }
    
    // Перенаправление на страницу вишлистов
    navigate('/wishlists');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Редактирование вишлиста' : 'Создание вишлиста'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Основная информация</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Название вишлиста*"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Описание"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Категория"
                select
                value={formData.category}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Выберите категорию</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Приватный вишлист"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Приватные вишлисты видны только вам
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        <Typography variant="h6" gutterBottom>Желания</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Добавьте желания в ваш вишлист. Вы можете изменить порядок, перетаскивая элементы.
        </Typography>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="wishlist-items">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mb: 3 }}
              >
                {formData.items.map((item, index) => (
                  <WishlistItemForm
                    key={index}
                    item={item}
                    index={index}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Добавить новое желание
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Название*"
                  value={newItem.name}
                  onChange={handleNewItemChange}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Цена"
                  type="number"
                  value={newItem.price}
                  onChange={handleNewItemChange}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="url"
                  label="Ссылка на товар"
                  value={newItem.url}
                  onChange={handleNewItemChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              disabled={!newItem.name.trim()}
            >
              Добавить желание
            </Button>
          </CardActions>
        </Card>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/wishlists')}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {id ? 'Сохранить изменения' : 'Создать вишлист'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default WishlistForm;