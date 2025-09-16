import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              WishFlick
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Платформа для создания вишлистов и сбора донатов на ваши желания.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="twitter" size="small">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="instagram" size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="youtube" size="small">
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Навигация
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Главная
            </Link>
            <Link component={RouterLink} to="/feed/popular" color="inherit" display="block" sx={{ mb: 1 }}>
              Популярные желания
            </Link>
            <Link component={RouterLink} to="/feed/new" color="inherit" display="block" sx={{ mb: 1 }}>
              Новые желания
            </Link>
            <Link component={RouterLink} to="/wishlists" color="inherit" display="block" sx={{ mb: 1 }}>
              Все вишлисты
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Аккаунт
            </Typography>
            <Link component={RouterLink} to="/register" color="inherit" display="block" sx={{ mb: 1 }}>
              Регистрация
            </Link>
            <Link component={RouterLink} to="/login" color="inherit" display="block" sx={{ mb: 1 }}>
              Вход
            </Link>
            <Link component={RouterLink} to="/dashboard" color="inherit" display="block" sx={{ mb: 1 }}>
              Личный кабинет
            </Link>
            <Link component={RouterLink} to="/profile" color="inherit" display="block" sx={{ mb: 1 }}>
              Профиль
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Информация
            </Typography>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              О нас
            </Link>
            <Link component={RouterLink} to="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
              Часто задаваемые вопросы
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
              Условия использования
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>
              Политика конфиденциальности
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-start' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} WishFlick. Все права защищены.
          </Typography>
          
          {!isMobile && (
            <Box>
              <Link href="#" color="inherit" sx={{ pl: 1, pr: 1 }}>
                Условия использования
              </Link>
              <Link href="#" color="inherit" sx={{ pl: 1, pr: 1 }}>
                Конфиденциальность
              </Link>
              <Link href="#" color="inherit" sx={{ pl: 1, pr: 1 }}>
                Cookies
              </Link>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;