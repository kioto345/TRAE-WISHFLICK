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
  CardMedia,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { getWishlists, deleteWishlist } from '../redux/actions/wishlistActions';
import { setAlert } from '../redux/actions/alertActions';

const Wishlists = () => {
  const dispatch = useDispatch();
  const { wishlists, loading } = useSelector(state => state.wishlist);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(getWishlists());
  }, [dispatch]);

  // Обработчики для меню действий
  const handleMenuOpen = (event, wishlist) => {
    setAnchorEl(event.currentTarget);
    setSelectedWishlist(wishlist);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Обработчики для диалога удаления
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedWishlist(null);
  };

  const handleDeleteWishlist = () => {
    if (selectedWishlist) {
      dispatch(deleteWishlist(selectedWishlist._id));
      handleDeleteDialogClose();
      dispatch(setAlert('Вишлист успешно удален', 'success'));
    }
  };

  // Функция для копирования ссылки на вишлист
  const handleShareWishlist = () => {
    if (selectedWishlist) {
      const wishlistUrl = `${window.location.origin}/wishlist/${selectedWishlist._id}`;
      navigator.clipboard.writeText(wishlistUrl)
        .then(() => {
          dispatch(setAlert('Ссылка скопирована в буфер обмена', 'success'));
          handleMenuClose();
        })
        .catch(err => {
          dispatch(setAlert('Не удалось скопировать ссылку', 'error'));
          handleMenuClose();
        });
    }
  };

  // Получение изображения для карточки вишлиста
  const getWishlistImage = (wishlist) => {
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

  // Получение статуса приватности вишлиста
  const getPrivacyChip = (isPrivate) => {
    return isPrivate ? (
      <Chip 
        icon={<VisibilityOffIcon />} 
        label="Приватный" 
        size="small" 
        color="default" 
        sx={{ ml: 1 }} 
      />
    ) : (
      <Chip 
        icon={<VisibilityIcon />} 
        label="Публичный" 
        size="small" 
        color="primary" 
        sx={{ ml: 1 }} 
      />
    );
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Мои вишлисты
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/wishlists/create"
        >
          Создать вишлист
        </Button>
      </Box>

      {wishlists.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" paragraph>
            У вас пока нет вишлистов
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Создайте свой первый вишлист, чтобы начать получать подарки
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/wishlists/create"
            sx={{ mt: 2 }}
          >
            Создать вишлист
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlists.map(wishlist => (
            <Grid item xs={12} sm={6} md={4} key={wishlist._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={getWishlistImage(wishlist)}
                  alt={wishlist.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {wishlist.title}
                      {getPrivacyChip(wishlist.isPrivate)}
                    </Typography>
                    <IconButton 
                      aria-label="действия" 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, wishlist)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {wishlist.description || 'Нет описания'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Желаний: {wishlist.items.length}
                    </Typography>
                    {wishlist.category && (
                      <Chip 
                        label={wishlist.category} 
                        size="small" 
                        sx={{ mt: 1 }} 
                      />
                    )}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/wishlist/${wishlist._id}`}>
                    Просмотр
                  </Button>
                  <Button size="small" component={RouterLink} to={`/wishlists/edit/${wishlist._id}`}>
                    Редактировать
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={RouterLink} to={`/wishlist/${selectedWishlist?._id}`} onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Просмотр</ListItemText>
        </MenuItem>
        <MenuItem component={RouterLink} to={`/wishlists/edit/${selectedWishlist?._id}`} onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareWishlist}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Поделиться</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteDialogOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Удалить</ListItemText>
        </MenuItem>
      </Menu>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Удалить вишлист?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить вишлист "{selectedWishlist?.title}"? 
            Это действие нельзя будет отменить, и все желания в этом вишлисте будут удалены.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Отмена</Button>
          <Button onClick={handleDeleteWishlist} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlists;