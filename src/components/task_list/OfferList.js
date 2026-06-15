import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { AccessTime, Star, ExpandMore, ExpandLess } from "@mui/icons-material";

import UserRatingInline from "./UserRatingInline";
import TaskAttachments from "./TaskAttachments";
import {formatDateNZ} from "../../utils/time";

const OfferRowItem = ({o}) => {
    
    const theme = useTheme();
    const selected = o?.is_matched === true;

    const borderColor = selected
        ? theme.palette.primary.main
        : theme.palette.success.light;

    const bgColor = selected
        ? alpha(theme.palette.primary.main, 0.05)
        : alpha(theme.palette.success.main, 0.03);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                borderColor: borderColor,
                bgcolor: bgColor,
                transition: "border-color .2s",
            }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    src={o?.user?.avatar_url ?? undefined}
                    sx={{ width: 48, height: 48, flexShrink: 0 }}
                >
                    {o?.user?.username}
                </Avatar>
                <Box flex={1}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        rowGap={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                            {o?.user?.username}
                        </Typography>
                        {selected && (
                            <Chip
                                size="small"
                                color="primary"
                                icon={<Star sx={{ fontSize: 16 }} />}
                                label="Selected by poster"
                            />
                        )}
                    </Stack>
                    
                    <UserRatingInline
                        value={o?.tasker_rating?.avg || 7}
                        count={o?.tasker_rating?.count || 8}
                    />

                    {o?.message && (
                        <Typography
                            variant="body2"
                            sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                        >
                        {o?.message}
                        </Typography>
                    )}

                    {o?.attachments && (JSON.parse(o.attachments).length > 0) && (
                        <Box mt={1}>
                            <TaskAttachments attachments={JSON.parse(o.attachments)} />
                        </Box>
                    )}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        <AccessTime sx={{ fontSize: 14 }} />
                        {formatDateNZ(o?.created_at, { withTime: true })}
                    </Typography>

                </Box>
            </Stack>
        </Paper>
    )
}


export default function OfferList({offers, emptyText}){

    const theme = useTheme();
    const navigate = useNavigate();

    const matched = offers?.find((o) => o?.is_matched === true) ?? null;
    const others = offers?.filter((o) => !o?.is_matched);

    const [openOthers, setOpenOthers] = useState(!matched);

    if (!offers || offers.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                {emptyText}
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            {/* selected offer */}
            {matched && (
                <Paper
                    key={`preferred-${matched.id}`}
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        transition: "border-color .2s",
                    }}
                >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                        src={matched?.user?.avatar_url ?? undefined}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/task/profile/${matched.user_id}`)}
                    >
                        {matched?.user?.username}
                    </Avatar>

                    <Box flex={1}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        rowGap={0.5}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            noWrap
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`/task/profile/${matched.user_id}`)}
                        >
                            {matched?.user?.username}
                        </Typography>

                        <Chip
                            size="small"
                            color="primary"
                            icon={<Star sx={{ fontSize: 16 }} />}
                            label="Selected by poster"
                        />
                    </Stack>

                    <UserRatingInline
                        value={matched?.tasker_rating?.avg || 7}
                        count={matched?.tasker_rating?.count || 8}
                    />

                    {matched.message && (
                        <Typography
                        variant="body2"
                        sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                        >
                        {matched.message}
                        </Typography>
                    )}

                    {!!JSON.parse(matched.attachments)?.length && (
                        <Box mt={1}>
                            <TaskAttachments attachments={JSON.parse(matched.attachments)} />
                        </Box>
                    )}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                        mt: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        }}
                    >
                        <AccessTime sx={{ fontSize: 14 }} />
                        {formatDateNZ(matched.created_at, { withTime: true })}
                    </Typography>
                    </Box>
                </Stack>
            </Paper>
            )}
            
            {/* other offers */}
            {matched && others.length > 0 && (
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Other offers ({others.length})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Poster has already selected a preferred offer
                        </Typography>
                        <Box flex={1} />
                        <IconButton
                            size="small"
                            onClick={() => setOpenOthers((v) => !v)}
                            aria-label={openOthers ? "Collapse" : "Expand"}
                        >
                            {openOthers ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Stack>
                    <Collapse in={openOthers} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 1 }} />
                        <Stack spacing={1.5}>
                            {others.map((o) => {
                                return <OfferRowItem key={o.id} o={o} />
                            })}
                        </Stack>
                    </Collapse>
                </Paper>
            )}

            {!matched &&
                offers.map((o) => <OfferRowItem key={o.id} o={o} />)}
        </Stack>
    )
}