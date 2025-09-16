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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Card,
  CardContent,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { getBalance } from '../redux/actions/profileActions';
import { setAlert } from '../redux/actions/alertActions';

// Компонент для отображения истории транзакций
const TransactionHistory = ({ transactions }) => {
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Получение типа транзакции
  const getTransactionType = (type) => {
    switch (type) {
      case 'donation_received':
        return 'Получен донат';
      case 'donation_sent':
        return 'Отправлен донат';
      case 'withdrawal':
        return 'Вывод средств';
      case 'deposit':
        return 'Пополнение';
      default:
        return type;
    }
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <React.Fragment key={transaction._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="span">
                      {getTransactionType(transaction.type)}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={transaction.amount > 0 ? 'success.main' : 'error.main'} 
                      component="span"
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    {transaction.description && (
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {transaction.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(transaction.createdAt)}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))
      ) : (
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            История транзакций пуста
          </Typography>
        </Box>
      )}
    </List>
  );
};

const Balance = () => {
  const dispatch = useDispatch();
  const { balance, loading } = useSelector(state => state.profile);
  
  // Состояния для диалогов
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  
  // Состояния для форм
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_card');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('bank_card');
  
  // Загрузка баланса при монтировании
  useEffect(() => {
    dispatch(getBalance());
  }, [dispatch]);
  
  // Методы вывода средств
  const withdrawalMethods = [
    { value: 'bank_card', label: 'Банковская карта' },
    { value: 'bank_account', label: 'Банковский счет' },
    { value: 'electronic_wallet', label: 'Электронный кошелек' }
  ];
  
  // Методы пополнения
  const depositMethods = [
    { value: 'bank_card', label: 'Банковская карта' },
    { value: 'electronic_wallet', label: 'Электронный кошелек' }
  ];
  
  // Обработчики для диалога вывода средств
  const handleWithdrawDialogOpen = () => {
    setWithdrawDialogOpen(true);
  };
  
  const handleWithdrawDialogClose = () => {
    setWithdrawDialogOpen(false);
    setWithdrawAmount('');
    setWithdrawMethod('bank_card');
    setWithdrawDetails('');
  };
  
  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      dispatch(setAlert('Введите корректную сумму для вывода', 'error'));
      return;
    }
    
    if (parseFloat(withdrawAmount) > (balance?.amount || 0)) {
      dispatch(setAlert('Недостаточно средств на балансе', 'error'));
      return;
    }
    
    // Здесь будет логика для отправки запроса на вывод средств
    dispatch(setAlert('Заявка на вывод средств успешно создана', 'success'));
    handleWithdrawDialogClose();
  };
  
  // Обработчики для диалога пополнения
  const handleDepositDialogOpen = () => {
    setDepositDialogOpen(true);
  };
  
  const handleDepositDialogClose = () => {
    setDepositDialogOpen(false);
    setDepositAmount('');
    setDepositMethod('bank_card');
  };
  
  const handleDepositSubmit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      dispatch(setAlert('Введите корректную сумму для пополнения', 'error'));
      return;
    }
    
    // Здесь будет логика для отправки запроса на пополнение
    dispatch(setAlert('Перенаправление на страницу оплаты...', 'info'));
    handleDepositDialogClose();
  };
  
  // Пример истории транзакций (в реальном приложении будет загружаться с сервера)
  const transactions = [
    {
      _id: '1',
      type: 'donation_received',
      amount: 500,
      currency: 'RUB',
      description: 'Донат от пользователя user123',
      createdAt: new Date('2023-05-15T14:30:00')
    },
    {
      _id: '2',
      type: 'withdrawal',
      amount: -300,
      currency: 'RUB',
      description: 'Вывод на карту **** 1234',
      createdAt: new Date('2023-05-10T11:15:00')
    },
    {
      _id: '3',
      type: 'donation_sent',
      amount: -200,
      currency: 'RUB',
      description: 'Донат пользователю user456',
      createdAt: new Date('2023-05-05T09:45:00')
    },
    {
      _id: '4',
      type: 'deposit',
      amount: 1000,
      currency: 'RUB',
      description: 'Пополнение с карты **** 5678',
      createdAt: new Date('2023-05-01T16:20:00')
    }
  ];
  
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
        Управление балансом
      </Typography>
      
      <Grid container spacing={4}>
        {/* Карточка с балансом */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOnIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                <Typography variant="h5" component="div">
                  Текущий баланс
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ mb: 3 }}>
                {balance?.amount || 0} {balance?.currency || 'RUB'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AccountBalanceIcon />}
                  onClick={handleWithdrawDialogOpen}
                  fullWidth
                >
                  Вывести
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<CreditCardIcon />}
                  onClick={handleDepositDialogOpen}
                  fullWidth
                >
                  Пополнить
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Информация о выводе средств */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Информация о выводе средств
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Вы можете вывести средства на банковскую карту, банковский счет или электронный кошелек.
            </Typography>
            <Typography variant="body2" paragraph>
              Минимальная сумма для вывода: 100 RUB.
            </Typography>
            <Typography variant="body2" paragraph>
              Срок обработки заявки: от 1 до 3 рабочих дней.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Комиссия за вывод средств составляет 2% от суммы, но не менее 30 RUB.
            </Alert>
          </Paper>
        </Grid>
        
        {/* История транзакций */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                История транзакций
              </Typography>
            </Box>
            <TransactionHistory transactions={transactions} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Диалог вывода средств */}
      <Dialog open={withdrawDialogOpen} onClose={handleWithdrawDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Вывод средств</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Укажите сумму и способ вывода средств.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Сумма"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                fullWidth
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">RUB</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Способ вывода"
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {withdrawalMethods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={withdrawMethod === 'bank_card' ? 'Номер карты' : 
                      withdrawMethod === 'bank_account' ? 'Реквизиты счета' : 'Реквизиты кошелька'}
                value={withdrawDetails}
                onChange={(e) => setWithdrawDetails(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Alert severity="info" sx={{ mt: 2 }}>
            Комиссия за вывод: {withdrawAmount ? Math.max(parseFloat(withdrawAmount) * 0.02, 30).toFixed(2) : '0.00'} RUB
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWithdrawDialogClose}>Отмена</Button>
          <Button onClick={handleWithdrawSubmit} color="primary" variant="contained">
            Вывести
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог пополнения */}
      <Dialog open={depositDialogOpen} onClose={handleDepositDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Пополнение баланса</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Укажите сумму и способ пополнения баланса.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Сумма"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                fullWidth
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">RUB</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Способ пополнения"
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {depositMethods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDepositDialogClose}>Отмена</Button>
          <Button onClick={handleDepositSubmit} color="primary" variant="contained">
            Пополнить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Balance;