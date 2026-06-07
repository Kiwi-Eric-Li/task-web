import {useState} from 'react'

import {
  Box,
  Stack,
  Typography,
  Divider,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Collapse,
  Tooltip,
} from "@mui/material";
import { ExpandMore, ExpandLess, InfoOutlined } from "@mui/icons-material";


import OwnerOfferList from "./OwnerOfferList";

export default function OwnerOfferPanel({taskId, status, offers, onMutate}){

    const theme = useTheme();
    const [sortBy, setSortBy] = useState("latest");
    const [onlyWithAtt, setOnlyWithAtt] = useState(false);

    const phase =
        status === "Open"
        ? "open"
        : status === "Matching"
            ? "matching"
            : status === "InProgress"
            ? "inprogress"
            : status === "Completed"
                ? "completed"
                : "other";

    const allowActions = phase === "open" || phase === "matching";
    const preferred = offers?.find((o) => o.is_matched) ?? null;
    const hasMatched = !!preferred;

    const pinnedTitle =
        phase === "inprogress" || phase === "completed"
        ? "Matched offer"
        : "Preferred offer";

    return (
        <Box sx={{ p: { xs: 1.5, md: 2 } }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
            >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={700}>
                        Offers
                    </Typography>
                    <Chip size="small" variant="outlined" label={`${offers?.length ?? 0}`} />
                    {hasMatched && (
                        <Chip
                        size="small"
                        color={phase === "matching" ? "primary" : "success"}
                        label={phase === "matching" ? "Preferred selected" : "Matched"}
                        sx={{ ml: 0.5 }}
                        />
                    )}
                </Stack>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <TextField
                        select
                        size="small"
                        label="Sort"
                        InputLabelProps={{ shrink: true }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{
                        minWidth: { xs: 120, sm: 130 },
                        "& .MuiInputBase-root": {
                            height: 36,
                            alignItems: "center",
                        },
                        }}
                    >
                        <MenuItem value="latest">Newest</MenuItem>
                        <MenuItem value="priceAsc">Price ↑</MenuItem>
                        <MenuItem value="priceDesc">Price ↓</MenuItem>
                    </TextField>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={onlyWithAtt ? "att" : ""}
                        onChange={() => setOnlyWithAtt((p) => !p)}
                        sx={{
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        "& .MuiToggleButton-root": {
                            padding: "0 10px",
                            minHeight: 36,
                            lineHeight: 1.2,
                        },
                        }}
                    >
                        <ToggleButton value="att">With attachments</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>

            
            <Divider sx={{ my: 2 }} />
            {preferred && (
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}
                    >
                        {pinnedTitle}
                    </Typography>
                    <OwnerOfferList
                        taskId={taskId}
                        offers={[preferred]}
                        hasMatched={hasMatched}
                        onMutate={onMutate}
                        status={status}
                        allowActions={allowActions}
                    />
                    <Divider sx={{ my: 2 }} />
                </Box>
            )}
        


        </Box>
    )
}