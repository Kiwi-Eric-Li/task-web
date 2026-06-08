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

    const [openOthers, setOpenOthers] = useState(!hasMatched);

    const banner = hasMatched &&
        (() => {
            const base = {
                mt: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: 1,
            };
            if (phase === "matching") {
                return (
                    <Box
                        sx={{
                        ...base,
                        backgroundColor: alpha(theme.palette.info.main, 0.06),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.22)}`,
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <InfoOutlined fontSize="small" color="info" />
                            <Typography variant="body2" color="text.secondary">
                                You have selected a preferred offer (waiting for the tasker to confirm).
                                You can cancel it below if needed.
                            </Typography>
                        </Stack>
                    </Box>
                );
            }
            if (phase === "inprogress" && preferred) {
                return (
                <>
                    <Box
                        sx={{
                            ...base,
                            backgroundColor: alpha(theme.palette.success.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <InfoOutlined fontSize="small" color="success" />
                            <Typography variant="body2" color="text.secondary">
                            You’re matched with <strong>{preferred?.user?.username}</strong>. Work is in progress.
                            </Typography>
                        </Stack>
                    </Box>

                </>
                );
            }
            if (phase === "completed" && preferred) {
                return (
                <Box
                    sx={{
                        ...base,
                        backgroundColor: alpha(theme.palette.primary.main, 0.07),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <InfoOutlined fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            This task was completed with{" "}
                            <strong>{preferred?.user?.username}</strong>.
                        </Typography>
                    </Stack>
                </Box>
                );
            }
            return null;
        })();

    const filtered = (offers ?? [])
        .filter((o) => !onlyWithAtt || (JSON.parse(o.attachments)?.length ?? 0) > 0)
        .sort((a, b) => {
            if (sortBy === "latest")
                return +new Date(b.created_at) - +new Date(a.created_at);
            if (sortBy === "priceAsc") return (a.price ?? 0) - (b.price ?? 0);
            return (b.price ?? 0) - (a.price ?? 0);
        });

    const others = preferred
        ? filtered.filter((o) => o.id !== preferred.id)
        : filtered;

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
            
            {banner}
            
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
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                    Other offers
                </Typography>
                <Chip size="small" variant="outlined" label={others.length} />
                <Box flex={1} />
                {others.length > 0 && (
                    <Tooltip title={openOthers ? "Collapse" : "Expand"}>
                        <IconButton
                            size="small"
                            onClick={() => setOpenOthers((v) => !v)}
                            aria-label={openOthers ? "Collapse list" : "Expand list"}
                        >
                        {openOthers ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
            
            <Collapse in={openOthers} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        maxHeight: 420,
                        overflowY: "auto",
                        pr: 0.5,
                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-thumb": {
                        backgroundColor: alpha(theme.palette.text.primary, 0.2),
                        borderRadius: 3,
                        },
                    }}>
                    <OwnerOfferList
                        taskId={taskId}
                        offers={others}
                        hasMatched={hasMatched}
                        onMutate={onMutate}
                        status={status}
                        allowActions={allowActions}
                    />
                </Box>
            </Collapse>
            {!offers?.length && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                No offers yet.
                </Typography>
            )}
        </Box>
    )
}