import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export default function KpiProgress({label, value}){
    let pct = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
    let frac = pct * 100;

    return (
        <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                    {Number.isFinite(value) ? `${Math.round(frac)}%` : '-'}
                </Typography>
            </Stack>
            <LinearProgress variant='determinate' value={frac} sx={{height: 8, borderRadius: 1}}/>
        </Stack>
    )
}