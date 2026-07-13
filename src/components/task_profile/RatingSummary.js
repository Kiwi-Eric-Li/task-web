import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export default function RatingSummary({value, count}){
    const v = typeof value === 'number' ? value : 0;
    
    return (
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Rating
                value={v}
                precision={0.5}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" color="primary" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
            />
            {typeof count === 'number' && (
                <Typography variant="caption" color="text.secondary">
                ({count})
                </Typography>
            )}
        </Stack>
    )
}


