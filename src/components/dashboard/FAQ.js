import {useState, useEffect} from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material/styles";


export default function FAQ(){
    const [activeRole, setActiveRole] = useState('poster');
    const [expanded, setExpanded] = useState('poster-0');

    const posterFAQs = [
        {
            q: "How do offers work?",
            a: "After you post a task, taskers can send you offers with their proposed price and availability. You can chat directly with them, review their profiles, and choose who you’d like to work with.",
        },
        {
            q: "Do I need to set a budget?",
            a: "No, setting a budget is optional. You can leave it blank and let taskers suggest their own prices. This helps you compare and find a fair rate for your task.",
        },
        {
            q: "How fast can someone accept my task?",
            a: "Many tasks receive offers within minutes of posting. It depends on your location, task type, and time of day — you'll get notified as soon as someone sends an offer.",
        },
        {
            q: "Is there a fee to post tasks?",
            a: "No fees at all! Posting tasks and hiring taskers are completely free. Payments are handled directly between you and the tasker — we don’t take any cut or charge any service fees.",
        },
        {
            q: "Do I need to verify my identity?",
            a: "No identification or verification is required. You can start posting tasks right away without any lengthy setup.",
        },
    ];

    const taskerFAQs = [
        {
            q: "Do I need verification to start?",
            a: "No verification needed. Simply create your profile, list your skills, and you can start browsing and sending offers immediately.",
        },
        {
            q: "Are there any platform fees?",
            a: "None at all! Using the platform is 100% free — we don’t charge you or the task poster any commission or fees.",
        },
        {
            q: "How do I get paid?",
            a: "You and the task poster arrange payment directly. We don’t hold or process money on the platform, so you’re free to agree on whatever payment method works best for both of you.",
        },
        {
            q: "Can I choose which tasks to take?",
            a: "Absolutely. You have full control — browse available tasks, make offers on the ones you like, and accept jobs that suit your skills and schedule.",
        },
    ];

    const [faqs, setFaqs] = useState(posterFAQs);

    useEffect(() => {
        if(activeRole === 'poster'){
            setFaqs(posterFAQs);
        }else{
            setFaqs(taskerFAQs);
        }
    }, [activeRole]);


    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: 28, md: 36, lg: 44 },
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Frequently asked questions
                    </Typography>
                </Box>
                <Tabs 
                    value={activeRole} 
                    onChange={(e, v) => setActiveRole(v)} 
                    variant="fullWidth" 
                    sx={{
                        mx: "auto",
                        mb: {xs: 5, md: 6},
                        maxWidth: 420,
                        p: 0.5,
                        borderRadius: 999,
                        bgcolor: (t) => t.palette.secondary.main,
                        boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.divider, 0.6)}`,
                        "& .MuiTabs-indicator": { display: "none" },
                        "& .MuiTab-root": {
                            minHeight: 44,
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 600,
                            color: (t) => t.palette.text.primary,
                        },
                        "& .Mui-selected": {
                            bgcolor: (t) => t.palette.background.paper,
                            color: (t) => t.palette.text.primary,
                            boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
                            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.7)}`
                        },
                    }}
                >
                    <Tab value="poster" label="For Posters" disableRipple />
                    <Tab value="tasker" label="For Taskers" disableRipple />
                </Tabs>
                <Box sx={{ maxWidth: 768, mx: "auto" }}>
                    {
                        faqs.map((item, index) => {
                            const id = `${activeRole}-${index}`;
                            const isLast = index === faqs.length - 1;
                            return (
                                <Accordion
                                key={id}
                                expanded={expanded === id}
                                onChange={(_, isExp) => setExpanded(isExp ? id : false)}
                                disableGutters
                                elevation={0}
                                square
                                sx={{
                                    px: 0,
                                    "&:before": { display: "none" },
                                    borderBottom: (theme) =>  isLast ? "none" : `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        px: 0,
                                        py: 1.25,
                                        "& .MuiAccordionSummary-content": { my: 0.5, mr: 2 },
                                    }}
                                >
                                    <Typography component="h3" sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 700 }}>
                                        {item.q}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 0, pb: 2 }}>
                                    <Typography color="text.secondary" sx={{ lineHeight: 1.8, fontSize: { xs: 14, md: 15 } }}>
                                        {item.a}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            )
                        })
                    }
                </Box>
            </Container>
        </Box>
    )
}
