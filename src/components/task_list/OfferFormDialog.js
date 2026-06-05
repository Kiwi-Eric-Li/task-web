

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Box,
  Avatar,
} from "@mui/material";
import {
  Close as CloseIcon,
  UploadFile,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  validateMediaFiles,
  summarizeRejections,
  mapUploadAxiosError,
  IMAGE_MIME,
  DEFAULT_MAX_IMAGE_MB,
} from "../../utils/media";

const OFFER_UPLOAD_LIMITS = {
  maxTotal: 3,
  maxImageMB: DEFAULT_MAX_IMAGE_MB,
  allowedMimes: IMAGE_MIME,
};
const MAX_MESSAGE_WORDS = 300;


export default function OfferFormDialog({taskId, open, onClose, onSuccess}){

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
                <DialogTitle fontWeight={700}>
                    Make an Offer
                    <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            </Dialog>
        </>
    )
}