import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Компонент для отображения преимуществ сервиса
const FeatureCard = ({ title, description, icon }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Компонент для отображения информации о команде
const TeamMember = ({ name, role, avatar, description }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
        <Avatar
          alt={name}
          src={avatar}
          sx={{ width: 100, height: 100 }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const About = () => {
  // Данные о преимуществах сервиса
  const features = [
    {
      title: 'Простое создание вишлистов',
      description: 'Создавайте вишлисты для любого события или цели. Добавляйте товары из любых магазинов и делитесь ими с друзьями и подписчиками.',
      icon: <CheckCircleIcon color="primary" />
    },
    {
      title: 'Безопасные донаты',
      description: 'Наша платформа обеспечивает безопасную обработку платежей и прозрачность всех транзакций. Вы всегда можете отследить статус своих донатов.',
      icon: <CheckCircleIcon color="primary" />
    },
    {
      title: 'Удобный интерфейс',
      description: 'Интуитивно понятный интерфейс делает использование сервиса приятным и эффективным как для создателей вишлистов, так и для доноров.',
      icon: <CheckCircleIcon color="primary" />
    },
    {
      title: 'Аналитика и статистика',
      description: 'Получайте подробную статистику по вашим вишлистам и донатам. Анализируйте данные для улучшения взаимодействия с аудиторией.',
      icon: <CheckCircleIcon color="primary" />
    }
  ];

  // Данные о команде
  const team = [
    {
      name: 'Александр Иванов',
      role: 'Основатель и CEO',
      avatar: '/images/team/alexander.jpg',
      description: 'Опытный предприниматель с более чем 10-летним опытом в сфере IT и финтех. Основал WishFlick с целью создать удобную платформу для вишлистов и донатов.'
    },
    {
      name: 'Екатерина Смирнова',
      role: 'CTO',
      avatar: '/images/team/ekaterina.jpg',
      description: 'Технический директор с опытом работы в крупных IT-компаниях. Отвечает за техническую реализацию и развитие платформы.'
    },
    {
      name: 'Дмитрий Петров',
      role: 'Руководитель разработки',
      avatar: '/images/team/dmitry.jpg',
      description: 'Опытный разработчик и архитектор программного обеспечения. Руководит командой разработчиков и отвечает за качество кода.'
    },
    {
      name: 'Мария Козлова',
      role: 'Дизайнер UX/UI',
      avatar: '/images/team/maria.jpg',
      description: 'Талантливый дизайнер с опытом создания пользовательских интерфейсов для веб и мобильных приложений. Отвечает за дизайн и пользовательский опыт.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Секция с заголовком и описанием */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          О сервисе WishFlick
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Платформа для создания вишлистов и получения донатов
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
          WishFlick — это современная платформа, которая помогает блогерам, стримерам и обычным пользователям создавать вишлисты и получать донаты от своих подписчиков и друзей. Наша миссия — сделать процесс создания вишлистов и сбора донатов максимально простым, удобным и безопасным.
        </Typography>
      </Box>

      {/* Секция с историей */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Наша история
        </Typography>
        <Typography variant="body1" paragraph>
          Идея создания WishFlick появилась в 2022 году, когда наша команда заметила, что существующие решения для создания вишлистов и сбора донатов не отвечают всем потребностям пользователей. Мы решили создать платформу, которая объединит в себе все необходимые функции и будет удобна как для создателей контента, так и для их аудитории.
        </Typography>
        <Typography variant="body1" paragraph>
          В начале 2023 года мы запустили бета-версию сервиса, которая получила положительные отзывы от первых пользователей. С тех пор мы постоянно улучшаем платформу, добавляем новые функции и оптимизируем пользовательский опыт.
        </Typography>
        <Typography variant="body1">
          Сегодня WishFlick — это растущее сообщество пользователей, которые создают вишлисты, делятся ими с друзьями и получают донаты на реализацию своих желаний и проектов.
        </Typography>
      </Paper>

      {/* Секция с преимуществами */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Преимущества WishFlick
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Секция с командой */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Наша команда
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <TeamMember
                name={member.name}
                role={member.role}
                avatar={member.avatar}
                description={member.description}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Секция с миссией и ценностями */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Наша миссия и ценности
        </Typography>
        <Typography variant="body1" paragraph>
          Миссия WishFlick — сделать процесс создания вишлистов и сбора донатов максимально простым, удобным и безопасным для всех пользователей. Мы стремимся создать платформу, которая поможет людям реализовывать свои желания и поддерживать тех, кого они ценят.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Наши ценности:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Простота и удобство"
              secondary="Мы создаем интуитивно понятный интерфейс и стремимся сделать использование сервиса максимально простым и удобным."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Безопасность и прозрачность"
              secondary="Мы обеспечиваем безопасность всех транзакций и прозрачность всех процессов на платформе."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Инновации и развитие"
              secondary="Мы постоянно развиваем платформу, добавляем новые функции и улучшаем пользовательский опыт."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Сообщество и поддержка"
              secondary="Мы создаем сообщество пользователей и обеспечиваем качественную поддержку для всех участников платформы."
            />
          </ListItem>
        </List>
      </Paper>

      {/* Секция с контактами */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Свяжитесь с нами
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Контактная информация
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary="info@wishflick.ru" />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Социальные сети
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <IconButton color="primary" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary" aria-label="Facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary" aria-label="Twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="primary" aria-label="GitHub">
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Часто задаваемые вопросы
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Как создать вишлист?" 
                    secondary="Зарегистрируйтесь на платформе, перейдите в раздел 'Мои вишлисты' и нажмите кнопку 'Создать вишлист'. Заполните необходимые поля и добавьте желаемые товары."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Как сделать донат?" 
                    secondary="Найдите интересующий вас вишлист, выберите товар, на который хотите сделать донат, укажите сумму и способ оплаты."
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Какая комиссия сервиса?" 
                    secondary="Комиссия сервиса составляет 5% от суммы доната. Все остальные средства поступают получателю."
                  />
                </ListItem>
              </List>
              <Button 
                component={Link} 
                to="/faq" 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
              >
                Все вопросы и ответы
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Секция с призывом к действию */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Присоединяйтесь к WishFlick сегодня!
        </Typography>
        <Typography variant="body1" paragraph>
          Создавайте вишлисты, делитесь ими с друзьями и получайте донаты на реализацию своих желаний.
        </Typography>
        <Button 
          component={Link} 
          to="/register" 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ mt: 2 }}
        >
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
};

export default About;