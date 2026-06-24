import {useState} from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Image as ImageIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";


import {
  validateMediaFiles,
  summarizeRejections,
  mapUploadAxiosError,
  IMAGE_MIME,
  DEFAULT_MAX_IMAGE_MB,
} from "../../utils/media";
import { useState } from "react";

const REPLY_UPLOAD_LIMITS = {
  maxTotal: 3,
  maxImageMB: DEFAULT_MAX_IMAGE_MB,
  allowedMimes: IMAGE_MIME,
};



export default function ReplyInput({ taskId, parentId, onSuccess, onCancel }){

    const theme = useTheme();

    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [urls, setUrls] = useState([]);
    const [uploadingStates, setUploading] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);



    return (
        <Box
            sx={{
                mt: 1,
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.light, 0.05),
                borderRadius: 1,
            }}
        >
            <Stack spacing={1}>

            </Stack>

            <Dialog
                open={!!preview}
                onClose={() => setPreview(null)}
                maxWidth="md"
                PaperProps={{ sx: { p: 0 } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {preview && <img src={preview} alt="large" style={{ width: "100%" }} />}
                </DialogContent>
            </Dialog>
        </Box>
    )
}