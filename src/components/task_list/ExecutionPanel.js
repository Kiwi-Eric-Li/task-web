import {useState} from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  Chip,
  Paper,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CheckCircle, Key, InfoOutlined, ContentCopy } from "@mui/icons-material";

import { useCountdown, formatLocalDateTime } from "../../utils/countdown";


export default function ExecutionPanel({taskId, role, posterName, onMutate}){


    console.log("role==========", role);

    return role === "poster" ? (
        <PosterExecutionBox  onMutate={onMutate} />
    ) : (
        <TaskerExecutionBox posterName={posterName} onMutate={onMutate} />
    );
}

function PosterExecutionBox({onMutate}){

    const [code, setCode] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null); // show as-is
    const [openDone, setOpenDone] = useState(false);
    const [comment, setComment] = useState("");
    const [loadingCode, setLoadingCode] = useState(false);
    const [completing, setCompleting] = useState(false);

    const { display: timeLeft, isExpired } = useCountdown(expiresAt);

    const displayExpires = expiresAt ? formatLocalDateTime(expiresAt, "en-NZ", { timeZone: "Pacific/Auckland" }) : null;

    const handleShowCode = () => {

    }

    const handleCopyCode = () => {

    }

    const handlePosterComplete = () => {

    }

    return (
        <>
            <Box>
                <Typography variant="h6" fontWeight={700}>
                    Completion & Handover
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Share a <b>6-digit code</b> with your tasker to let them verify completion — or mark the task
                    done yourself when everything looks good.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} alignItems="stretch">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    height: { md: "100%" },
                                    display: "grid",
                                    gridTemplateRows: "auto auto auto auto 1fr",
                                    rowGap: 1.25,
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Key fontSize="small" color="primary" />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Completion Code
                                    </Typography>
                                    {code && (
                                        <Chip
                                            size="small"
                                            color={isExpired ? "warning" : "primary"}
                                            label={isExpired ? "Expired" : "Active"}
                                            sx={{ ml: 0.5 }}
                                        />
                                    )}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Generate the code and share it with your tasker. When they verify it, the task is
                                    marked complete and both of you can leave a review.
                                </Typography>
                                {!code || isExpired ? (
                                    <Button
                                    variant="outlined"
                                    onClick={handleShowCode}
                                    disabled={loadingCode}
                                    sx={{ textTransform: "none", alignSelf: { xs: "stretch", sm: "flex-start" } }}
                                    startIcon={<Key fontSize="small" />}
                                    >
                                    {loadingCode ? "Loading…" : "Generate & show code"}
                                    </Button>
                                ) : (
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1}
                                        alignItems={{ xs: "stretch", sm: "center" }}
                                    >
                                        <Chip
                                            sx={{
                                            fontWeight: 700,
                                            letterSpacing: 2,
                                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                            px: 1,
                                            height: 32,
                                            }}
                                            label={code}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleCopyCode}
                                            startIcon={<ContentCopy />}
                                            sx={{ textTransform: "none" }}
                                            disabled={loadingCode}
                                        >
                                            Copy code
                                        </Button>
                                    </Stack>
                                )}

                                {/* 过期信息 */}
                                {code && (
                                    <Typography variant="caption" color="text.secondary">
                                        Expires: <b>{displayExpires}</b>
                                        {timeLeft ? <> • {timeLeft}</> : null}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                        
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    height: { md: "100%" },
                                    display: "grid",
                                    gridTemplateRows: "auto auto auto 1fr",
                                    rowGap: 1.25,
                                    background: (t) => alpha(t.palette.success.main, 0.08),
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircle fontSize="small" color="success" />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Mark Completed
                                    </Typography>
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    If everything is delivered and you’re happy, you can complete the task now. This will
                                    move the job to reviews for both sides.
                                </Typography>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => setOpenDone(true)}
                                        disabled={completing}
                                        sx={{ textTransform: "none", bgColor: '#00C853', color: '#fff', fontWeight: 'bold' }}
                                    >
                                        {completing ? "Submitting…" : "Mark as Completed"}
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Dialog open={openDone} onClose={() => setOpenDone(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Confirm completion</DialogTitle>
                <DialogContent dividers>
                <Typography variant="body2" color="text.secondary">
                    This will set the task to <b>Completed</b> and open the review step for you and the
                    tasker. Continue?
                </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDone(false)} disabled={completing}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handlePosterComplete}
                        disabled={completing}
                    >
                        {completing ? "Working…" : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function TaskerExecutionBox({posterName, onMutate}){

}