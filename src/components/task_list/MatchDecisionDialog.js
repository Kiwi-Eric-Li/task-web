
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, CircularProgress
} from "@mui/material";


export default function MatchDecisionDialog({open, mode, taskerName, price, loading = false, onClose, onSubmit}){

    const title = mode === "confirm" ? "Confirm match" : "Decline match";
    const actionLabel = mode === "confirm" ? "Confirm" : "Decline";
    const accentColor = mode === "confirm" ? "success" : "warning";

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight={600}>{title}</DialogTitle>
            <DialogContent dividers>
                {mode === "confirm" ? (
                    <Typography variant="body2">
                        Are you sure you want to <b>accept</b>{" "}
                        <strong>{taskerName}</strong>
                        {price != null && <> (offer&nbsp;<b>${price.toLocaleString()}</b>)</>}?
                    </Typography>
                ) : (
                    <Typography variant="body2">
                        Are you sure you want to <b>decline</b> this match?  
                        The task will become <em>Open</em> again.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2}}>
                <Button onClick={onClose} disabled={loading} sx={{textTransform: 'none'}}>
                    Cancel
                </Button>
                <Button 
                    sx={{textTransform: 'none'}}
                    variant="contained"
                    color={accentColor}
                    disabled={loading}
                    startIcon={
                        loading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : null
                    }
                    onClick={async () => { await onSubmit(); }}
                >
                    {actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}