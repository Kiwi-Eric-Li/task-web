import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  ExpandLess,
  ExpandMore,
  Forum as ForumIcon,
  ArrowRightAlt,
} from "@mui/icons-material";

import TaskAttachments from "./TaskAttachments";
import ReplyInput from "./ReplyInput";
import { formatDateNZ } from "../../utils/time";

const INDENT_PX = 16;
const BORDER_KEYS = ["primary", "success", "info", "warning"];


const Container = styled(Paper, {
  shouldForwardProp: (p) => p !== "level" && p !== "borderKey",
})(({ theme, level, borderKey }) => ({
  position: "relative",
  padding: theme.spacing(1.5, 2),
  backgroundColor: alpha(theme.palette.grey[100], 0.55),
  marginLeft: level * INDENT_PX,
  borderLeft: `4px solid ${alpha(theme.palette[borderKey].main, 0.6)}`,
  borderRadius: theme.shape.borderRadius,
}));

export default function CommentItem({ c, level, taskId, isPoster, opened, parentName, onToggle, onMutate }){
    const navigate = useNavigate();
    const theme = useTheme();
    const borderKey = BORDER_KEYS[(level - 1) % BORDER_KEYS.length] ?? "primary";
    const posterColor = "#F1C21B";

    const [replying, setReplying] = useState(false);

    return (
        <Container elevation={0} level={level} borderKey={borderKey}>
            <Stack direction="row" spacing={1.5}>
                <Avatar
                    src={c?.user?.avatar_url ?? undefined}
                    alt={c?.user?.username}
                    sx={{
                        width: 34,
                        height: 34,
                        bgcolor: isPoster ? posterColor : theme.palette[borderKey].main,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/task/profile/${c.commenter_user_id}`)}
                >
                    {c?.user?.username}
                </Avatar>
                <Box flex={1} minWidth={0}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        flexWrap="wrap"
                        columnGap={1}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color={isPoster ? posterColor : "text.primary"}
                            sx={{ display: "flex", alignItems: "center", gap: .3 }}
                        >
                            <Box
                                component="span"
                                sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/task/profile/${c.commenter_user_id}`)}
                            >
                                {c?.user?.username}
                            </Box>
                            {parentName && (
                            <>
                                <ArrowRightAlt fontSize="inherit" sx={{ opacity: .6 }} />
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    fontWeight={500}
                                    color="text.secondary"
                                >
                                    {parentName}
                                </Typography>
                            </>
                            )}
                        </Typography>
                        {c.children?.length ? (
                            <IconButton
                                size="small"
                                onClick={onToggle}
                                aria-label={opened ? "Collapse replies" : "Expand replies"}
                                sx={{ mt: -0.5 }}
                            >
                                {opened ? (
                                    <ExpandLess fontSize="small" />
                                ) : (
                                    <ExpandMore fontSize="small" />
                                )}
                            </IconButton>
                        ) : null}
                    </Stack>
                    <Typography
                        variant="body2"
                        sx={{ mt: 0.5, whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                    >
                        {c.content}
                    </Typography>
                    {c.attachments?.length ? (
                        <Box mt={1}>
                            <TaskAttachments attachments={c.attachments} />
                        </Box>
                    ) : null}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.8 }}
                        color="text.secondary"
                    >
                        <AccessTime sx={{ fontSize: 15 }} />
                        <Typography variant="caption" sx={{lineHeight: 1}}>
                            {formatDateNZ(c.created_at, { withTime: true })}
                        </Typography>
                        {isPoster && (
                            <Chip
                                label="Poster"
                                size="small"
                                color="warning"
                                sx={{ fontSize: 10, ml: 0.5, fontWeight: 'bold', 'bgcolor': '#F1C21B' }}
                            />
                        )}
                        <Box flex={1} />
                        <IconButton
                            size="small"
                            onClick={() => setReplying((r) => !r)}
                            color={replying ? "primary" : "default"}
                            sx={{ transition: ".15s" }}
                        >
                            <ForumIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    {replying && (
                        <ReplyInput
                            taskId={taskId}
                            parentId={c.id}
                            onCancel={() => setReplying(false)}
                            onSuccess={() => {
                                setReplying(false);
                                onMutate();
                            }}
                        />
                    )}
                </Box>
            </Stack>
        </Container>
    )
}