import {
  Paper,
  Stack,
  Typography,
  Skeleton,
  Box,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

export default function AboutCard({bio, loading = false}){

    const hasBio = !!bio && bio.trim().length > 0;



    return (
        <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldIcon fontSize="small" /> Profile
                </Typography>

                {loading ? (
                    <Stack spacing={1}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="70%" />
                    </Stack>
                    ) : hasBio ? (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {bio}
                    </Typography>
                    ) : (
                        <Box
                            sx={{
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: 2.5,
                                textAlign: 'center',
                            }}>
                            <Typography variant="body2" color="text.secondary">
                            -
                            </Typography>
                        </Box>
                    )
                }
            </Stack>
        </Paper>
    )
}
