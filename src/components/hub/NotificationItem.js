
import {useState, useEffect} from 'react';
import {
    Button,
    Typography,
    Box,
    Stack,

} from "@mui/material";
import { alpha } from "@mui/material/styles";

import {formatSinceNow} from "../../utils/time";

export default function NotificationItem({ item, onMarkRead, onDelete }){
    const [relative, setRelative] = useState('');

    const isRead = item.is_read


    const handleRowClick = () => {

    }

    useEffect(() => {
        const update = () => setRelative(formatSinceNow(item.created_at))
        update()
        const id = setInterval(update, 60_000)
        return () => clearInterval(id)
    }, [item.created_at])


    return (
        <Box
            onClick={handleRowClick}
            sx={(t) => ({
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                cursor: 'pointer',
                bgcolor: isRead ? alpha(t.palette.background.default, 0.3) : t.palette.background.paper,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    bgcolor: isRead ? alpha(t.palette.background.default, 0.5) : alpha(t.palette.primary.main, 0.04),
                    transform: 'translateX(2px)',
                },
            })}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, mt: 1, flexShrink: 0 }}>
                    <Box
                        sx={(t) => ({
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: (t) =>  t.palette.primary.main,
                            visibility: isRead ? 'hidden' : 'visible',
                            boxShadow: isRead ? 'none' : `0 0 8px ${alpha(t.palette.primary.main, 0.4)}`,
                            transition: 'box-shadow 0.2s ease-in-out',
                        })}
                    />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body1"
                        sx={(t) => ({
                            fontWeight: isRead ? 500 : 600,
                            color:(t) => isRead ? t.palette.text.secondary : t.palette.text.primary,
                            opacity: isRead ? 0.65 : 1,
                            transition: 'all 0.2s ease-in-out',
                        })}
                    >
                        {item.title}
                    </Typography>

                    {!!item.body && (
                        <Typography
                            variant="body1"
                            sx={(t) => ({
                                color:(t) => isRead ? t.palette.text.disabled : t.palette.text.secondary,
                                opacity: isRead ? 0.5 : 0.8,
                                mt: 0.5,
                                transition: 'all 0.2s ease-in-out',
                            })}
                        >
                            {item.body}
                        </Typography>
                    )}

                    {/* Footer: left = time, right = actions */}
                    <Box
                        sx={{
                            mt: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={(t) => ({
                                color: (t) => isRead ? t.palette.text.disabled : t.palette.text.secondary,
                                opacity: isRead ? 0.5 : 0.85,
                                transition: 'all 0.2s ease-in-out',
                            })}
                            suppressHydrationWarning
                        >
                            {relative || ''}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="text"
                                color="inherit"
                                onClick={(e) => { e.stopPropagation(); onMarkRead?.() }}
                                disabled={isRead}
                                sx={{ textTransform: 'none', fontWeight: 700, color: 'text.primary' }}
                            >
                                Mark read
                            </Button>

                            <Button
                                size="small"
                                variant="text"
                                color="primary"
                                onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}