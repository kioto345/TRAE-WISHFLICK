import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Страница не найдена
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          Извините, но страница, которую вы ищете, не существует, удалена или временно недоступна.
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/"
          >
            На главную
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            component={Link}
            to="/contact"
          >
            Связаться с поддержкой
          </Button>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Возможно, вы хотите посетить одну из этих страниц:
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} to="/feed" color="secondary">
              Лента желаний
            </Button>
            <Button component={Link} to="/about" color="secondary">
              О нас
            </Button>
            <Button component={Link} to="/faq" color="secondary">
              Часто задаваемые вопросы
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;