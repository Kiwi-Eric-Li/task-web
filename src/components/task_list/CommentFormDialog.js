import {useState} from "react"
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  validateMediaFiles,
  summarizeRejections,
  mapUploadAxiosError,
  IMAGE_MIME,
  DEFAULT_MAX_IMAGE_MB,
} from "../../utils/media";

const COMMENT_UPLOAD_LIMITS = {
  maxTotal: 3,
  maxImageMB: DEFAULT_MAX_IMAGE_MB,
  allowedMimes: IMAGE_MIME, // images only
};


export default function CommentFormDialog({taskId, open, onClose, onSuccess}){
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({})


    const handleFiles = () => {

    }

    const removeFile = () => {

    }

    const handleSubmit = () => {

    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { m: { xs: 0, sm: 2 } } }}
            >
                <DialogTitle fontWeight={700}>
                    New Comment
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <DialogContentText color="text.secondary" mb={2}>
                        Be nice &bull; Stay on topic &bull; Max 400 characters
                    </DialogContentText>

                    <TextField
                        label="Your Comment"
                        placeholder="Share your thoughts or ask a question"
                        multiline
                        rows={4}
                        fullWidth
                        error={!!errors?.content}
                        helperText={errors?.content?.message}
                    />
                    
                {/* image upload row */}
                <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                    <Button
                        component="label"
                        startIcon={<ImageIcon />}
                        variant="outlined"
                        size="small"
                        disabled={files.length >= COMMENT_UPLOAD_LIMITS.maxTotal}
                    >
                        Attach Images (max {COMMENT_UPLOAD_LIMITS.maxTotal})
                        <input hidden type="file" accept="image/*" multiple onChange={handleFiles} />
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                        {files.length}/{COMMENT_UPLOAD_LIMITS.maxTotal} selected
                    </Typography>
                </Stack>

                {/* helper + single error line */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Allowed: JPG, PNG, WEBP. Images ≤ {COMMENT_UPLOAD_LIMITS.maxImageMB}MB. Max {COMMENT_UPLOAD_LIMITS.maxTotal} files.
                </Typography>
                {fileError && (
                    <Typography variant="caption" color="error" sx={{ whiteSpace: "pre-line", mt: 0.5, display: "block" }}>
                        {fileError}
                    </Typography>
                )}

                {/* thumbnails */}
                {files.length > 0 && (
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {files.map((f, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                position: "relative",
                                width: 72,
                                height: 72,
                                borderRadius: 1,
                                overflow: "hidden",
                                boxShadow: 1,
                                "&:hover .del": { opacity: 1 },
                            }}
                        >
                        <img
                            src={URL.createObjectURL(f)}
                            alt="thumb"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onClick={() => setPreview(URL.createObjectURL(f))}
                        />
                        <IconButton
                            size="small"
                            color="error"
                            className="del"
                            onClick={() => removeFile(idx)}
                            sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                bgcolor: "rgba(255,255,255,.8)",
                                opacity: 0,
                                transition: ".2s",
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    </Box>
                )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={submitting} sx={{textTransform: "none"}}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit()}
                        disabled={submitting}
                        startIcon={
                        submitting && (
                            <CircularProgress size={16} sx={{ color: "inherit" }} />
                        )
                        }
                        sx={{ textTransform: "none", boxShadow: 2 }}
                    >
                        Post Comment
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!preview}
                onClose={() => setPreview(null)}
                maxWidth="md"
                PaperProps={{ sx: { p: 0 } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {preview && (
                        <img src={preview} alt="preview" style={{ width: "100%" }} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )

}