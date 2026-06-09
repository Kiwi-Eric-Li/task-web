import {useState, useMemo, useEffect, useRef} from "react";
import {useSearchParams, useNavigate} from "react-router-dom"
import useSWRInfinite from "swr/infinite";
import {
    Box, 
    Container, 
    useMediaQuery,
    useTheme,
    Typography,
    List,
    ListItemButton,
    CircularProgress,
    Avatar,
    Stack,
    styled,
    Badge,
    Chip,

} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  AttachMoney,
  Groups,
  ChatBubbleOutline,
  Public,
  Place,
} from "@mui/icons-material";
import { ThemeProvider } from '@mui/material/styles';

import theme from "../../utils/theme"
import TaskFilterBar from "./TaskFilterBar"
import request from "../../utils/request"
import {formatDateNZ} from "../../utils/time"
import TaskMap from "./TaskMap"
import StatusBadge from "./StatusBadge"
import TaskDetail from "./TaskDetail"


const rightPaneSx = {
  flex: { md: '0 0 62%', lg: '0 0 65%' },
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflowY: 'auto',
}

const PAGE_SIZE = 20;

const fetcher = async (url) => {
  try {
    const res = await request.get(url);
    if(res.code === 0){
        return res;
    }
  } catch (err) {
    console.error(err);
  }
};

const Item = styled(ListItemButton)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2, 0, 2, 1.5),
  margin: theme.spacing(1, 0),
  minHeight: 118,
  alignItems: "flex-start",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: "box-shadow .2s, border-color .2s",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    boxShadow: theme.shadows[3],
    background: theme.palette.grey[100],
    borderColor: theme.palette.primary.light,
  },
  "&.Mui-selected": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    background: theme.palette.background.paper,
  },
}));

export default function TaskList(){
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const listRef = useRef(null);
    const detailRef = useRef(null);
    const loadingRef = useRef(false);

    const [searchTitle, setSearchTitle] = useState("");
    const loadMoreRef = useRef(null);

    const [params] = useSearchParams();
    const selectedId = params.get("taskid");
    const navigate = useNavigate();
    
    const handleFilterChange = (title) => {
        setSearchTitle(title);
        console.log("searchTitle======", title);
    }

    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useSWRInfinite(
        (index, prevPageData) => {
            if (prevPageData && prevPageData.data.length === 0) return null;
            return `/tasks?page_num=${index + 1}&page_size=${PAGE_SIZE}&title=${encodeURIComponent(searchTitle || "")}`;
        },
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const tasks = useMemo(() => {
        if (!data) return [];

        return data?.flatMap(page => page.data);
    }, [data]);

    const isReachingEnd = useMemo(() => {
        if (!data || data?.length === 0) return false;
        const lastPage = data[data.length - 1];
        return lastPage.pagination.pageNum >= lastPage.pagination.totalPages;
    }, [data]);

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
            const target = entries[0];

            if (
                target.isIntersecting &&
                !loadingRef.current &&
                !isReachingEnd &&
                !isLoading &&
                !isValidating
            ) {
                loadingRef.current = true;

                setSize((s) => s + 1).finally(() => {
                    loadingRef.current = false;
                });
            }
            },
            {
                root: listRef.current,
                threshold: 1.0,
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [setSize, isReachingEnd, isLoading, isValidating]);

    const showTaskDetail = (id) => {
        navigate(`/task/task-list?taskid=${id}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{paddingTop: '90px', paddingBottom: '32px', bgcolor: 'rgba(255, 255, 255, 0.85)'}}>
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        flex: 1,
                        height: { md: '100dvh', xs: 'auto' },
                        overflow: { md: 'hidden', xs: 'visible' },}}>
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0, // layout already pads content under TaskHeader
                                zIndex: (t) => t.zIndex.appBar - 1, // ensure it's under TaskHeader
                                bgcolor: "background.paper",
                                borderColor: "divider",
                            }}>
                            <TaskFilterBar onChange={handleFilterChange} />
                        </Box>
                        
                        {isMdUp ? (
                            <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', mx: '24px' }}>
                                {/* left side: show all tasks */}
                                <Box 
                                    ref={listRef} 
                                    sx={{
                                        flex: { md: '0 0 38%', lg: '0 0 35%' },
                                        minWidth: 0,
                                        minHeight: 0,
                                        height: '100%',
                                        overflowY: 'auto',
                                        background: 'linear-gradient(180deg,#f7f9fc 0%,#f1f4f9 100%)',
                                        borderRight: `1px solid ${theme.palette.divider}`}}>
                                    {isLoading && (
                                        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    )}

                                    {/* ====== list ====== */}
                                    <List>
                                        {
                                            tasks.map((t, index) => {
                                                const firstCategory = t.categories[0];
                                                const extraCount = t.categories.length - 1;
                                                const hasMoreCats = extraCount > 0;
                                                t.comment_count = 0;

                                                return (
                                                    <Box key={`${t.id}-${index}`} onClick={() => showTaskDetail(t.id)}>
                                                        <Item 
                                                            selected={selectedId === String(t.id)}
                                                            sx={{ position: "relative" }}>
                                                            <Stack
                                                                alignItems="center"
                                                                mr={2}
                                                                minWidth={70}
                                                                sx={{
                                                                    pt: 3,
                                                                    width: "9ch",
                                                                }}>
                                                                <Avatar
                                                                    src={t.poster.avatar_url ?? undefined}
                                                                    alt={t.poster.username}
                                                                    sx={{ width: 52, height: 52 }} />
                                                                <Typography
                                                                    variant="caption"
                                                                    mt={0.5}
                                                                    noWrap
                                                                    maxWidth={64}
                                                                    lineHeight={1.2}>
                                                                    {t.poster.username}
                                                                </Typography>

                                                                <Box
                                                                    sx={{
                                                                        mt: 2,
                                                                        minHeight: 24,
                                                                        display: "flex",
                                                                        alignItems: "flex-start",
                                                                    }}>
                                                                    <Typography
                                                                        variant="h3"
                                                                        sx={{ mt: 1, fontSize: 20, fontWeight: 'bold',  color: theme.palette.primary.main }}>
                                                                        {t.budget ? `$${t.budget}${t.pricing_type === 'hourly' ? ' /hr' : ''}` : 'Flexible'}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                            
                                                            <StatusBadge status={t.status} variant="box" />

                                                            <Box flex={1} minWidth={0} sx={{ pt: 3, color: 'rgb(115, 115, 115)' }}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    sx={{
                                                                        display: "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: "vertical",
                                                                        overflow: "hidden",
                                                                        color: '#000',
                                                                        fontWeight: '600'
                                                                    }}>
                                                                    {t.title}
                                                                </Typography>
                                                                {t.categories.length > 0 && (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        mt={0.8}
                                                                        flexWrap="wrap"
                                                                        rowGap={0.6}>
                                                                        <Badge
                                                                            overlap="rectangular"
                                                                            badgeContent={extraCount}
                                                                            color="secondary"
                                                                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                                                            invisible={!hasMoreCats}>
                                                                            <Chip
                                                                                label={firstCategory?.title}
                                                                                size="small"
                                                                                variant="soft"
                                                                                color="secondary"
                                                                                sx={{
                                                                                    backgroundColor: theme.palette.secondary.main,
                                                                                    color: theme.palette.text.primary,
                                                                                    fontWeight: 400,
                                                                                }}/>
                                                                        </Badge>
                                                                    </Stack>
                                                                )}
                                                                
                                                                <Stack
                                                                    direction="column"
                                                                    spacing={1}
                                                                    mt={1}>
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <Box sx={{ width: 20, display: "flex", justifyContent: "center" }}>
                                                                            <LocationOn sx={{ fontSize: 16 }} />
                                                                        </Box>
                                                                        <Typography variant="caption">
                                                                            {t.location === "" ? "Remote" : t.location}
                                                                        </Typography>
                                                                    </Stack>
                                                                    {t.schedule_time && (
                                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                            <Box sx={{ width: 20, display: "flex", justifyContent: "center" }}>
                                                                                <AccessTime sx={{ fontSize: 15 }} />
                                                                            </Box>
                                                                            <Typography variant="caption">
                                                                                {formatDateNZ(t.schedule_time)}
                                                                            </Typography>
                                                                        </Stack>
                                                                    )}

                                                                    <Stack direction="row" spacing={2}>
                                                                        <Stack direction="row" spacing={0.4} alignItems="center">
                                                                            <Groups sx={{ fontSize: 16 }} />
                                                                            <Typography variant="caption">
                                                                                {t.offer_count} offers
                                                                            </Typography>
                                                                        </Stack>

                                                                        <Stack direction="row" spacing={0.4} alignItems="center">
                                                                            <ChatBubbleOutline sx={{ fontSize: 16 }} />
                                                                            <Typography variant="caption">
                                                                                {t.comment_count} comments
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        </Item>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </List>

                                    {/* ====== loading more ====== */}
                                    {isValidating && !isLoading && (
                                        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    )}

                                    {/* ====== monitor bottom line  ====== */}
                                    <div ref={loadMoreRef} />

                                    {/* ====== end ====== */}
                                    {isReachingEnd && (
                                        <Typography align="center" sx={{ my: 2, color: "text.secondary" }}>
                                            No more tasks to display
                                        </Typography>
                                    )}
                                </Box>
                                
                                {/* right side: task-detail / map */}
                                {selectedId ? (
                                    <TaskDetail taskId={selectedId} />
                                ) : (
                                    <Box ref={detailRef} sx={rightPaneSx}>
                                        <TaskMap />
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box>小屏幕</Box>
                        )}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}