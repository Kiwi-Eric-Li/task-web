import {useState} from 'react';
import {
  Paper,
  Stack,
  Typography,
  Skeleton,
  Box,
  Grid,
  Button
} from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import RatingSummary from './RatingSummary';


export default function ReviewsCard({ role, reviews, ratingSummary, loading = false }){

    const initialCount = 5;
    const step = 5;
    const [visibleCount, setVisibleCount] = useState(initialCount);

    const canShowMore = visibleCount < reviews.length;
    const visible = reviews.slice(0, Math.min(visibleCount, reviews.length));
    const showHeaderCtas = reviews.length > initialCount;

    const [openAll, setOpenAll] = useState(false);


    return (
        <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReviewsIcon fontSize="small" /> Reviews ({reviews.length})
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <RatingSummary value={ratingSummary.value} count={ratingSummary.count} />
                        {showHeaderCtas && (
                            <>
                               {
                                canShowMore && (
                                    <Button size="small" onClick={() => setVisibleCount((n) => Math.min(n + step, reviews.length))}>Show more</Button>
                                )}
                                <Button size="small" onClick={()=> setOpenAll(true)}>See all</Button>
                            </>
                        )}
                    </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Feedback left by others when this user acted as a {role}.
                </Typography>

                {
                    loading ? (
                        <Grid container spacing={2}>
                         {
                            Array.from({length: initialCount}).map((_, i) => (
                                <Grid key={`skeleton-${i}`} size={{xs: 12, md: 6}}>
                                    <Paper variant="outlined" sx={{p: 2, borderRadius: 3}}>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 1}}>
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <Stack sx={{flex: 1}}>
                                                <Skeleton variant="text" width="40%" />
                                                <Skeleton variant="text" width="20%" />
                                            </Stack>
                                            <Skeleton variant="text" width="70%" />
                                            <Skeleton variant="text" width="90%" />
                                            <Skeleton variant="text" width="60%" />
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))
                         }






                        </Grid>) : reviews.length === 0 ? (
                    <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                        No reviews yet...
                        </Typography>
                    </Paper>
                    ) : (<div></div>)
                }


            </Stack>
        </Paper>
    )
}


