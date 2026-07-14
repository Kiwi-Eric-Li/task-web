import {useState} from 'react';
import {
  Paper,
  Stack,
  Typography,
  Skeleton,
  Box,
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





                    </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Feedback left by others when this user acted as a {role}.
                </Typography>

                {
                    loading ? (<div></div>) : reviews.length === 0 ? (
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


