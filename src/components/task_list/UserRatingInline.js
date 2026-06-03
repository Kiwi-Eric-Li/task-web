
import { Box, Typography } from "@mui/material";
import Star from "@mui/icons-material/Star";


export default function UserRatingInline({ value, count }){
    if (!value) return null;

    const avg = (Math.round(value * 10) / 10).toFixed(1);

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.1 }}>
            <Typography variant="caption" color="text.secondary" component="span" fontSize={14}>
                {avg}
            </Typography>
            <Star color="warning" sx={{ fontSize: 18 }} />
            <Typography variant="caption" color="text.secondary" component="span" fontSize={14}>
                ({count})
            </Typography>
        </Box>
    );
}

