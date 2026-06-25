import {useState} from 'react';
import {useSelector} from 'react-redux';
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
import request from "../../utils/request";


const REPLY_UPLOAD_LIMITS = {
  maxTotal: 3,
  maxImageMB: DEFAULT_MAX_IMAGE_MB,
  allowedMimes: IMAGE_MIME,
};


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

export default function ReplyInput({ taskId, parentId, onSuccess, onCancel }){

    const theme = useTheme();
    const {userData} = useSelector(state => state.userData || {});
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [urls, setUrls] = useState([]);
    const [uploadingStates, setUploading] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);

    const pickFiles = async (e) => {
        const picked = Array.from(e.target.files || []);
        if (!picked.length) return;

        const { accepted, rejected } = validateMediaFiles(
            picked,
            files.length,
            REPLY_UPLOAD_LIMITS
        );

        if (rejected.length) {
            const msg = summarizeRejections(rejected);
            setFileError(msg);
        } else {
            setFileError(null);
        }

        if (accepted.length) {
            setFiles((prev) => [...prev, ...accepted].slice(0, REPLY_UPLOAD_LIMITS.maxTotal));
        }

        e.currentTarget.value = "";
    }

    const replyFn = async () => {

        try{
            // first, upload attachments
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

            // second, post reply data
            const res = await request.post("/task-comments/reply", {
                "task_id": taskId,
                "comment_id": parentId,
                "commenter_user_id": userData?.id,
                "content": content,
                "attachments": uploadUrls
            });
            if(res.code === 0 && res.data > 0){
                onSuccess();
            }
        }catch(e){
            console.error(e);
        }finally{
            setSubmitting(false);
        }
    }

    const handleContent = (e) => {
        setContent(e.target.value);
    }

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
                <TextField
                    placeholder="Write a reply…" 
                    onChange={handleContent}
                    value={content}
                    multiline
                    rows={3}
                    fullWidth
                    sx={{
                        "& .MuiInputBase-root": {
                            bgcolor: theme.palette.background.paper,
                        },
                    }}
                />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    useFlexGap
                    sx={{ flexWrap: "wrap", rowGap: 1 }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                        <Button
                            component="label"
                            size="small"
                            startIcon={<ImageIcon />}
                            disabled={files.length >= REPLY_UPLOAD_LIMITS.maxTotal}
                            sx={{ whiteSpace: "nowrap", textTransform: "none" }}
                        >
                            Add image
                            <input hidden type="file" accept="image/*" multiple onChange={pickFiles} />
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                            {files.length}/{REPLY_UPLOAD_LIMITS.maxTotal}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                        <Button onClick={onCancel} size="small" sx={{textTransform: "none"}}>Cancel</Button>
                        <Button 
                            onClick={replyFn} 
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={content === ""} 
                            sx={{textTransform: "none"}}
                            startIcon={
                                (submitting || uploadingStates.some(Boolean)) && (
                                    <CircularProgress size={14} sx={{ color: "inherit" }} />
                                )
                            }
                        >
                            Reply
                        </Button>
                    </Stack>
                </Stack>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                >
                    Images ≤ {REPLY_UPLOAD_LIMITS.maxImageMB}MB. Max {REPLY_UPLOAD_LIMITS.maxTotal} files.
                </Typography>
                {fileError && (
                    <Typography
                        variant="caption"
                        color="error"
                        sx={{
                            mt: 0.5,
                            display: "block",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere", // allows long filenames to wrap
                        }}
                    >
                    {fileError}
                    </Typography>
                )}
                
                {files.length > 0 && (
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {files.map((f, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    position: "relative",
                                    width: 70,
                                    height: 70,
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    boxShadow: 1,
                                    cursor: "pointer",
                                    "&:hover .del": { opacity: 1 },
                                }}
                                onClick={() => !uploadingStates[idx] && setPreview(URL.createObjectURL(f))}
                            >
                            
                            <img
                                src={URL.createObjectURL(f)}
                                alt="thumb"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />

                            {/* uploading mask */}
                            {uploadingStates[idx] && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        bgcolor: "rgba(255,255,255,.6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CircularProgress size={22} />
                                </Box>
                            )}

                            {/* delete btn */}
                            <IconButton
                                size="small"
                                className="del"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFiles((arr) => arr.filter((_, i) => i !== idx));
                                }}
                                sx={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    bgcolor: "rgba(255,255,255,.85)",
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