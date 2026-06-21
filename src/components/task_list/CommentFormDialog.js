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
import request from "../../utils/request";


const COMMENT_UPLOAD_LIMITS = {
  maxTotal: 3,
  maxImageMB: DEFAULT_MAX_IMAGE_MB,
  allowedMimes: IMAGE_MIME, // images only
};


export default function CommentFormDialog({taskId, open, onClose, onSuccess, setAlertType, setAlertMsg}){
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [commentContent, setCommentContent] = useState('');
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({})


    const handleFiles = (e) => {
        const picked = Array.from(e.target.files || []);
        if (!picked.length) return;

        const { accepted, rejected } = validateMediaFiles(
            picked,
            files.length,
            COMMENT_UPLOAD_LIMITS
        );

        if (rejected.length) {
            const msg = summarizeRejections(rejected);
            setFileError(msg);
        } else {
            setFileError(null);
        }

        if (accepted.length) {
            setFiles((prev) => [...prev, ...accepted].slice(0, COMMENT_UPLOAD_LIMITS.maxTotal));
        }

        e.currentTarget.value = "";
    }

    const removeFile = (idx) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    }

    const upload = async (files) => {
        const formData = new FormData();
        files.forEach((f) => formData.append("Files", f));
        try{
            const res = await request.post("/task-media/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if(res.code === 0){
                return res.data;
            }else{
                return "Upload failed";
            }
        }catch(e){
            console.log("Error uploading files:", e);
        }
    }


    const handleSubmit = async () => {
        console.log("======comment========", commentContent);
        console.log("======files==========", files);
        setSubmitting(true);
        let uploadUrls = [];

        if(files.length > 0){
            let res = await upload(files);
            if(typeof res === "string"){
                setFileError(res);
                setSubmitting(false);
                return;
            }else{
                uploadUrls = [...res];
            }
        }

        try{
            const res = await request.post(`/tasks/${taskId}/comments`, {
                "comment": commentContent,
                "attachments": uploadUrls
            });
            if(res.code === 0){
                setAlertType('success');
                setAlertMsg(res.message);
                onSuccess();
                onClose();
            }else{
                setAlertType('error');
                setAlertMsg(res.message);
            }
        }catch(e){
            console.error(e);
        }finally{
            setSubmitting(false);
        }
    }

    const clearData = ()=>{
        setCommentContent('');
        setFiles([]);
        setFileError(null);
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={() => {clearData(); onClose();}}
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { m: { xs: 0, sm: 2 } } }}
            >
                <DialogTitle fontWeight={700}>
                    New Comment
                    <IconButton
                        aria-label="close"
                        onClick={() => {clearData(); onClose();}}
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
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
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
                    <Button onClick={() => {clearData(); onClose();}} disabled={submitting} sx={{textTransform: "none"}}>
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