import {useState} from "react";

import {
    Paper,
    Stack,
    Typography,
    Button,
    Box,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";


export default function ManageTaskPanel({disabled, onCancel}){

    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpen = () => setOpenConfirm(true);
    const handleClose = () => setOpenConfirm(false)

    const handleConfirm = async () => {
        setOpenConfirm(false)
        await onCancel();
    }

    return (
        <>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Stack spacing={0.25} sx={{ mb: 1.5 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Manage task
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Make changes to this task’s settings and status.
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Box
                    sx={(theme) => ({
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                        p: 2,
                    })}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack spacing={0.5} sx={{ pr: { sm: 2 } }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                Cancel task
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Canceling will close this task and stop new offers.
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            color="error"
                            size="medium"
                            disabled={disabled}
                            onClick={handleOpen}
                            sx={{ textTransform: "none", alignSelf: { xs: "flex-start", sm: "auto" } }}
                        >
                            Cancel task
                        </Button>
                    </Stack>
                </Box>
            </Paper>
            <Dialog
                open={openConfirm}
                onClose={handleClose}
                aria-labelledby="cancel-task-title"
                aria-describedby="cancel-task-description"
            >
                <DialogTitle id="cancel-task-title">Cancel this task?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="cancel-task-description">
                        This will close the task and stop new offers. You can’t undo this action.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ textTransform: "none" }}>
                        Keep task
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: "none" }}
                    >
                        Yes, cancel task
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}