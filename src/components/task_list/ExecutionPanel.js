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
import request from "../../utils/request";


export default function ExecutionPanel({taskId, role, posterName, onMutate, setAlertType, setAlertMsg}){

    return role === "poster" ? (
        <PosterExecutionBox  onMutate={onMutate} taskId={taskId} setAlertType={setAlertType} setAlertMsg={setAlertMsg}/>
    ) : (
        <TaskerExecutionBox taskId={taskId} posterName={posterName} onMutate={onMutate} />
    );
}

function PosterExecutionBox({onMutate, taskId, setAlertType, setAlertMsg}){

    const [code, setCode] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null); // show as-is
    const [openDone, setOpenDone] = useState(false);
    const [comment, setComment] = useState("");
    const [loadingCode, setLoadingCode] = useState(false);
    const [completing, setCompleting] = useState(false);

    const { display: timeLeft, isExpired } = useCountdown(expiresAt);

    const displayExpires = expiresAt ? formatLocalDateTime(expiresAt, "en-NZ", { timeZone: "Pacific/Auckland" }) : null;

    const handleShowCode = async () => {
        try{
            const res = await request.get(`/tasks/completion-code?taskid=${taskId}`);
            if(res.code === 0){
                setCode(res.data.code);
                setExpiresAt(res.data.expires_at);
            }
        }catch(e){
            console.log(e);
        }
    }

    const handleCopyCode = async () => {
        if (!code){
            return;
        }
        try{
            await navigator.clipboard.writeText(code);
            setAlertType("success");
            setAlertMsg("Code copied to clipboard.");
        }catch(e){
            try{
                const ta = document.createElement("textarea");
                ta.value = code;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                setAlertType("success");
                setAlertMsg("Code copied to clipboard.");
            }catch(e){
                setAlertType("error");
                setAlertMsg("Couldn’t copy the code. Please copy it manually.");
            }
        }
    }

    const handlePosterComplete = async () => {

        try{
            const res = await request.put(`/tasks/${taskId}/complete`);
            if(res.code === 0){
                onMutate();
            }
            setAlertType("success");
            setAlertMsg(res.message);
            setOpenDone(false);
        }catch(e){
            console.log(e);
            setAlertType("error");
            setAlertMsg("Failed to mark task as complete.");
        }
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
                    <Button onClick={() => setOpenDone(false)} disabled={completing} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handlePosterComplete}
                        disabled={completing} 
                        sx={{ textTransform: "none" }}
                    >
                        {completing ? "Working…" : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function TaskerExecutionBox({taskId, posterName, onMutate}){

    const [note, setNote] = useState("");
    const [firstUrl, setFirstUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [code, setCode] = useState("");
    const [openVerify, setOpenVerify] = useState(false);
    const [codeErr, setCodeErr] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [starting, setStarting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const safeMsg = (err, fallback) => err?.response?.data?.message || err?.response?.data || err?.message || fallback;


    const handleVerify = async () => {
        if(code.length !== 6){
            setCodeErr("Please enter the 6-digit code.");
            return;
        }
        setCodeErr("");
        setVerifying(true);
        try{
            const res = await request.post(`/tasks/${taskId}/verify-code`, { code });
            console.log("res====verify=====", res);
            if(res.code === 0){
                setOpenVerify(false);
                onMutate();
            }
        }catch(e){
            console.log("error====verify=====", e.response.data.message);
        }finally{
            setVerifying(false);
        }
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={700}>
                Finish & Verify
            </Typography>
            <Stack spacing={1} sx={{ mt: 0.5 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    When your work is complete, ask <b>{posterName}</b> for their 6-digit completion code.
                    Verifying the code will mark the task as finished, trigger settlement, and open reviews.
                </Typography>
                <Box
                    sx={(theme) => ({
                        mt: 1,
                        p: 1.25,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.info.light}`,
                        background: theme.palette.mode === "dark"
                        ? theme.palette.action.hover
                        : theme.palette.info.light + "22",
                    })}
                >
                    <InfoOutlined fontSize="small" color="info" />
                    <Typography variant="caption" color="text.secondary">
                        Can’t find it? Ask {posterName} to generate the code on their task page.
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                    variant="contained"
                    onClick={() => setOpenVerify(true)}
                    sx={{ textTransform: "none" }}
                >
                    I have the code — Verify
                </Button>
            </Stack>
            
            <Dialog open={openVerify} onClose={() => setOpenVerify(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700}>Enter completion code</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Enter the 6-digit code from <b>{posterName}</b>. Submitting the correct code will complete
                        the task and move both of you to the review stage.
                    </Typography>

                    <TextField
                        autoFocus
                        fullWidth
                        inputProps={{
                            maxLength: 6,
                            inputMode: "numeric",
                            pattern: "\\d*",
                            style: { letterSpacing: 4, textAlign: "center", fontVariantNumeric: "tabular-nums" },
                        }}
                        placeholder="••••••"
                        value={code}
                        onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "");
                            setCode(v);
                            if (codeErr) setCodeErr("");
                        }}
                        error={!!codeErr}
                        helperText={codeErr || "6 digits, numbers only."}
                    />

                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Tip: Verify only after you’ve delivered everything agreed. We’ll record this action for both parties.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button sx={{textTransform: 'none'}} onClick={() => setOpenVerify(false)} disabled={verifying}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleVerify}
                        disabled={verifying || code.length !== 6}
                        sx={{ minWidth: 120, textTransform: "none" }}
                    >
                        {verifying ? "Verifying…" : "Complete Task"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}