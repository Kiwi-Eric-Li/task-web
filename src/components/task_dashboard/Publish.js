import {useState, useEffect} from 'react';

import {
    Box,
    Card,
    Container,
    CardContent,
    Typography,
    Stepper,
    StepConnector,
    Step,
    StepLabel,
    TextField,
    Button,
    Chip,
    Autocomplete,
    IconButton,
    Dialog,
    DialogContent,

} from '@mui/material';
import {
    AssignmentOutlined,
    EventAvailable,
    Category as CategoryIcon,
    CheckCircle,
    Close,
} from "@mui/icons-material";
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";


import TaskLocationInput from "./TaskLocationInput";
import theme from "../../utils/theme"
import request from "../../utils/request"
import {
  DEFAULT_MAX_IMAGE_MB,
  DEFAULT_MAX_VIDEO_MB,
  validateMediaFiles,
  summarizeRejections,
  describeMediaLimits,

} from "../../utils/media";

const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 5000;
const UPLOAD_LIMITS = {
    maxTotal: 5,
    maxImageMB: DEFAULT_MAX_IMAGE_MB,
    maxVideoMB: DEFAULT_MAX_VIDEO_MB,
};

export default function TaskPublish(){
    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [taskType, setTaskType] = useState('offline');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskTitleError, setTaskTitleError] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDescriptionError, setTaskDescriptionError] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateError, setSelectedDateError] = useState('');
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedTimeError, setSelectedTimeError] = useState('');
    const [selectedSuburb, setSelectedSuburb] = useState("");
    const [selectedSuburbError, setSelectedSuburbError] = useState('');
    const [pricingType, setPricingType] = useState(null);
    const [estimatedHours, setEstimatedHours] = useState("");
    const [budget, setBudget] = useState("");
    const [catList, setCatList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [lightbox, setLightbox] = useState(null);



    const today = dayjs().startOf("day");
    const maxFuture = today.add(6, "month");
    
    useEffect(() => {
        // Fetch category list from backend
        const fetchCategories = async () => {
            try {
                // Simulate an API call
                const response = await request.get("/task-category");
                if(response.code === 0){
                    setCatList(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const steps = [
        { label: "Basic Info", icon: AssignmentOutlined },
        { label: "Schedule & Budget", icon: EventAvailable },
        { label: "Categories & Files", icon: CategoryIcon },
    ];
    const connectorSx = { "& .MuiStepConnector-line": { borderColor: theme.palette.primary.main, borderTopWidth: 2 } };

    const StepIcon = (props) => {
        const { active, completed, className } = props;
        const Icon = steps[props.icon - 1].icon;
        return (
            <Box
                className={className}
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: completed || active ? theme.palette.primary.main : theme.palette.divider,
                    color: completed || active ? "#fff" : theme.palette.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Icon fontSize="small" />
            </Box>
        );
    };

    const handleSuburbChange = (value) => {
        setSelectedSuburb(value);
        if (value) {
            setSelectedSuburbError('');
        }
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    }

    const handleNext = () => {
        // 1. validate required item
        if(activeStep === 0){
            let flag = false;
            if (!taskTitle.trim()) {
                setTaskTitleError('Task Title is required');
                flag = true;
            } else {
                setTaskTitleError('');
            }

            // 校验 Description
            if (!taskDescription.trim()) {
                setTaskDescriptionError('Description is required');
                flag = true;
            } else {
                setTaskDescriptionError('');
            }

            if(!flag){
                setActiveStep(activeStep + 1);
            }
            return;
        }
        // 第二步校验
        if(activeStep === 1){
            let flag = false;
            // 校验 Date
            if (!selectedDate) {
                setSelectedDateError('Date is required');
                flag = true;
            } else {
                setSelectedDateError('');
            }

            // 校验 Time
            if (!selectedTime) {
                setSelectedTimeError('Time is required');
                flag = true;
            } else {
                setSelectedTimeError('');
            }

            // when taskType is offline, validate Suburb
            if (taskType === 'offline' && !selectedSuburb) {
                setSelectedSuburbError('Location is required for on-site tasks');
                flag = true;
            } else {
                setSelectedSuburbError('');
            }

            if(!flag){
                setActiveStep(activeStep + 1);
            }
            return;
        }

    }
    const handleFilesChange = (e) => {
        const picked = Array.from(e.target.files || []);
        if (picked.length === 0) return;

        const { accepted, rejected } = validateMediaFiles(
            picked,
            files.length,
            UPLOAD_LIMITS
        );

        if (rejected.length) {
            const message = summarizeRejections(rejected);
            setFileError(message);
        } else {
            setFileError(null);
        }


        if (accepted.length) {
            const previews = accepted.map((file) => ({ file, url: URL.createObjectURL(file) }));
            setFiles((prev) => [...prev, ...previews]);
        }

        // Reset input so selecting the same file again triggers onChange
        e.currentTarget.value = "";
    };

    const removeFile = (url) => setFiles((p) => p.filter((f) => f.url !== url));

    const handleSubmit = () => {

    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{paddingTop: '90px', paddingBottom: '32px'}}>
                <Container maxWidth="lg">
                    <Card sx={{ boxShadow: theme.shadows[2], mx: '24px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <CardContent>
                                <Typography variant="h5" fontWeight={700} align="center" mb={3}>
                                    Create a New Task
                                </Typography>
                                <Stepper
                                    activeStep={activeStep}
                                    connector={<StepConnector sx={connectorSx} />}
                                    alternativeLabel
                                    sx={{ mb: 4 }}>
                                    {steps.map((s) => (
                                        <Step key={s.label}>
                                            <StepLabel StepIconComponent={StepIcon}>{s.label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                {activeStep === 0 && (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            maxWidth: 900,
                                            mx: "auto",
                                            p: 3,
                                            bgcolor: theme.palette.background.paper,
                                        }}>
                                        {/* ——— Header ——— */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <AssignmentOutlined sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                                            <Typography variant="h6" fontWeight={600} ml={1}>
                                                Task Details
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" mb={3}>
                                            Clear briefs attract better taskers. Describe exactly what needs doing.
                                        </Typography>

                                        
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "4fr 8fr",
                                                },
                                                gap: 2,
                                            }}>
                                            {/* Task Type */}
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Where will the task be carried out?
                                                </Typography>
                                                <TextField
                                                    select
                                                    label="Task Type *"
                                                    SelectProps={{ native: true }}
                                                    fullWidth 
                                                    value={taskType} 
                                                    onChange={(e) => {
                                                        setTaskType(e.target.value);
                                                        // 切换时清除 suburb 状态
                                                        setSelectedSuburb(null);
                                                        setSelectedSuburbError('');
                                                    }}
                                                    sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}>
                                                    <option value="offline">On-site</option>
                                                    <option value="remote">Remote</option>
                                                </TextField>
                                            </Box>
                                            {/* Task Title */}
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    A short, punchy headline
                                                </Typography>
                                                <TextField
                                                    label="Task Title *" 
                                                    inputProps={{ maxLength: MAX_TITLE_LENGTH }}
                                                    fullWidth
                                                    value={taskTitle}
                                                    onChange={(e) => {
                                                        setTaskTitle(e.target.value);
                                                        if (e.target.value.trim()) {
                                                            setTaskTitleError('');
                                                        }
                                                    }}
                                                    error={!!taskTitleError}
                                                    helperText={taskTitleError}
                                                    sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}
                                                />
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ gridColumn: "1 / -1" }}>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                            List size, tools or special skills required
                                            </Typography>
                                            
                                            <TextField
                                                inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
                                                label="Description *"
                                                fullWidth
                                                multiline
                                                rows={6}
                                                value={taskDescription}
                                                onChange={(e) => {
                                                    setTaskDescription(e.target.value);
                                                    if (e.target.value.trim()) {
                                                        setTaskDescriptionError('');
                                                    }
                                                }}
                                                error={!!taskDescriptionError}
                                                helperText={taskDescriptionError}
                                                sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}    
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {
                                    activeStep === 1 && (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                maxWidth: 900,
                                                mx: "auto",
                                                p: 3,
                                                bgcolor: theme.palette.background.paper,
                                            }}>
                                                <Box display="flex" alignItems="center" mb={2}>
                                                    <EventAvailable sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                                                    <Typography variant="h6" fontWeight={600} ml={1}>
                                                        Schedule & Budget
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" mb={3}>
                                                    Pick any date/time within the next 6 months. Your task closes 30 days after the chosen start.
                                                </Typography>
                                                <Box
                                                    sx={{
                                                            display: "grid",
                                                            gridTemplateColumns: {
                                                            xs: "1fr",
                                                            md: "1fr 1fr",
                                                        },
                                                        rowGap: 3,
                                                        columnGap: 2,
                                                    }}>
                                                    {/* Preferred start date */}
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                                            Preferred start date
                                                        </Typography>
                                                        <DatePicker
                                                            label="Date *"
                                                            value={selectedDate ? dayjs(selectedDate) : null}
                                                            minDate={today}
                                                            maxDate={maxFuture}
                                                            onChange={(newValue) => {
                                                                setSelectedDate(newValue);
                                                                if (newValue) {
                                                                    setSelectedDateError('');
                                                                }
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    error: !!selectedDateError,
                                                                    helperText: selectedDateError,
                                                                    sx: {
                                                                        bgcolor: theme.palette.background.paper,
                                                                        mt: 2,
                                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    {/* Earliest convenient time */}
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                                            Earliest convenient time
                                                        </Typography>
                                                        <TimePicker
                                                            label="Time *"
                                                            ampm={false}
                                                            value={selectedTime}
                                                            onChange={(newValue) => {
                                                                setSelectedTime(newValue);
                                                                if (newValue) {
                                                                    setSelectedTimeError('');
                                                                }
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    error: !!selectedTimeError,
                                                                    helperText: selectedTimeError,
                                                                    sx: {
                                                                        bgcolor: theme.palette.background.paper,
                                                                        mt: 2,
                                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                                                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: 'black',
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    
                                                    {/* Pricing type */}
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                                            How will you pay?
                                                        </Typography>
                                                        <TextField
                                                            select
                                                            label="Pricing type *"
                                                            SelectProps={{ native: true }}
                                                            fullWidth
                                                            sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}
                                                            value={pricingType ?? "Fixed"}
                                                            onChange={(e) => setPricingType(e.target.value)}
                                                        >
                                                            <option value="Fixed">Fixed</option>
                                                            <option value="Hourly">Hourly</option>
                                                        </TextField>
                                                    </Box>
                                                    
                                                    {/* Estimated hours */}
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                                            Estimated hours (optional)
                                                        </Typography>
                                                        <TextField
                                                            label="Estimated hours (optional)"
                                                            fullWidth
                                                            type="text"
                                                            value={estimatedHours}
                                                            onChange={(e) => {
                                                                const cleaned = e.target.value.replace(/[^\d]/g, "")
                                                                setEstimatedHours(cleaned);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"]
                                                                if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) e.preventDefault()
                                                            }}
                                                            sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}
                                                        />
                                                    </Box>
                                                    
                                                    {/* Budget (optional) */}
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                                            Leave blank to let taskers quote
                                                        </Typography>
                                                        <TextField
                                                            label="Budget (optional)"
                                                            fullWidth
                                                            type="text"                                    
                                                            value={budget}
                                                            onChange={(e) => {
                                                                const cleaned = e.target.value.replace(/[^\d]/g, "");
                                                                setBudget(cleaned);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
                                                                if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
                                                            }}
                                                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                                            sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}
                                                        />
                                                    </Box>
                                                    
                                                    {/* Location (offline only) */}
                                                    {taskType === 'offline' && (
                                                        <TaskLocationInput
                                                            selectedSuburb={selectedSuburb}
                                                            onPlaceSelect={handleSuburbChange}
                                                            error={selectedSuburbError}
                                                        />
                                                    )}

                                                </Box>
                                        </Box>
                                    )
                                }
                                {
                                    activeStep === 2 && (
                                        <Box 
                                            sx={{
                                                width: "100%",
                                                maxWidth: 900,
                                                mx: "auto",
                                                p: 3,
                                                bgcolor: theme.palette.background.paper,
                                            }}>
                                            
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <CategoryIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                                                <Typography variant="h6" fontWeight={600} ml={1}>
                                                    Categories & Files
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" mb={3}>
                                                Help us match the right taskers – pick at least one category.
                                            </Typography>
                                            <Autocomplete
                                                multiple
                                                options={catList}
                                                getOptionLabel={(o) => o.title}
                                                value={selected}
                                                onChange={(event, newValue) => setSelected(newValue)}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                    <Chip
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                        color="primary"
                                                        label={
                                                        <Typography variant="body1">
                                                            {option.title}
                                                        </Typography>
                                                        }
                                                    />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Categories *"
                                                        sx={{ bgcolor: theme.palette.background.paper, mt: 2 }}
                                                    />
                                                )}
                                            />

                                            <Box mb={2} sx={{mt: '20px'}}>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Upload Images / Videos (max {UPLOAD_LIMITS.maxTotal})
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main, textTransform: "none", ml: 1 }}
                                                    disabled={files.length >= UPLOAD_LIMITS.maxTotal}>
                                                    Select Files
                                                    <input
                                                        hidden
                                                        multiple
                                                        type="file"
                                                        accept="image/*,video/*"        // gates picker UI
                                                        onChange={handleFilesChange}
                                                    />
                                                </Button>
                                                <Typography variant="caption" sx={{ display: "block", mt: 1 }} color="text.secondary">
                                                    {describeMediaLimits(UPLOAD_LIMITS)}
                                                </Typography>
                                                {fileError && (
                                                    <Typography variant="caption" color="error" sx={{ display: "block", whiteSpace: "pre-line", mt: 1 }}>
                                                        {fileError}
                                                    </Typography>
                                                )}
                                            </Box>
                                            
                                            {files.length > 0 && (
                                                <Box display="flex" flexWrap="wrap" gap={2}>
                                                    {files.map((f) => (
                                                        <Box key={f.url} position="relative">
                                                            {f.file.type.startsWith("image") ? (
                                                                <img
                                                                    src={f.url}
                                                                    alt={f.file.name}
                                                                    style={{
                                                                        width: 120,
                                                                        height: 120,
                                                                        objectFit: "cover",
                                                                        borderRadius: 8,
                                                                        border: "1px solid #e0e0e0",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => setLightbox(f.url)}
                                                                />
                                                            ) : (
                                                            <video
                                                                src={f.url}
                                                                style={{
                                                                width: 120,
                                                                height: 120,
                                                                objectFit: "cover",
                                                                borderRadius: 8,
                                                                border: "1px solid #e0e0e0",
                                                                cursor: "pointer",
                                                                }}
                                                                onClick={() => setLightbox(f.url)}
                                                            />
                                                            )}
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => removeFile(f.url)}
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 2,
                                                                    right: 2,
                                                                    bgcolor: "rgba(0,0,0,0.6)",
                                                                    color: "#fff",
                                                                }}>
                                                                <Close fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    )
                                }


                                {/* ---- buttons ---- */}
                                <Box mt={4} display="flex" justifyContent="space-between">
                                    <Button disabled={activeStep === 0} onClick={handleBack}>
                                        Back
                                    </Button>
                                    {activeStep < steps.length - 1 ? (
                                        <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ bgcolor: theme.palette.primary.main }}
                                        disabled={activeStep === 2 }>
                                        Next
                                        </Button>
                                    ) : (
                                        <Button
                                        variant="contained"
                                        sx={{ bgcolor: theme.palette.primary.main }}
                                        disabled={submitting || (activeStep === 2)}
                                        onClick={() => handleSubmit()}>
                                            {submitting ? "Publishing…" : "Publish Task"}
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                            
                            <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="md">
                                <DialogContent sx={{ p: 0 }}>
                                    {lightbox && (
                                        <img src={lightbox} alt="preview" style={{ width: "100%" }} />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </LocalizationProvider>
                    </Card>
                </Container>
            </Box>
        </ThemeProvider>
    )
}
