import {useState} from 'react';

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



import theme from "../../utils/theme"

const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 5000;

export default function TaskPublish(){
    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [pricingType, setPricingType] = useState(null);
    const [estimatedHours, setEstimatedHours] = useState("");
    const [budget, setBudget] = useState("");

    const today = dayjs().startOf("day");
    const maxFuture = today.add(6, "month");
   

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

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    }

    const handleNext = () => {
        // 1. validate required item

        // 2. activeStep++
        setActiveStep(activeStep + 1);
    }

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
                                                            onChange={(newValue) => setSelectedDate(newValue)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
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
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
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
                                                    
                                                    
                                                </Box>
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
                        </LocalizationProvider>
                    </Card>
                </Container>
            </Box>
        </ThemeProvider>
    )
}