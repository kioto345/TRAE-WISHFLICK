import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  List as ListIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  BarChart as AnalyticsIcon
} from '@mui/icons-material';
import { logout } from '../../redux/actions/authActions';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/');
  };
  
  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        Профиль
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
        Личный кабинет
      </MenuItem>
      {user && user.role === 'blogger' && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/blogger/dashboard'); }}>
          Кабинет блогера
        </MenuItem>
      )}
      {user && user.role === 'admin' && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }}>
          Админ-панель
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        Выйти
      </MenuItem>
    </Menu>
  );
  
  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemText primary="Главная" />
        </ListItem>
        <ListItem button component={RouterLink} to="/feed/popular">
          <ListItemText primary="Популярные желания" />
        </ListItem>
        <ListItem button component={RouterLink} to="/feed/new">
          <ListItemText primary="Новые желания" />
        </ListItem>
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem button component={RouterLink} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Личный кабинет" />
          </ListItem>
          <ListItem button component={RouterLink} to="/profile">
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="Профиль" />
          </ListItem>
          <ListItem button component={RouterLink} to="/wishlists/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Создать вишлист" />
          </ListItem>
          {user && user.role === 'blogger' && (
            <ListItem button component={RouterLink} to="/blogger/dashboard">
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Кабинет блогера" />
            </ListItem>
          )}
          {user && user.role === 'admin' && (
            <ListItem button component={RouterLink} to="/admin/dashboard">
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary="Админ-панель" />
            </ListItem>
          )}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={RouterLink} to="/login">
            <ListItemText primary="Войти" />
          </ListItem>
          <ListItem button component={RouterLink} to="/register">
            <ListItemText primary="Регистрация" />
          </ListItem>
        </List>
      )}
    </Box>
  );
  
  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1,
                fontWeight: 'bold'
              }}
            >
              WishFlick
            </Typography>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button color="inherit" component={RouterLink} to="/feed/popular">
                  Популярные
                </Button>
                <Button color="inherit" component={RouterLink} to="/feed/new">
                  Новые
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      to="/wishlists/create"
                      startIcon={<AddIcon />}
                      sx={{ ml: 1 }}
                    >
                      Создать вишлист
                    </Button>
                    
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      sx={{ ml: 1 }}
                    >
                      {user && user.avatar ? (
                        <Avatar 
                          src={user.avatar} 
                          alt={user.username}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <AccountIcon />
                      )}
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button color="inherit" component={RouterLink} to="/login">
                      Войти
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      component={RouterLink} 
                      to="/register"
                      sx={{ ml: 1 }}
                    >
                      Регистрация
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
      
      {renderMenu}
    </>
  );
};

export default Header;