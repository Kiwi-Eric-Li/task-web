import {useState} from 'react';
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  alpha,
  useTheme,
  Alert,
} from "@mui/material";
import { AccessTime, LocalOffer, WarningAmber, Star, CheckCircle } from "@mui/icons-material";


import UserRatingInline from "./UserRatingInline";
import TaskAttachments from "./TaskAttachments";
import {formatDateNZ} from "../../utils/time";


function ActionButton({label, variant = "text", disabled, loading, tooltip, ...rest}) {
  const btn = (
    <Button
      size="small"
      variant={variant}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={14} sx={{ color: "inherit" }} /> : null}
      {...rest}
    >
      {label}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      <span>{btn}</span>
    </Tooltip>
  ) : (
    btn
  );
}

export default function OwnerOfferList({taskId, offers, hasMatched, onMutate, status, allowActions = true}){
    const theme = useTheme();
    const [actionError, setActionError] = useState(null);
    const [accepting, setAccepting] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [dialog, setDialog] = useState(null);

    if (!offers?.length) {
        return (
            <Typography variant="body2" color="text.secondary">
                No other offers yet.
            </Typography>
        );
    }
    const isPostConfirm = status === "InProgress" || status === "Completed";

    


    const cancelMatch = () => {

    }

    const acceptOffer = () => {

    }

    const closeDialog = () => {
        if (accepting || canceling) return;
        setActionError(null);
        setDialog(null);
    };


    return (
        <>
            <Stack spacing={1.5}>
                {
                    offers.map((o) => {
                        const preferred = o.is_matched;
                        const expired = o.is_expired;
                        const disabled = expired || (hasMatched && !preferred);
                        const profileHref = `/task/profile/${o.user_id}`;

                        const isMatchedVisual = preferred && isPostConfirm;
                        const paperBg = preferred
                            ? alpha(isMatchedVisual ? theme.palette.success.main : theme.palette.primary.main, 0.06)
                            : alpha(theme.palette.success.main, 0.03);

                        const paperBorder = preferred
                            ? (isMatchedVisual ? theme.palette.success.main : theme.palette.primary.main)
                            : theme.palette.success.light;

                        const stateChip =
                            preferred ? (
                                <Chip
                                    size="small"
                                    icon={
                                        isPostConfirm ? <CheckCircle fontSize="small" /> : <Star fontSize="small" />
                                    }
                                    color={isPostConfirm ? "success" : "primary"}
                                    label={isPostConfirm ? "Matched" : "Selected"}
                                />
                            ) : null;


                        return (
                            <Paper
                                key={o.id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderColor: paperBorder,
                                    bgcolor: paperBg,
                                    opacity: expired && !preferred ? 0.6 : 1,
                                    transition: "box-shadow .15s, border-color .2s, transform .1s",
                                    "&:hover": {
                                    boxShadow: preferred ? theme.shadows[2] : theme.shadows[1],
                                    transform: preferred ? "translateY(-1px)" : "none",
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    flexWrap="wrap"
                                    rowGap={0.5}
                                    sx={{ display: { xs: "flex", sm: "none" }, mb: 1 }}
                                >
                                    {stateChip}
                                    {expired && (
                                        <Chip
                                            size="small"
                                            color="warning"
                                            icon={<WarningAmber fontSize="small" />}
                                            label="Expired"
                                        />
                                    )}
                                    <Chip
                                        label="TEST"
                                        color="primary"
                                        variant="filled"
                                    />
                                    <Chip
                                        icon={<LocalOffer />}
                                        label={typeof o.price === "number" ? `$${o.price.toLocaleString()}` : "—"}
                                        size="small"
                                        color={preferred ? (isPostConfirm ? "success" : "primary") : "success"}
                                        sx={{ color: '#fff', fontWeight: 700, "& .MuiChip-icon": { ml: 0 } }}
                                    />
                                </Stack>
                                
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <Box
                                        component={Link}
                                        to={profileHref}
                                        aria-label={`View ${o?.user?.username}'s profile`}
                                        sx={{
                                            display: "inline-flex",
                                            flexShrink: 0,
                                            textDecoration: "none",
                                            "&:hover": { cursor: "pointer", textDecoration: "none" }, // no underline/highlight
                                        }}
                                        >
                                        <Avatar
                                            src={o?.user?.avatar_url ?? undefined}
                                            sx={{ width: 48, height: 48, flexShrink: 0 }}
                                        >
                                            {o?.user?.username}
                                        </Avatar>
                                    </Box>
                                    <Box flex={1} minWidth={0}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            flexWrap="wrap"
                                            rowGap={1}
                                        >
                                            <Typography
                                                component={Link}
                                                to={profileHref}
                                                variant="subtitle2"
                                                fontWeight={600}
                                                noWrap
                                                sx={{
                                                    maxWidth: "70%",
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    "&:hover": { cursor: "pointer", textDecoration: "none" }, // no underline/highlight
                                                }}
                                                title={o?.user?.username ?? ""}
                                                >
                                                {o?.user?.username}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                flexWrap="wrap"
                                                sx={{ display: { xs: "none", sm: "flex" } }}
                                            >
                                                {stateChip}
                                                {expired && (
                                                    <Chip
                                                        size="small"
                                                        color="warning"
                                                        icon={<WarningAmber fontSize="small" />}
                                                        label="Expired"
                                                    />
                                                )}
                                                <Chip
                                                    icon={<LocalOffer />}
                                                    label={typeof o.price === "number" ? `$${o.price.toLocaleString()}` : "—"}
                                                    size="small"
                                                    color={preferred ? (isPostConfirm ? "success" : "primary") : "success"}
                                                    sx={{ color: '#fff', fontWeight: 700, "& .MuiChip-icon": { ml: 0 } }}
                                                />
                                            </Stack>
                                        </Stack>
                                        <UserRatingInline value={o?.tasker_rating?.avg} count={o?.tasker_rating?.count} />
                                        {o.message && (
                                            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                                            {o.message}
                                            </Typography>
                                        )}

                                        {(JSON.parse(o.attachments).length > 0) && (
                                            <Box mt={1}>
                                                <TaskAttachments attachments={JSON.parse(o.attachments)} />
                                            </Box>
                                        )}

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            color="text.secondary"
                                            sx={{ mt: 0.8 }}
                                        >
                                            <AccessTime sx={{ fontSize: 16 }} />
                                            <Typography variant="caption">
                                                {formatDateNZ(o.created_at, { withTime: true })}
                                            </Typography>
                                            <Box flex={1} />
                                            {allowActions &&
                                                (preferred ? (
                                                    <ActionButton
                                                        label="Cancel selection"
                                                        loading={canceling}
                                                        onClick={() => {
                                                            setActionError(null);
                                                            setDialog({ type: "cancel", offer: o });
                                                        }}
                                                    />
                                                ) : (
                                                    <ActionButton
                                                        label="Select as Preferred"
                                                        variant="outlined"
                                                        disabled={disabled}
                                                        loading={accepting}
                                                        onClick={() => {
                                                            setActionError(null);
                                                            setDialog({ type: "accept", offer: o });
                                                        }}
                                                        tooltip={
                                                            (expired && "Offer expired") ||
                                                            ((hasMatched && !preferred) && "You already have a preferred offer") ||
                                                            undefined
                                                        }
                                                    />
                                                ))
                                            }
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        )
                    })
                }
            </Stack>
            
            <Dialog
                open={!!dialog}
                onClose={closeDialog}
                maxWidth="xs"
                fullWidth
                disableEscapeKeyDown={accepting || canceling}
            >
                {dialog && dialog?.type === "accept" && (
                <>
                    <DialogTitle fontWeight={600}>Confirm selection</DialogTitle>
                    <DialogContent dividers>
                    <Typography variant="body2">
                        Set <strong>{dialog.offer?.user?.username}</strong>'s offer (
                        <strong>${dialog.offer.price.toLocaleString()}</strong>) as your preferred match?
                    </Typography>

                    {actionError && <Alert severity="error" sx={{ mt: 1 }}>{actionError}</Alert>}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={closeDialog} disabled={accepting} sx={{textTransform: 'none'}}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            disabled={accepting}
                            onClick={async () => {
                                try {
                                    setActionError(null);
                                    await acceptOffer({ offer_id: dialog.offer.id });
                                    setDialog(null);
                                    onMutate();
                                } catch (err) {
                                    setActionError(err);
                                }
                            }}
                            startIcon={
                                accepting ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined
                            }
                            sx={{textTransform: 'none'}}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </>
                )}

                {dialog && dialog?.type === "cancel" && (
                <>
                    <DialogTitle fontWeight={600}>Cancel current match</DialogTitle>
                    <DialogContent dividers>
                    <Typography variant="body2">
                        Cancel the preferred offer from <strong>{dialog?.offer?.user?.username}</strong>?{" "}
                        <br />
                        The task will return to <em>Open</em> status.
                    </Typography>

                    {actionError && <Alert severity="error" sx={{ mt: 1 }}>{actionError}</Alert>}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                    <Button variant="contained" color="warning" onClick={closeDialog} disabled={canceling}>
                        Keep
                    </Button>
                    <Button
                        disabled={canceling}
                        onClick={async () => {
                            try {
                                setActionError(null);
                                await cancelMatch();
                                setDialog(null);
                                onMutate();
                            } catch (err) {
                                setActionError(err);
                            }
                        }}
                        startIcon={
                            canceling ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined
                        }
                    >
                        Cancel match
                    </Button>
                    </DialogActions>
                </>
                )}
            </Dialog>
        </>
    )
}