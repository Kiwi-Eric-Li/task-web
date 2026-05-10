import {useState, useEffect} from 'react'; 
import {useSelector} from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function HowItWorks(){
    const {activeRole} = useSelector(state => state.activeRole);
    const posterSteps = [
        {
            icon: DescriptionOutlined,
            title: "Post your task",
            description:
                "Describe what you need done. Budget is optional—get offers and decide.",
        },
        {
            icon: GroupOutlined,
            title: "Compare offers & profiles",
            description:
                "Review tasker profiles, ratings, and offers. Choose who's right for you.",
        },
        {
            icon: TaskAltIcon,
            title: "Pay when it's done",
            description: "Confirm completion and pay securely. Rate your experience.",
        }
    ];

    const taskerSteps = [
        {
            icon: SearchOutlined,
            title: "Create profile",
            description:
                "Fast signup—no verification required. Add your skills and availability.",
        },
        {
            icon: ChatBubbleOutline,
            title: "Browse tasks & send offers",
            description:
                "Find tasks near you. Send offers with your price and availability.",
        },
        {
            icon: TaskAltIcon,
            title: "Complete tasks and get paid",
            description: "Do great work, get paid, and build your reputation.",
        }
    ]

    const [steps, setSteps] = useState(posterSteps);

    useEffect(()=>{
        if(activeRole === 'poster'){
            setSteps(posterSteps);
        }else{
            setSteps(taskerSteps);
        }
    }, [activeRole]);

    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
                <Box sx={{mb: 6, textAlign: 'center'}}>
                    <Typography variant="h1" sx={{mb: 1, fontSize: 40, fontWeight: 700}}>How it works</Typography>
                    <Typography variant="p" sx={{maxWidth: 700, mx: 'auto', fontSize: {md: 18}, color: (t) => t.palette.text.secondary}}>
                        {
                            activeRole === 'poster' ? "Get help in three simple steps" : "Start earning in three simple steps" 
                        }
                    </Typography>
                </Box>
                <Grid container spacing={3} sx={{ maxWidth: 1000, mx: "auto" }} alignItems="stretch" justifyContent="center">
                    {
                        steps.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Grid size={{ xs: 12, md: 4 }} key={`${item.title}-${index}`} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Card 
                                        variant="outlined"
                                        sx={{
                                            position: "relative",
                                            borderWidth: 2,
                                            borderColor: (t) => t.palette.divider,
                                            minHeight: { xs: 200, md: 240 },
                                            maxWidth: 680,
                                            height: "100%",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            mx: "auto",
                                        }}
                                    >
                                        <CardContent sx={{ pt: 3, display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                                            <Box 
                                                sx={{
                                                    mb: 2,
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 1.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    alignSelf: "center",
                                                    mx: "auto",
                                                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                                                }}
                                            >
                                                <Icon sx={{
                                                    fontSize: 24,
                                                    color: (t) => t.palette.primary.main,
                                                }} />
                                            </Box>
                                            <Box 
                                                sx={{
                                                    mb: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    minHeight: { xs: 56, md: 84 },
                                                }}
                                            >
                                                <Box 
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        bgcolor: (t) => t.palette.primary.main,
                                                        color: (t) => t.palette.primary.contrastText,
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        flex: "0 0 auto",
                                                    }}
                                                    aria-label={`Step ${index + 1}`}>
                                                    {index+1}
                                                </Box>
                                                <Typography variant="h3" sx={{fontSize: 21, fontWeight: 700}}>{item.title}</Typography>
                                            </Box>
                                            <Typography variant="p" sx={{color: (t) => t.palette.text.secondary, lineHeight: 1.7, fontSize: 12}}>{item.description}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </Box>
    )
}