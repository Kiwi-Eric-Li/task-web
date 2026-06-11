import {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from 'react-redux';
import { createPortal } from "react-dom";
import {
  AccessTime,
  AttachMoney,
  Comment,
  Description,
  Image,
  LocalOffer,
  Place,
  Public,
  Schedule,
  Category,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Button,
  alpha,
  styled,
  Paper,
  useTheme,
  ImageList,
  ImageListItem,
  Snackbar,
} from "@mui/material";

import request from "../../utils/request"
import theme from "../../utils/theme"
import StatusBadge from "./StatusBadge";
import UserRatingInline from "./UserRatingInline";
import { formatDateNZ } from "../../utils/time";
import TaskAttachments from "./TaskAttachments";
import OwnerOfferPanel from "./OwnerOfferPanel";
import OfferList from "./OfferList";
import OfferFormDialog from "./OfferFormDialog";
import {tokenService} from "../../utils/token";
import { openLoginDialog } from "../../store/modules/loginDialogSlice";
import taskNotificationHub from "../../utils/signalr/task_notification_hub";
import {SignalREvents} from "../../utils/signalr/event_names";
import {SignalRHubs} from "../../utils/signalr/hub_names";


const Gray = (props) => (
  <Typography variant="body2" color="text.secondary" {...props} />
);

const MetaRowWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  "&:nth-of-type(odd)": {
    background: alpha(theme.palette.grey[50], 0.6),
  },
}));

function MetaRow({
  icon,
  label,
  value,
  highlight = false,
  valueColor,
}) {
  const theme = useTheme();
  return (
    <MetaRowWrapper
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          whiteSpace: "nowrap",
        }}
      >
        {label}:
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          color: highlight
            ? theme.palette.success.main
            : valueColor || theme.palette.text.primary,
          overflowWrap: "break-word",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </MetaRowWrapper>
  );
}

const Section = styled("section")(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const DescriptionSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export default function TaskDetail({taskId, afterMade}){
    const dispatch = useDispatch();
    const theme = useTheme();

    const {userData} = useSelector(state => state.userData || {});
    const navigate = useNavigate();
    const [task, setTask] = useState({});
    const [showAllCats, setShowAllCats] = useState(false);
    const [offerOpen, setOfferOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMsg, setAlertMsg] = useState("");
    const CAT_LIMIT = 2;
    
    const isOwner = userData.id === task?.poster_id;
    const hasMatched = task?.offers?.some(o => o.is_matched);
    const canOffer = !isOwner && !hasMatched && task?.status === "Open";

    useEffect(() => {
        
        const fetchTask = async () => {
            try{
                const response = await request(`/tasks/${taskId}`);
                const {code, data} = response;
                if(code === 0){
                    setTask(data);
                }
                await taskNotificationHub.invoke(SignalRHubs.JOINEDTASK, taskId);

            }catch(e){
                console.error("Error fetching task details:", e);
            }
        };

        fetchTask();

        return () => {
            taskNotificationHub.invoke(SignalRHubs.LeftTask, taskId);
        };
    }, [taskId]);

    useEffect(() => {
        taskNotificationHub.on(
            SignalREvents.TaskOfferAccepted,
            (event) => {
                console.log("接收后端传递过来的数据：", event);
            }
        );

        return () => {
            taskNotificationHub.off(SignalREvents.TaskOfferAccepted);
        };
    }, []);

    const handleMakeOffer = () => {
        // validate whether user logins or not
        if (tokenService.getAccessToken()) {
            setOfferOpen(true);
        } else {
            dispatch(openLoginDialog());
        }
    };

    const afterMutate = () => {

    }

    const triggerRefetch = async () => {
        try{
            const res = await request.get(`/tasks/${taskId}/offers/refetch`);
            if(res.code === 0){
                res.data && setTask({...task, offers: res.data});
                afterMade(taskId, res.data.length);
            }
        }catch(e){
            console.error(e);
        }
    }

    const snackbar = (
        <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ zIndex: 99999 }}>
            <Alert severity={alertType}>{alertMsg}</Alert>
        </Snackbar>
    );


    return (
        <>
            <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflowX: "auto",
                width: "100%"
            }}>
            <Box flex={1} p={1} sx={{ minWidth: "100%"}}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        position: "relative",
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        width: "100%",
                    }}>
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                        <StatusBadge status={task?.status} variant="chip" />
                    </Box>
                    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                        <Box sx={{ order: { xs: 0, sm: 1 } }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ maxWidth: "100%", whiteSpace: "normal", wordBreak: "break-word" }}>
                                {task.title}
                            </Typography>
                        </Box>
                        <Box sx={{ order: { xs: 1, sm: 0 } }}>
                            <Box>
                                <Avatar
                                    src={task?.poster?.avatar_url ?? undefined}
                                    alt={task?.poster?.username}
                                    sx={{ width: 60, height: 60, cursor: 'pointer' }}   // + cursor
                                    onClick={() => navigate(`/task/profile/${task.poster_id}`)} // + navigate
                                />
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Gray sx={{ mt: 0.5 }}>
                                        Posted by{' '}
                                        <Typography
                                            component="span"
                                            color="text.primary"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/task/profile/${task.poster_id}`)}>
                                            {task?.poster?.username}
                                        </Typography>
                                    </Gray>

                                    <UserRatingInline
                                        value={task?.poster_rating?.avg || 7}
                                        count={task?.poster_rating?.count || 8}
                                    />
                                </Stack>
                            </Box>
                        </Box>
                        <Box sx={{ order: 2 }}>
                            {task?.categories?.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                                {(showAllCats ? task?.categories : task?.categories?.slice(0, CAT_LIMIT)).map((c) => (
                                    <Chip
                                        key={c.id}
                                        label={c.title}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: 14,
                                            borderColor: theme.palette.primary.main,
                                            color: theme.palette.primary.main,
                                            fontWeight: 'bold'
                                        }}
                                    />
                                ))}
                                {!showAllCats && task?.categories?.length > CAT_LIMIT && (
                                    <Typography
                                        component="button"
                                        variant="subtitle2"
                                        onClick={() => setShowAllCats(true)}
                                        sx={{
                                            ml: 1,
                                            fontSize: 14,
                                            color: theme.palette.primary.main,
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            background: "none",
                                            border: "none",
                                            p: 0,
                                        }}
                                    >
                                    +{task?.categories?.length - CAT_LIMIT} more
                                    </Typography>
                                )}
                                {showAllCats && task?.categories?.length > CAT_LIMIT && (
                                    <Typography
                                        component="button"
                                        variant="subtitle2"
                                        onClick={() => setShowAllCats(false)}
                                        sx={{
                                            ml: 1,
                                            fontSize: 14,
                                            color: theme.palette.text.secondary,
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            background: "none",
                                            border: "none",
                                            p: 0,
                                        }}
                                    >
                                    Show less
                                    </Typography>
                                )}
                            </Box>)}
                        </Box>
                    </Stack>
                </Paper>

                {/* —— 管理任务 —— */}


                {/* —— 执行阶段 —— */}


                {/* —— 完成 & 评价 —— */}


                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        // columnGap: theme.spacing(2),
                        width: "100%",
                        gridTemplateColumns: {
                            xs: "1fr",
                        },
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[1],
                        bgcolor: theme.palette.background.paper,
                        columnGap: 2,
                        rowGap: 1,     
                        minWidth: 0,
                    }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" }
                        }}>
                        <MetaRow
                            icon={
                                task?.task_type === "remote"
                                ? <Public sx={{ color: theme.palette.text.secondary }} />
                                : <Place sx={{ color: theme.palette.text.secondary }} />
                            }
                            label="Location"
                            value={task?.task_type === "remote" ? "Remote" : task?.location ?? "On-site"}
                            valueColor={theme.palette.text.primary}
                        />
                        <MetaRow
                            icon={<AttachMoney sx={{ color: theme.palette.success.main }} />}
                            label="Budget"
                            value={task?.budget ? `${task?.budget}${task?.pricing_type === 'hourly' ? ' /hr' : ''}` : 'Open to Offers'}
                            valueColor={theme.palette.success.main}
                        />
                        {task?.schedule_time && (
                            <MetaRow
                                icon={<Schedule sx={{ color: theme.palette.text.secondary }} />}
                                label="Scheduled"
                                value={formatDateNZ(task?.schedule_time, { withTime: true })}
                                valueColor={theme.palette.text.primary}
                            />
                        )}
                        <MetaRow
                            icon={<AccessTime sx={{ color: theme.palette.text.secondary }} />}
                            label="Estimated Hours"
                            value={typeof task?.estimated_hours === 'number' ? `${task?.estimated_hours} hr${task?.estimated_hours === 1 ? '' : 's'}` : '—'}
                            valueColor={theme.palette.text.primary}
                        />
                    </Box>
                </Paper>
                
                <DescriptionSection elevation={1}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Description color="primary" fontSize="small" />
                        <Typography variant="h6" fontWeight={700}>
                        Task Description
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                    >
                        {task?.description || "The poster did not provide any description."}
                    </Typography>


                    {/* Attachments */}
                    <Section>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Image color="primary" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Attachments
                            </Typography>
                        </Stack>

                        <TaskAttachments attachments={task?.attachments ?? []} />
                    </Section>
                </DescriptionSection>
                
                {/* Offers */}
                <Section>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                        >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LocalOffer fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight={700}>
                                {task?.offers?.length} Offer{task?.offers?.length === 1 ? "" : "s"}
                            </Typography>
                        </Stack>
                        
                        {canOffer && (
                            <Button
                                onClick={handleMakeOffer}
                                startIcon={<LocalOffer />}
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    boxShadow: 2,
                                    "&:hover": { boxShadow: 4 },
                                }}>
                            Make An Offer
                            </Button>
                        )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />
                        
                        {isOwner ? (
                            <>
                                {hasMatched && task.status === "Matching" && (
                                    <Paper
                                        sx={{
                                            p: 1.5,
                                            mb: 2,
                                            bgcolor: alpha(theme.palette.info.main, 0.08),
                                            border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
                                        }}>
                                        <Typography variant="body2">
                                        You’ve selected a preferred offer. Waiting for the tasker to confirm. You can cancel the selection to choose another offer.
                                        </Typography>
                                    </Paper>
                                )}

                                <OwnerOfferPanel
                                    taskId={task?.id}
                                    status={task?.status}
                                    offers={task?.offers}
                                    onMutate={afterMutate}
                                />
                            </>
                        ) : (
                            <OfferList
                                offers={task.offers}
                                emptyText="Be the first to offer — let the poster know what you can do!"
                            />
                        )}
                    </Paper>
                </Section>


                {/* Comments */}


                

            </Box>

            {canOffer && (
                <Box
                sx={{
                    position: { xs: "fixed", md: "sticky" },
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    bgcolor: "#fff",
                    borderTop: `1px solid ${theme.palette.divider}`,
                    zIndex: 10,
                }}
                >
                <Button
                    onClick={handleMakeOffer}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        textTransform: "none",
                        backgroundColor: "#3fa46a",
                        ":hover": { backgroundColor: "#36975d" },
                    }}>
                    Make an Offer
                </Button>
                </Box>
            )}

            <OfferFormDialog
                taskId={task?.id}
                open={offerOpen}
                setAlertType={(flag) => setAlertType(flag)}
                setAlertMsg={(msg) => setAlertMsg(msg)}
                onClose={() => setOfferOpen(false)}
                onSuccess={() => triggerRefetch()}
            />
            </Box>
            {openAlert && createPortal(snackbar, document.body)}
        </>
        
    );
}