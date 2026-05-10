import {useState, useEffect} from 'react'
import {Outlet, useLocation, Link } from "react-router-dom"
import {
    Box,
    Button,
    Typography,
    Drawer,
    ButtonBase,
    useTheme,
    Container
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import theme from "../../utils/theme"


export default function HubIndex(){
    const location = useLocation();
    const [activeKey, setActiveKey] = useState('');

    const [menuList, setMenuList] = useState([
        {
            key: 'dashboard',
            label: 'Dashboard',
            href: '/task/dashboard',
            icon: <DashboardOutlinedIcon fontSize='small' />,
        },
        {
            key: 'messages',
            label: 'Messages',
            href: '/task/hub/messages',
            icon: <MailOutlineIcon fontSize='small' />,
        },
        {
            key: 'notifications',
            label: 'Notifications',
            href: `/task/hub/notifications`,
            icon: <NotificationsNoneOutlinedIcon fontSize='small' />,
        },
        {
            key: 'settings',
            label: 'Settings',
            href: `/task/hub/settings`,
            icon: <SettingsOutlinedIcon fontSize='small' />,
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlinedIcon fontSize='small' />,
        },
    ]);

    const bgSidebar = theme.palette.background.paper;
    const borderCol = theme.palette.divider;
    const textDefault = theme.palette.text.primary;
    const activeBg = theme.palette.primary.main;
    const activeText = theme.palette.primary.contrastText;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    }

    useEffect(() => {
        if(location.pathname.includes('dashboard')){
            setActiveKey('dashboard');
        }else if(location.pathname.includes('messages')){
            setActiveKey('messages');
        }else if(location.pathname.includes('notifications')){
            setActiveKey('notifications');
        }else if(location.pathname.includes('settings')){
            setActiveKey('settings');
        }
        


    }, [location.pathname]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{paddingTop: '90px', paddingBottom: '32px', }}>
                <Container maxWidth="lg" sx={{display: 'flex'}}>
                    <Box
                        sx={{
                            width: 256,
                            height: 'calc(100vh - 90px - 32px)',
                            position: 'sticky',
                            top: '90px',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: (t) => t.palette.background.paper,
                            borderRight: (t) => `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            ml: '24px'
                        }}
                    >
                        <Box
                            sx={{
                                p: 3,
                                borderBottom: (t) => `1px solid ${theme.palette.divider}`,
                                height: 64,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h2' sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                Account
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                            {menuList.map((it) => {
                                const selected = activeKey === it.key;

                                // const count =
                                //     it.key === 'messages'
                                //         ? (computedMessageCount || messageCount)
                                //         : it.key === 'notifications'
                                //             ? notificationCount
                                //             : 0;
                                const count = 3;

                                const rightBadge =
                                    count > 0 ? (
                                        <Box
                                            component='span'
                                            sx={{
                                                ml: 'auto',
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: 1,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                lineHeight: 1.6,
                                                bgcolor: selected ? activeText : activeBg,
                                                color: selected ? activeBg : activeText,
                                            }}
                                        >
                                            {count > 99 ? '99+' : count}
                                        </Box>
                                    ) : null;

                                // Logout is a button, others link
                                if (it.key === 'logout') {
                                    return (
                                        <ButtonBase
                                            key={it.key}
                                            onClick={handleLogout}
                                            component='button'
                                            sx={{
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                height: 44,
                                                mb: 0.5,
                                                px: 2,
                                                borderRadius: 1,
                                                gap: 1.25,
                                                textAlign: 'left',
                                                textDecoration: 'none',
                                                color: textDefault,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                },
                                            }}
                                            aria-label='Logout'
                                        >
                                            {it.icon}
                                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                {it.label}
                                            </Typography>
                                        </ButtonBase>
                                    );
                                }

                                return (
                                    <Button
                                        key={it.key}
                                        fullWidth
                                        to={it.href} 
                                        component={Link}
                                        prefetch
                                        startIcon={it.icon}
                                        // onMouseUp={onClose}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            height: 44,
                                            mb: 0.5,
                                            textTransform: 'none',
                                            borderRadius: 1,
                                            px: 2,
                                            color: selected ? activeText : textDefault,
                                            bgcolor: selected ? activeBg : 'transparent',
                                            '&:hover': {
                                                bgcolor: selected ? activeBg : theme.palette.action.hover,
                                                color: selected ? activeText : textDefault,
                                            },
                                        }}
                                        aria-current={selected ? 'page' : undefined}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                sx={{ fontWeight: selected ? 600 : 500, flex: 1 }}
                                            >
                                                {it.label}
                                            </Typography>
                                            {rightBadge}
                                        </Box>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                    <Box sx={{mx: '24px', flex: 1}}>
                        <Outlet />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}