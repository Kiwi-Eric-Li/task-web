
import {useNavigate} from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  Collapse,
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


import { formatDateNZ } from "../../utils/time";
const MAX_LEVEL = 1;
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
    const posterColor = theme.palette.warning.main;

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
                </Box>    
            </Stack>
        </Container>
    )
}