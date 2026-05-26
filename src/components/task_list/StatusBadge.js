
import { Chip, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";


function normalizeStatus(input) {
    const s = String(input);
    switch (s) {
        case "Open":
            return "Open";
        case "InProgress":
            return "InProgress";
        case "Completed":
            return "Completed";
        case "Matched":
            return "Matched";
        case "Matching":
            return "InProgress";
        case "Cancelled":
            return "Cancelled";
        case "Expired":
            return "Expired";
        default:
            return "Cancelled";
    }
}

function useStatusColors(input) {
    const theme = useTheme();
    const norm = normalizeStatus(input);
    const key = paletteKeyMap[norm];

    if (key === "grey") {
        const main = theme.palette.grey[700];
        return { mainColor: main, bgColor: alpha(main, 0.08) };
    }

    const p = theme.palette[key];
    return { mainColor: p.main, bgColor: alpha(p.main, 0.15) };
}

const paletteKeyMap = {
    Open: "success",
    InProgress: "warning",
    Completed: "primary",
    Matched: "warning",
    Cancelled: "grey",
    Expired: "grey",
};

const labelMap = {
    Open: "Open",
    InProgress: "In Progress",
    Completed: "Completed",
    Matched: "Matching",
    Cancelled: "Cancelled",
    Expired: "Expired",
};

export default function StatusBadge({status, variant}){

    const norm = normalizeStatus(status);
    const { mainColor, bgColor } = useStatusColors(norm);
    const label = labelMap[norm];

    if (variant === "chip") {
        return (
            <Chip
                label={label}
                size="small"
                sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: mainColor,
                    backgroundColor: bgColor,
                }}
            />
        );
    }
    return (
        <Box
            sx={{
                position: "absolute",
                top: 8,
                right: 8,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: mainColor,
                backgroundColor: bgColor,
            }}
        >
            {label}
        </Box>
    )
}



