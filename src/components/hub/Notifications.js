import {useState} from 'react';
import {
    Paper,
    Button,
    Typography,
    Box,
    Tabs,
    Tab,
    Divider,
    Skeleton,

} from "@mui/material";
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'

import NotificationItem from './NotificationItem';


function CountPill({ count }) {
    if (!count) return null
    return (
        <Box
            component="span"
            sx={{
                ml: 1,
                px: 1,
                lineHeight: 1.6,
                borderRadius: 1.25,
                fontSize: 12,
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'inline-flex',
                alignItems: 'center',
                minWidth: 18,
                justifyContent: 'center',
            }}
        >
            {count}
        </Box>
    )
}



export default function Notifications(){
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [grouped, setGrouped] = useState(
        {
            "task": {
                "items": [
                    {
                        "id": 694,
                        "type": "task.offer.accepted",
                        "title": "Your offer was accepted",
                        "body": "Your offer on “test_101_clean_carpet” was accepted. Please confirm within 24 hours.",
                        "task_id": 953,
                        "offer_id": 88,
                        "data": {
                            "TaskId": 953,
                            "OfferId": 88,
                            "MatchedAt": "2026-05-06T03:42:07.906593Z",
                            "ConfirmExpires": "2026-05-07T03:42:07.9067101Z",
                            "TaskerProfileId": 256
                        },
                        "is_read": true,
                        "created_at": "2026-05-06T03:42:09.43+00:00",
                        "read_at": "2026-05-06T03:42:31.35+00:00"
                    }
                ],
                "total": 1,
                "unread_total": 0
            },
            "discover": {
                "items": [],
                "total": 0,
                "unread_total": 0
            }
        }
    );

    const taskStream = grouped?.task
    const discoverStream = grouped?.discover

    const taskItems = taskStream?.items ?? []
    const discoverItems = discoverStream?.items ?? []

    const taskUnread = taskStream?.unread_total ?? 0
    const discoverUnread = discoverStream?.unread_total ?? 0

    const allItems =  [...taskItems, ...discoverItems].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );


    const itemsForTab =
        tab === 0
            ? allItems
            : tab === 1
                ? taskItems.map((x) => ({ ...x, __channel: 'task'}))
                : discoverItems.map((x) => ({ ...x, __channel: 'discover'}))




    const makeTabLabel = (text, count) => (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box component="span">{text}</Box>
            <CountPill count={count} />
        </Box>
    )

    const handleMarkAllRead = () => {

    }

    const handleMarkRead = () => {

    }

    const handleDelete = () => {
        
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column',}}>
            <Box 
                sx={{
                    p: 2,
                    // borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    // bgcolor: 'background.paper',
                }}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Stay updated with your latest activity
                </Typography>
            </Box>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        // gap: 2,
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        textColor="inherit"
                        sx={{
                            minHeight: 44,
                            '& .MuiTab-root': { textTransform: 'none', minHeight: 44, fontWeight: 700, color: 'text.primary' },
                            '& .MuiTab-root.Mui-selected': { color: 'text.primary' },
                            '& .MuiTabs-indicator': { height: 2, bgcolor: 'text.primary' },
                        }}
                    >
                        {/* unreadTotal, taskUnread, discoverUnread */}
                        <Tab label={makeTabLabel('All', 1)} />
                        <Tab label={makeTabLabel('My Tasks', 1)} />
                        <Tab label={makeTabLabel('New Posts', 0)} />
                    </Tabs>
                    <Button
                        onClick={handleMarkAllRead}
                        startIcon={<DoneAllOutlinedIcon />}
                        // disabled={!isAuthenticated || unreadTotal === 0}
                        sx={{ textTransform: 'none', color: 'text.primary' }}
                    >
                        Mark all as read
                    </Button>
                </Box>
                <Divider />
                
                {
                    loading ? (
                        <Box sx={{ p: 2 }}>
                            {[...Array(4)].map((_, i) => (
                                <Box key={i} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <Skeleton width="60%" height={24} />
                                    <Skeleton width="92%" height={20} sx={{ mt: 1 }} />
                                    <Skeleton width="30%" height={18} sx={{ mt: 1 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : 
                        itemsForTab.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">You’re all caught up.</Typography>
                            </Box>
                        )
                    : 
                        itemsForTab.map((n, idx) => (
                            <NotificationItem
                                key={n.id ?? `${n.__channel}-${n.created_at}-${idx}`}
                                item={n}
                                onMarkRead={() => !n.is_read && handleMarkRead(n.id)}
                                onDelete={() => handleDelete(n.id)}
                            />
                        ))
                    
                }
                



            </Paper>
        </Box>
    )
}