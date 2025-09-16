import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Card,
  CardContent,
  MenuItem,
  InputAdornment,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  List as ListIcon,
  Flag as FlagIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { setAlert } from '../redux/actions/alertActions';

// Компонент для отображения панели статистики
const StatisticsPanel = () => {
  // Пример данных статистики (в реальном приложении будет загружаться с сервера)
  const statistics = {
    totalUsers: 1245,
    activeUsers: 876,
    totalWishlists: 3421,
    totalDonations: 2156,
    totalAmount: 543200,
    newUsersToday: 34,
    newWishlistsToday: 87,
    newDonationsToday: 56
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Пользователи
            </Typography>
            <Typography variant="h4" component="div">
              {statistics.totalUsers}
            </Typography>
            <Typography color="textSecondary">
              +{statistics.newUsersToday} сегодня
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Вишлисты
            </Typography>
            <Typography variant="h4" component="div">
              {statistics.totalWishlists}
            </Typography>
            <Typography color="textSecondary">
              +{statistics.newWishlistsToday} сегодня
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Донаты
            </Typography>
            <Typography variant="h4" component="div">
              {statistics.totalDonations}
            </Typography>
            <Typography color="textSecondary">
              +{statistics.newDonationsToday} сегодня
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Общая сумма донатов
            </Typography>
            <Typography variant="h4" component="div">
              {statistics.totalAmount.toLocaleString()} ₽
            </Typography>
            <Typography color="textSecondary">
              За все время
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Компонент для управления пользователями
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const dispatch = useDispatch();

  // Пример данных пользователей (в реальном приложении будет загружаться с сервера)
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setUsers([
        {
          _id: '1',
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          role: 'user',
          isActive: true,
          registeredAt: new Date('2023-01-15'),
          wishlistsCount: 5,
          donationsReceived: 12,
          donationsSent: 8
        },
        {
          _id: '2',
          name: 'Мария Петрова',
          email: 'maria@example.com',
          role: 'user',
          isActive: true,
          registeredAt: new Date('2023-02-20'),
          wishlistsCount: 3,
          donationsReceived: 5,
          donationsSent: 10
        },
        {
          _id: '3',
          name: 'Алексей Смирнов',
          email: 'alex@example.com',
          role: 'admin',
          isActive: true,
          registeredAt: new Date('2022-12-10'),
          wishlistsCount: 2,
          donationsReceived: 0,
          donationsSent: 15
        },
        {
          _id: '4',
          name: 'Елена Козлова',
          email: 'elena@example.com',
          role: 'user',
          isActive: false,
          registeredAt: new Date('2023-03-05'),
          wishlistsCount: 1,
          donationsReceived: 0,
          donationsSent: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчики для диалогов
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleBlockUser = (user) => {
    setCurrentUser(user);
    setBlockDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentUser(null);
  };

  const handleBlockDialogClose = () => {
    setBlockDialogOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentUser(null);
  };

  const handleEditSubmit = () => {
    // Здесь будет логика для обновления данных пользователя
    dispatch(setAlert('Данные пользователя успешно обновлены', 'success'));
    handleEditDialogClose();
  };

  const handleBlockSubmit = () => {
    // Здесь будет логика для блокировки/разблокировки пользователя
    const action = currentUser.isActive ? 'заблокирован' : 'разблокирован';
    dispatch(setAlert(`Пользователь успешно ${action}`, 'success'));
    
    // Обновляем локальное состояние для демонстрации
    setUsers(users.map(user => 
      user._id === currentUser._id ? { ...user, isActive: !user.isActive } : user
    ));
    
    handleBlockDialogClose();
  };

  const handleDeleteSubmit = () => {
    // Здесь будет логика для удаления пользователя
    dispatch(setAlert('Пользователь успешно удален', 'success'));
    
    // Обновляем локальное состояние для демонстрации
    setUsers(users.filter(user => user._id !== currentUser._id));
    
    handleDeleteDialogClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Управление пользователями
        </Typography>
        <TextField
          placeholder="Поиск пользователей"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell>Вишлисты</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role === 'admin' ? 'Администратор' : 'Пользователь'} 
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Активен' : 'Заблокирован'} 
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.registeredAt)}</TableCell>
                <TableCell>{user.wishlistsCount}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditUser(user)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleBlockUser(user)}>
                    {user.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteUser(user)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог редактирования пользователя */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Редактирование пользователя</DialogTitle>
        <DialogContent>
          {currentUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Имя"
                  defaultValue={currentUser.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  defaultValue={currentUser.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Роль"
                  defaultValue={currentUser.role}
                  fullWidth
                >
                  <MenuItem value="user">Пользователь</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={currentUser.isActive} 
                      color="primary" 
                    />
                  }
                  label="Активен"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Отмена</Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог блокировки/разблокировки пользователя */}
      <Dialog open={blockDialogOpen} onClose={handleBlockDialogClose}>
        <DialogTitle>
          {currentUser && (currentUser.isActive ? 'Блокировка пользователя' : 'Разблокировка пользователя')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentUser && (
              currentUser.isActive 
                ? `Вы уверены, что хотите заблокировать пользователя ${currentUser.name}?` 
                : `Вы уверены, что хотите разблокировать пользователя ${currentUser.name}?`
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBlockDialogClose}>Отмена</Button>
          <Button onClick={handleBlockSubmit} color="primary" variant="contained">
            {currentUser && (currentUser.isActive ? 'Заблокировать' : 'Разблокировать')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления пользователя */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Удаление пользователя</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentUser && `Вы уверены, что хотите удалить пользователя ${currentUser.name}? Это действие нельзя отменить.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Отмена</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Компонент для управления вишлистами
const WishlistsManagement = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentWishlist, setCurrentWishlist] = useState(null);
  
  const dispatch = useDispatch();

  // Пример данных вишлистов (в реальном приложении будет загружаться с сервера)
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setWishlists([
        {
          _id: '1',
          title: 'День рождения',
          user: {
            _id: '1',
            name: 'Иван Иванов'
          },
          category: 'Праздники',
          itemsCount: 8,
          donationsCount: 5,
          isPublic: true,
          createdAt: new Date('2023-04-10')
        },
        {
          _id: '2',
          title: 'Новая квартира',
          user: {
            _id: '2',
            name: 'Мария Петрова'
          },
          category: 'Дом',
          itemsCount: 12,
          donationsCount: 3,
          isPublic: true,
          createdAt: new Date('2023-03-15')
        },
        {
          _id: '3',
          title: 'Книги для учебы',
          user: {
            _id: '3',
            name: 'Алексей Смирнов'
          },
          category: 'Образование',
          itemsCount: 5,
          donationsCount: 2,
          isPublic: false,
          createdAt: new Date('2023-05-01')
        },
        {
          _id: '4',
          title: 'Подарки на свадьбу',
          user: {
            _id: '2',
            name: 'Мария Петрова'
          },
          category: 'Праздники',
          itemsCount: 15,
          donationsCount: 8,
          isPublic: true,
          createdAt: new Date('2023-02-20')
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Фильтрация вишлистов по поисковому запросу
  const filteredWishlists = wishlists.filter(wishlist => 
    wishlist.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    wishlist.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wishlist.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчики для диалогов
  const handleDeleteWishlist = (wishlist) => {
    setCurrentWishlist(wishlist);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentWishlist(null);
  };

  const handleDeleteSubmit = () => {
    // Здесь будет логика для удаления вишлиста
    dispatch(setAlert('Вишлист успешно удален', 'success'));
    
    // Обновляем локальное состояние для демонстрации
    setWishlists(wishlists.filter(wishlist => wishlist._id !== currentWishlist._id));
    
    handleDeleteDialogClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Управление вишлистами
        </Typography>
        <TextField
          placeholder="Поиск вишлистов"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Элементы</TableCell>
              <TableCell>Донаты</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWishlists.map((wishlist) => (
              <TableRow key={wishlist._id}>
                <TableCell>{wishlist.title}</TableCell>
                <TableCell>{wishlist.user.name}</TableCell>
                <TableCell>{wishlist.category}</TableCell>
                <TableCell>{wishlist.itemsCount}</TableCell>
                <TableCell>{wishlist.donationsCount}</TableCell>
                <TableCell>
                  <Chip 
                    label={wishlist.isPublic ? 'Публичный' : 'Приватный'} 
                    color={wishlist.isPublic ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(wishlist.createdAt)}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDeleteWishlist(wishlist)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог удаления вишлиста */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Удаление вишлиста</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentWishlist && `Вы уверены, что хотите удалить вишлист "${currentWishlist.title}"? Это действие нельзя отменить.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Отмена</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Компонент для управления жалобами
const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  
  const dispatch = useDispatch();

  // Пример данных жалоб (в реальном приложении будет загружаться с сервера)
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setReports([
        {
          _id: '1',
          type: 'user',
          reportedBy: {
            _id: '1',
            name: 'Иван Иванов'
          },
          reportedEntity: {
            _id: '4',
            name: 'Елена Козлова'
          },
          reason: 'Спам',
          description: 'Пользователь отправляет спам-сообщения',
          status: 'pending',
          createdAt: new Date('2023-05-10')
        },
        {
          _id: '2',
          type: 'wishlist',
          reportedBy: {
            _id: '2',
            name: 'Мария Петрова'
          },
          reportedEntity: {
            _id: '3',
            title: 'Книги для учебы'
          },
          reason: 'Неприемлемый контент',
          description: 'Вишлист содержит неприемлемые элементы',
          status: 'pending',
          createdAt: new Date('2023-05-12')
        },
        {
          _id: '3',
          type: 'user',
          reportedBy: {
            _id: '3',
            name: 'Алексей Смирнов'
          },
          reportedEntity: {
            _id: '1',
            name: 'Иван Иванов'
          },
          reason: 'Оскорбления',
          description: 'Пользователь оставляет оскорбительные комментарии',
          status: 'resolved',
          createdAt: new Date('2023-05-05'),
          resolvedAt: new Date('2023-05-07')
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Обработчики для диалогов
  const handleResolveReport = (report) => {
    setCurrentReport(report);
    setResolveDialogOpen(true);
  };

  const handleResolveDialogClose = () => {
    setResolveDialogOpen(false);
    setCurrentReport(null);
  };

  const handleResolveSubmit = () => {
    // Здесь будет логика для разрешения жалобы
    dispatch(setAlert('Жалоба успешно разрешена', 'success'));
    
    // Обновляем локальное состояние для демонстрации
    setReports(reports.map(report => 
      report._id === currentReport._id 
        ? { ...report, status: 'resolved', resolvedAt: new Date() } 
        : report
    ));
    
    handleResolveDialogClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Управление жалобами
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Тип</TableCell>
              <TableCell>Отправитель</TableCell>
              <TableCell>Объект жалобы</TableCell>
              <TableCell>Причина</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>
                  <Chip 
                    label={report.type === 'user' ? 'Пользователь' : 'Вишлист'} 
                    color={report.type === 'user' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{report.reportedBy.name}</TableCell>
                <TableCell>
                  {report.type === 'user' ? report.reportedEntity.name : report.reportedEntity.title}
                </TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  <Chip 
                    label={report.status === 'pending' ? 'Ожидает' : 'Разрешена'} 
                    color={report.status === 'pending' ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(report.createdAt)}</TableCell>
                <TableCell>
                  {report.status === 'pending' && (
                    <IconButton size="small" onClick={() => handleResolveReport(report)}>
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог разрешения жалобы */}
      <Dialog open={resolveDialogOpen} onClose={handleResolveDialogClose}>
        <DialogTitle>Разрешение жалобы</DialogTitle>
        <DialogContent>
          {currentReport && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Жалоба от пользователя {currentReport.reportedBy.name} на 
                {currentReport.type === 'user' ? ' пользователя ' : ' вишлист '}
                {currentReport.type === 'user' ? currentReport.reportedEntity.name : `"${currentReport.reportedEntity.title}"`}
              </DialogContentText>
              <Typography variant="subtitle2">Причина:</Typography>
              <Typography paragraph>{currentReport.reason}</Typography>
              <Typography variant="subtitle2">Описание:</Typography>
              <Typography paragraph>{currentReport.description}</Typography>
              <TextField
                label="Комментарий к разрешению"
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResolveDialogClose}>Отмена</Button>
          <Button onClick={handleResolveSubmit} color="primary" variant="contained">
            Разрешить жалобу
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Компонент для настроек сервиса
const ServiceSettings = () => {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    minDonationAmount: 50,
    maxDonationAmount: 50000,
    serviceFeePercentage: 5,
    minWithdrawalAmount: 100,
    maxItemsPerWishlist: 20,
    maxWishlistsPerUser: 10,
    popularWishlistsCount: 10,
    newWishlistsCount: 10
  });
  
  const dispatch = useDispatch();

  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const handleSaveSettings = () => {
    // Здесь будет логика для сохранения настроек
    dispatch(setAlert('Настройки успешно сохранены', 'success'));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Настройки сервиса
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={handleSaveSettings}
        >
          Сохранить настройки
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Общие настройки</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.registrationEnabled} 
                  onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)} 
                  color="primary" 
                />
              }
              label="Регистрация пользователей включена"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Максимальное количество вишлистов на пользователя"
              type="number"
              value={settings.maxWishlistsPerUser}
              onChange={(e) => handleSettingChange('maxWishlistsPerUser', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Максимальное количество элементов в вишлисте"
              type="number"
              value={settings.maxItemsPerWishlist}
              onChange={(e) => handleSettingChange('maxItemsPerWishlist', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Настройки донатов</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Минимальная сумма доната (RUB)"
              type="number"
              value={settings.minDonationAmount}
              onChange={(e) => handleSettingChange('minDonationAmount', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Максимальная сумма доната (RUB)"
              type="number"
              value={settings.maxDonationAmount}
              onChange={(e) => handleSettingChange('maxDonationAmount', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Процент комиссии сервиса (%)"
              type="number"
              value={settings.serviceFeePercentage}
              onChange={(e) => handleSettingChange('serviceFeePercentage', parseFloat(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 0, max: 100, step: 0.1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Минимальная сумма для вывода (RUB)"
              type="number"
              value={settings.minWithdrawalAmount}
              onChange={(e) => handleSettingChange('minWithdrawalAmount', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Настройки ленты</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Количество популярных вишлистов в ленте"
              type="number"
              value={settings.popularWishlistsCount}
              onChange={(e) => handleSettingChange('popularWishlistsCount', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Количество новых вишлистов в ленте"
              type="number"
              value={settings.newWishlistsCount}
              onChange={(e) => handleSettingChange('newWishlistsCount', parseInt(e.target.value))}
              fullWidth
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Проверка прав администратора
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      // Перенаправление на главную страницу, если пользователь не админ
      dispatch(setAlert('У вас нет прав для доступа к этой странице', 'error'));
      // В реальном приложении здесь будет редирект
    }
  }, [isAuthenticated, user, loading, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если пользователь не админ, показываем сообщение об ошибке
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          У вас нет прав для доступа к этой странице
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <StatisticsPanel />
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab icon={<PersonIcon />} label="Пользователи" />
            <Tab icon={<ListIcon />} label="Вишлисты" />
            <Tab icon={<FlagIcon />} label="Жалобы" />
            <Tab icon={<SettingsIcon />} label="Настройки" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && <UsersManagement />}
        {tabValue === 1 && <WishlistsManagement />}
        {tabValue === 2 && <ReportsManagement />}
        {tabValue === 3 && <ServiceSettings />}
      </Box>
    </Container>
  );
};

export default Admin;