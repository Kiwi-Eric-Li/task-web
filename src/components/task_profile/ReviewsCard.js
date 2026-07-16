import {useState} from 'react';
import {
  Paper,
  Stack,
  Typography,
  Skeleton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import RatingSummary from './RatingSummary';
import ReviewCard from "./ReviewCard";


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
                    ) : (
                    <>
                        <Grid container spacing={2}>
                            {
                                visible.map((r) => (
                                    <Grid key={`${r.created_at}-${r.reviewer_userid}`} size={{xs: 12, md: 6}}>
                                        <ReviewCard review={r} role={role} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                        {
                            canShowMore && (
                                <Stack alignItems="center" sx={{pt: 1}}>
                                    <Button variant="outlined" size="small" onClick={() => setVisibleCount(n => Math.min(n + step, reviews.length))}>Show more</Button>
                                </Stack>
                            )
                        }
                    </>)
                }
            </Stack>
            <Dialog open={openAll} onClose={() => setOpenAll(false)} fullWidth maxWidth="md" scroll="paper" PaperProps={{sx: {borderRadius: 3}}}>
                <DialogTitle sx={{pr: 6}}>
                    All reviews ({reviews.length})
                    <IconButton aria-label="close" onClick={() => setOpenAll(false)} sx={{position: 'absolute', right: 8, top: 8}}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {
                            reviews.map((r) => (
                                <Grid key={`${r.reviewer_userid}-${r.created_at}-all`} size={{xs: 12, md: 6}}>
                                    <ReviewCard review={r} role={role} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
        </Paper>
    )
}


