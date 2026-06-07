import {useState} from 'react'

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


import TaskAttachments from "./TaskAttachments";

const OfferRowItem = ({o}) => {
    const theme = useTheme();
    const selected = o.is_matched === true;

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
                    src={o.user?.avatar_url ?? undefined}
                    sx={{ width: 48, height: 48, flexShrink: 0 }}
                >
                    {o.user?.username}
                </Avatar>
                <Box flex={1}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        rowGap={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                            {o.user?.username}
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
                    
                    {o.message && (
                        <Typography
                            variant="body2"
                            sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                        >
                        {o.message}
                        </Typography>
                    )}

                    {JSON.parse(o.attachments)?.length && (
                        <Box mt={1}>
                            <TaskAttachments attachments={JSON.parse(o.attachments)} />
                        </Box>
                    )}


                </Box>
            </Stack>
        </Paper>
    )
    
}



export default function OfferList({offers, emptyText}){


    if (!offers || offers.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                {emptyText}
            </Typography>
        );
    }

    const matched = offers.find((o) => o.is_matched === true) ?? null;
    const others = offers.filter((o) => !o.is_matched);

    // const [openOthers, setOpenOthers] = useState(!matched);

    return (
        <Stack spacing={2}>

            {!matched &&
                offers.map((o) => <OfferRowItem key={o.id} o={o} />)}
        </Stack>
    )
}