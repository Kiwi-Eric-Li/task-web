import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { createPortal } from "react-dom";
import {Outlet, Link} from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListSubheader,
  ListItemButton,
  ListItemIcon, 
  Box,
  Container,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PostAddIcon from "@mui/icons-material/PostAdd";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import theme from "../../utils/theme"
import SearchTask from "./SearchTask"
import HowItWorks from "./HowItWorks"
import FAQ from "./FAQ"
import Footer from "./Footer"
import TermsMain from './TermsMain';
import PrivacyMain from './PrivacyMain';
import RecentTask from './RecentTask';
import BackToTop from './BackToTop';
import LoginDialog from '../login/LoginDialog';
import {setUserData} from '../../store/modules/userReducer'
import UserMenu from './UserMenu'

export default function DashboardIndex(){
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.userData || {});

    const [open, setOpen] = React.useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMsg, setAlertMsg] = useState("");

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLoginIn = () => {
        setLoginOpen(true);
    }

    const onClose = () => {
        setLoginOpen(false);
    }

    useEffect(() => {
        let userData = localStorage.getItem("user") || null;
        if(userData !== null){
            userData = JSON.parse(userData);
            // 将数据同步给store
            dispatch(setUserData(userData));
        }
    }, []);



    const snackbar = (
        <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ zIndex: 99999 }}>
            <Alert severity={alertType}>{alertMsg}</Alert>
        </Snackbar>
    );

    return (
        <>
            <ThemeProvider theme={theme}>
                <AppBar position="fixed" sx={{'backgroundColor': 'rgba(255, 255, 255, 0.85)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px -1px 0px inset'}}>
                <Container maxWidth="lg">
                    <Toolbar sx={{display: 'flex', 'alignItems': 'center', justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex'}}>
                        {/* 菜单按钮（小屏显示） */}
                        <IconButton
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', 'width': '40px', 'height': '40px', 'marginRight': '5px'}}
                        >
                        <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', 'justifyContent': 'center', 'alignItems': 'center', fontWeight: 800, letterSpacing: '0.2px', color: 'rgb(38, 38, 38)'}}>
                        <Box sx={{width: '34px', height: '34px', lineHeight: '34px', 'borderRadius': '4px', 'backgroundColor': 'rgb(206, 66, 87)', 'color': '#fff', 'textAlign': 'center'}}>T</Box>
                        <Box sx={{marginLeft: '10px'}} component={Link} to="/">KiwiTasker</Box>
                        <Box sx={{marginLeft: '15px'}} component={Link} to="/task/task-list">Browse tasks</Box>
                        </Box>
                    </Box>
                    
                    {/* 大屏菜单 */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button 
                        variant="contained" 
                        startIcon={<PostAddIcon />} 
                        sx={{ 
                            borderRadius: '50px', 
                            textTransform: 'none', 
                            bgcolor: (t) => t.palette.primary.main, 
                            color: (t) => t.palette.primary.contrastText,
                            boxShadow: 'none',
                            fontWeight: (t) => t.palette.primary.fontWeight }}>
                            Post a task
                        </Button>
                        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                            <Tooltip title="Messages">
                                <MailOutlineIcon sx={{cursor: 'pointer', color: (t) => t.palette.primary.iconColor}} />
                            </Tooltip>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: '20px', marginRight: '20px'}}>
                            <Tooltip title="Notifications">
                                <NotificationsNoneIcon sx={{cursor: 'pointer', color: (t) => t.palette.primary.iconColor}} />
                            </Tooltip>
                        </Box>

                        {
                            userData?.username ? <UserMenu userData={userData} />
                            : <Button 
                                variant="contained" 
                                onClick={handleLoginIn}
                                sx={{
                                    borderRadius: '50px', 
                                    textTransform: 'none', 
                                    bgcolor: (t) => t.palette.primary.contrastText, 
                                    color: (t) => t.palette.primary.main,
                                    border: '1px solid',
                                    borderColor: (t) => t.palette.primary.main,
                                    boxShadow: 'none',
                                    fontWeight: (t) => t.palette.primary.fontWeight }}>
                                Log in
                            </Button>
                        }
                    </Box>
                    </Toolbar>
                </Container>
                
                </AppBar>

                {/* 抽屉菜单（小屏点击打开） */}
                <Drawer 
                anchor="left" 
                open={open} 
                onClose={toggleDrawer} 
                PaperProps={{
                    sx: { width: 320 },
                }}>
                    <Box sx={{display: 'flex', 'flexDirection': 'column',  'justifyContent': 'center', 'alignItems': 'center'}}>
                    <Button 
                        variant="contained" 
                        sx={{ 
                        width: '288px',
                        height: '44px',
                        marginTop: '20px',
                        borderRadius: '50px', 
                        textTransform: 'none', 
                        bgcolor: (t) => t.palette.primary.main, 
                        color: (t) => t.palette.primary.contrastText,
                        boxShadow: 'none',
                        fontWeight: (t) => t.palette.primary.fontWeight }}>
                        Sign in
                    </Button>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: '20px' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            NAVIGATE
                        </ListSubheader>
                        }>
                        <ListItemButton>
                        <ListItemIcon>
                            <MoreVertIcon />
                        </ListItemIcon>
                        <ListItemText primary="Browse task" component={Link} href="/task/task-list"/>
                        </ListItemButton>
                    </List>
                    </Box>
                </Drawer>
                {/* 子路由的渲染位置 */}
                <Box sx={{bgcolor: 'rgb(250, 250, 250)', minHeight: '100vh'}}>
                    <Outlet />
                </Box>
            </ThemeProvider>
            <BackToTop />
            <LoginDialog open={loginOpen} onClose={onClose} setOpenAlert={setOpenAlert} setAlertType={setAlertType} setAlertMsg={setAlertMsg}/>
            {openAlert && createPortal(snackbar, document.body)}
        </>
    )
}