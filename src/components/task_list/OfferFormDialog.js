import {useState, useEffect} from 'react' 

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
import { useForm, Controller } from "react-hook-form";

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

    const { control, handleSubmit, reset, formState: { errors } } = useForm({});
    const countWords = (s) => (s.trim().match(/\S+/g)?.length ?? 0);
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        if (open) {
            reset({
                price: "",
                message: "",
            });
            setFiles([]);
            setFileError(null);
            setLightbox(null);
        }
    }, [open, reset]);


    const handleFiles = () => {

    }

    const onSubmit = () => {

    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
                <DialogTitle fontWeight={700}>
                    Make an Offer
                    <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {/* price */}
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Price (NZD)"
                                    type="text"
                                    inputMode="numeric"
                                    inputProps={{ pattern: "[0-9]*" }}
                                    size="small"
                                    fullWidth
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/[^\d]/g, ""); // digits only
                                        field.onChange(cleaned);
                                    }}
                                    onKeyDown={(e) => {
                                        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                                        if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
                                    }}
                                    error={!!errors.price}
                                    helperText={errors.price?.message}
                                />
                            )}
                        />
                        {/* message */}
                        <Controller
                            name="message"
                            control={control}
                            render={({ field }) => {
                                const wc = countWords(field.value ?? "");
                                return (
                                    <TextField
                                        {...field}
                                        label="Message (optional)"
                                        multiline
                                        rows={4}
                                        size="small"
                                        fullWidth
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                        const v = e.target.value;
                                        const words = v.match(/\S+/g) || [];
                                        const limited = words.length > MAX_MESSAGE_WORDS
                                            ? words.slice(0, MAX_MESSAGE_WORDS).join(" ")
                                            : v;
                                        field.onChange(limited);
                                        }}
                                        error={!!errors.message}
                                        helperText={errors.message?.message ?? "Max 300 words"}
                                    />
                                );
                            }}
                        />

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button 
                                sx={{textTransform: "none"}}
                                component="label"
                                startIcon={<UploadFile />}
                                variant="outlined"
                                size="small"
                                disabled={files.length >= OFFER_UPLOAD_LIMITS.maxTotal}>
                                Upload (max {OFFER_UPLOAD_LIMITS.maxTotal})
                                <input hidden type="file" accept="image/*" multiple onChange={handleFiles} />
                            </Button>
                            <Typography variant="caption" color="text.secondary">
                                {files.length}/{OFFER_UPLOAD_LIMITS.maxTotal} selected
                            </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            Allowed: JPG, PNG, WEBP, GIF. Images ≤ {OFFER_UPLOAD_LIMITS.maxImageMB}MB. Max {OFFER_UPLOAD_LIMITS.maxTotal} files.
                        </Typography>
                        {fileError && (
                            <Typography variant="caption" color="error" sx={{ whiteSpace: "pre-line", mt: 0.5, display: "block" }}>
                                {fileError}
                            </Typography>
                        )}

                        {files.length > 0 && (
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {files.map((f, idx) => (
                                    <Box key={idx} position="relative">
                                        <Avatar
                                            variant="rounded"
                                            src={URL.createObjectURL(f)}
                                            sx={{ width: 80, height: 80, cursor: "pointer" }}
                                            onClick={() => setLightbox(URL.createObjectURL(f))}
                                        />
                                        {/* remove btn */}
                                        <IconButton
                                            size="small"
                                            onClick={() => setFiles((arr) => arr.filter((_, i) => i !== idx))}
                                            sx={{
                                                position: "absolute",
                                                top: -10,
                                                right: -10,
                                                bgcolor: "background.paper",
                                                boxShadow: 1,
                                                "&:hover": { bgcolor: "error.main", color: "#fff" },
                                            }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={submitting} sx={{textTransform: "none"}}>
                        Cancel
                    </Button>
                    <Button 
                        sx={{textTransform: "none"}}
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        disabled={submitting}
                        startIcon={
                            submitting ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined
                        }>
                        Submit Offer
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={!!lightbox}
                onClose={() => setLightbox(null)}
                maxWidth="md"
                PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}
            >
                <DialogContent sx={{ p: 0 }}>
                {lightbox && (
                    <img src={lightbox} alt="preview" style={{ width: "100%" }} />
                )}
                </DialogContent>
            </Dialog>
        </>
    )
}