import { ContextSnackbar } from '../context/snackbarContext.js';
import { ContextAuth } from '../context/authContext.js';
import { ContextUser } from '../context/userContext.js';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactsIcon from '@mui/icons-material/Contacts';
import AddchartIcon from '@mui/icons-material/Addchart';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';


// drawerWidth
const drawerWidth = 190;

// drawer open
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

// drawer close
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

// drawer style
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

// drawer elemnets
const drawerElements = [
    {
        id: '1',
        label: 'Dashboard',
        icon: <DashboardIcon color="secondary" />,
        url: '/dashboard'
    },
    {
        id: '2',
        label: 'Leads',
        icon: <AddchartIcon color="primary" />,
        url: '/leads'
    },
    {
        id: '3',
        label: 'Services',
        icon: <HomeRepairServiceIcon />,
        url: '/services'
    },
    {
        id: '4',
        label: 'Contacts',
        icon: <ContactsIcon color="success" />,
        url: 'contacts'
    },
]


export default function AppDrawer() {

    const navigate = useNavigate();
    const theme = useTheme();
    const { auth, setAuth } = useContext(ContextAuth);
    const { setSnackbar } = useContext(ContextSnackbar);
    const { user } = useContext(ContextUser);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const menuId = 'primary-search-account-menu';

    return (
        <div style={{ display: auth ? "block" : "none" }} className='fadeIn'>

            {/* app bar */}
            <AppBar open={open} sx={{ position: "fixed", zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>

                    {/* hide & unhide button */}
                    <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpen(!open)}
                        edge="start" sx={{ marginRight: '36px' }}><MenuIcon /></IconButton>

                    {/* app name */}
                    <Typography variant="h6" noWrap component="div">CRM App</Typography>

                    {/* user icon button */}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box >
                        <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId}
                            aria-haspopup="true" color="inherit" onClick={handleProfileMenuOpen}>
                            <Avatar
                                alt={user.firstname} src='.'
                                sx={{ bgcolor: '#ff4081', width: 35, height: 35 }} />
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            {/* button avatar menu */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate('/profile');
                }}>
                    <PersonIcon sx={{ pr: 1, fontSize: 28 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    Cookies.remove('auth_token', { path: '/' });
                    localStorage.clear();
                    setAuth(false);
                    setSnackbar({ open: true, message: 'Logout successful', severity: 'success' })
                    navigate('/user/login');
                }}>
                    <PowerSettingsNewIcon sx={{ pr: 1, fontSize: 28 }} />Logout
                </MenuItem>
            </Menu>

            {/* drawer */}
            <Drawer variant="permanent" open={open}>
                <List sx={{ pt: '80px' }}>

                    {drawerElements.map((item) => (
                        <ListItem button key={item.id} onClick={() => navigate(item.url)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}

                    {user.userType === 'admin' || user.userType === 'manager'
                        ? <ListItem button onClick={() => navigate('/settings')}>
                            <ListItemIcon>
                                <SettingsSuggestIcon sx={{ color: '#E91E63', fontSize: 30 }} />
                            </ListItemIcon>
                            <ListItemText primary={'Settings'} />
                        </ListItem>
                        : ''}

                </List>
            </Drawer>

        </div>
    )
}