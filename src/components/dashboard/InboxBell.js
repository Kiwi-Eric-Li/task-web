import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Tab,
  Tabs,
  ThemeProvider,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'

import {tokenService} from "../../utils/token"
import request from "../../utils/request"
import {SignalREvents} from "../../utils/signalr/event_names";
import taskNotificationHub from "../../utils/signalr/task_notification_hub";
import {taskTheme} from "../../utils/task_theme";
import { formatInboxTime } from '../utils/time'


export default function InboxBell(){
    const navigate = useNavigate();
    const token = tokenService.getAccessToken();
    const [tooltipTitle, setTooltipTitle] = useState("Sign in to view notifications");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [tab, setTab] = useState(0);
    const [unread, setUnread] = useState(0);
    const [allItems, setAllItems] = useState([]);
    const [taskItems, setTaskItems] = useState([]);
    const [discoverItems, setDiscoverItems] = useState([]);
    const taskUnread = 0;
    const discoverUnread = 0;
    const loading = false;

    const notifyHandler = (data) => {
        console.log("===========notifyHandler===============", data);
    }

    useEffect(()=>{
        if(token == null) return;

        setTooltipTitle("Notifications");
        const init = async ()=>{
            await getUnReadNotify();
        }
        init();

        taskNotificationHub.on(SignalREvents.Notify, notifyHandler);

        return () => {
            taskNotificationHub.off(SignalREvents.Notify, notifyHandler);
        }
        
    }, [token]);

    // get unread notifications of currently logged-in user
    const getUnReadNotify = async () => {
        const res = await request.get("/task-notifications/unread-count");
        console.log("res=======getUnReadNotify======", res);
        if(res.code === 0){
            res.data > 0 && setUnread(res.data);
        }
    }

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget)
        if (!token) return
        // void groupedQuery.refetch()
    }
    const handleClose = () => setAnchorEl(null);

    const handleMarkAllRead = () => {

    }

    const handleMarkRead = () => {

    }

    const renderRow = (n) => {
        const isRead = n.is_read
        return (
            <MenuItem
                key={n.id ?? `${n.__channel}-${n.created_at}`}
                onClick={() => {
                    if (!n.is_read) handleMarkRead(n.id)
                    if (n.task_id) navigate(`/task/task-list?taskId=${n.task_id}`)
                    handleClose()
                }}
                dense
                sx={(t) => ({
                    alignItems: 'flex-start',
                    gap: 1,
                    py: 2,
                    px: 2.5,
                    position: 'relative',
                    bgcolor: isRead ? alpha(t.palette.background.default, 0.3) : t.palette.background.paper,
                    borderBottom: `1px solid ${t.palette.divider}`,
                    overflowX: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '& *': { wordBreak: 'break-word', hyphens: 'auto' },
                    '&:hover': {
                        bgcolor: isRead
                        ? alpha(t.palette.background.default, 0.5)
                        : alpha(t.palette.primary.main, 0.04),
                        transform: 'translateX(2px)',
                    },
                    '&:last-child': {
                        borderBottom: 'none',
                    },
                })}
            >
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        px: 2
                    }}
                >
                    <Typography
                        sx={(t) => ({
                            fontSize: '0.9375rem',
                            fontWeight: isRead ? 500 : 600,
                            lineHeight: 1.4,
                            color: isRead ? t.palette.text.secondary : t.palette.text.primary,
                            flex: 1,
                            minWidth: 0,
                            opacity: isRead ? 0.65 : 1,
                            transition: 'all 0.2s ease-in-out',
                        })}
                    >
                        {n.title}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={(t) => ({
                            color: isRead ? t.palette.text.disabled : t.palette.text.secondary,
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            flexShrink: 0,
                            opacity: isRead ? 0.5 : 0.85,
                            letterSpacing: '0.01em',
                            transition: 'all 0.2s ease-in-out',
                        })}
                    >
                        {formatInboxTime(n.created_at)}
                    </Typography>
                </Box>

                {n.body && (
                    <Typography
                    variant="body2"
                    sx={(t) => ({
                        fontSize: '0.8125rem',
                        color: isRead ? t.palette.text.disabled : t.palette.text.secondary,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        lineHeight: 1.5,
                        opacity: isRead ? 0.5 : 0.8,
                        transition: 'all 0.2s ease-in-out',
                        px: 2
                    })}
                    >
                        {n.body}
                    </Typography>
                )}
                </Box>

                <Box
                sx={(t) => ({
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: !isRead ? t.palette.primary.main : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: !isRead ? `0 0 8px ${alpha(t.palette.primary.main, 0.4)}` : 'none',
                })}
                />
            </MenuItem>
        )
    }

    const renderList = (items) => {
        if (loading) {
            return (
                <Box sx={{ px: 2.5, py: 2 }}>
                {[...Array(4)].map((_, i) => (
                    <Box key={i} sx={{ py: 2, display: 'flex', gap: 1.5 }}>
                    <Skeleton variant="circular" width={6} height={6} sx={{ mt: 1 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="85%" height={24} />
                        <Skeleton variant="text" width="95%" height={20} sx={{ mt: 0.5 }} />
                    </Box>
                    </Box>
                ))}
                </Box>
            )
        }
        if (!token) {
            return (
                <Box
                    sx={(t) => ({
                        px: 3,
                        py: 8,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    })}
                >
                <NotificationsNoneIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Sign in to view notifications
                </Typography>
                </Box>
            )
        }
        if (items.length === 0) {
            return (
                <Box
                    sx={{
                        px: 3,
                        py: 8,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <DoneAllOutlinedIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        You're all caught up
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                        No new notifications
                    </Typography>
                </Box>
            )
        }
        return <Box>{(items).map(renderRow)}</Box>
    }

    return (
        <ThemeProvider theme={taskTheme}>
            <Tooltip title={tooltipTitle}>
                <span>
                    <IconButton
                        color="inherit"
                        onClick={handleOpen}
                        aria-label={tooltipTitle}
                        aria-controls={open ? 'inbox-bell-menu' : undefined}
                        aria-haspopup="true"
                        sx={{
                            position: 'relative',
                            zIndex: (t) => t.zIndex.appBar + 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Badge
                            color="error"
                            badgeContent={unread}
                            max={99}
                            slotProps={{
                                badge: {
                                sx: {
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.6875rem',
                                },
                                },
                            }}
                        >
                            <NotificationsNoneIcon />
                        </Badge>
                    </IconButton>
                </span>
            </Tooltip>
            
            <Menu
                id="inbox-bell-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                disableScrollLock
                slotProps={{
                paper: {
                    sx: (t) => ({
                        width: 440,
                        maxHeight: 'calc(100vh - 100px)',
                        borderRadius: 2.5,
                        bgcolor: t.palette.background.paper,
                        boxShadow: '0px 16px 48px rgba(0,0,0,0.12), 0px 4px 16px rgba(0,0,0,0.08)',
                        mt: 1.5,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${t.palette.divider}`,
                        }),
                    },
                }}
            >
                <Box
                sx={(t) => ({
                    px: 3,
                    pt: 2.5,
                    pb: 2,
                    borderBottom: `1px solid ${t.palette.divider}`,
                    bgcolor: t.palette.background.paper,
                })}
                >
                    <Typography
                        variant="h6"
                        sx={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        }}
                    >
                        Notifications
                    </Typography>
                </Box>

                <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={(t) => ({
                    px: 2,
                    minHeight: 52,
                    bgcolor: alpha(t.palette.background.default, 0.4),
                    borderBottom: `1px solid ${t.palette.divider}`,
                    '& .MuiTabs-indicator': {
                    height: 2,
                    borderRadius: '2px 2px 0 0',
                    bgcolor: t.palette.primary.main,
                    },
                    '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    minHeight: 52,
                    color: t.palette.text.secondary,
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    '&.Mui-selected': {
                        color: t.palette.primary.main,
                    },
                    '&:hover': {
                        color: t.palette.text.primary,
                        bgcolor: alpha(t.palette.text.primary, 0.04),
                    },
                    },
                })}
                >
                <Tab
                    label="All"
                    iconPosition="end"
                    icon={
                    unread > 0 ? (
                        <Box
                        component="span"
                        sx={(t) => ({
                            ml: 0.75,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 2,
                            bgcolor: t.palette.primary.main,
                            color: t.palette.primary.contrastText,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            lineHeight: 1,
                            minWidth: 20,
                            height: 18,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                        >
                        {unread > 99 ? '99+' : unread}
                        </Box>
                    ) : undefined
                    }
                />
                <Tab
                    label="My Tasks"
                    iconPosition="end"
                    icon={
                    taskUnread > 0 ? (
                        <Box
                        component="span"
                        sx={(t) => ({
                            ml: 0.75,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 2,
                            bgcolor: t.palette.primary.main,
                            color: t.palette.primary.contrastText,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            lineHeight: 1,
                            minWidth: 20,
                            height: 18,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                        >
                            {taskUnread > 99 ? '99+' : taskUnread}
                        </Box>
                    ) : undefined
                    }
                />
                <Tab
                    label="New Posts"
                    iconPosition="end"
                    icon={
                    discoverUnread > 0 ? (
                        <Box
                        component="span"
                        sx={(t) => ({
                            ml: 0.75,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 2,
                            bgcolor: t.palette.primary.main,
                            color: t.palette.primary.contrastText,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            lineHeight: 1,
                            minWidth: 20,
                            height: 18,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                        >
                        {discoverUnread > 99 ? '99+' : discoverUnread}
                        </Box>
                    ) : undefined
                    }
                />
                </Tabs>

                <Box
                sx={(t) => ({
                    flex: 1,
                    maxHeight: 'min(60vh, 440px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    bgcolor: t.palette.background.default,
                    minHeight: 0,
                    '&::-webkit-scrollbar': {
                    width: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                    bgcolor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                    bgcolor: alpha(t.palette.text.secondary, 0.2),
                    borderRadius: 3,
                    '&:hover': {
                        bgcolor: alpha(t.palette.text.secondary, 0.3),
                    },
                    },
                })}
                >
                {tab === 0 && renderList(allItems)}
                {tab === 1 && renderList(taskItems.map((x) => ({ ...x, __channel: 'task' })))}
                {tab === 2 && renderList(discoverItems.map((x) => ({ ...x, __channel: 'discover' })))}
                </Box>

                <Box
                    sx={(t) => ({
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        bgcolor: t.palette.background.paper,
                        borderTop: `1px solid ${t.palette.divider}`,
                        flexShrink: 0,
                    })}
                >
                    <Button
                        onClick={handleMarkAllRead}
                        startIcon={<DoneAllOutlinedIcon sx={{ fontSize: 18 }} />}
                        disabled={!token || unread === 0}
                        sx={(t) => ({
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: t.palette.text.secondary,
                        px: 1.5,
                        '&:hover': {
                            bgcolor: alpha(t.palette.text.secondary, 0.08),
                            color: t.palette.text.primary,
                        },
                        '&.Mui-disabled': {
                            opacity: 0.4,
                        },
                        })}
                    >
                        Mark all read
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleClose()
                            navigate('/task/hub/notifications')
                        }}
                        sx={(t) => ({
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            px: 2.5,
                            py: 1,
                            borderRadius: 1.5,
                            bgcolor: t.palette.primary.main,
                            color: t.palette.primary.contrastText,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: t.palette.primary.main,
                                opacity: 0.9,
                                boxShadow: `0 4px 12px ${alpha(t.palette.primary.main, 0.3)}`,
                            },
                        })}
                    >
                        View all
                    </Button>
                </Box>
            </Menu>
        </ThemeProvider>
    )
}