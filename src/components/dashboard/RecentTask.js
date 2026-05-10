import {useState} from 'react'
import {Link} from 'react-router-dom'
import {
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import { HistoryOutlined } from "@mui/icons-material";

export default function RecentTask(){

    const [tasks, setTasks] = useState([
        {
            "id": 878,
            "title": "Help create a simple flyer for my local bakery",
            "budget": "180",
            "location": null,
            "type": "remote",
            "schedule_time": "Sun, 19 Apr 2026 20:30:00 GMT",
            "created_at": "Sat, 18 Apr 2026 12:20:20 GMT"
        },
        {
            "id": 876,
            "title": "Install new outdoor security light",
            "budget": "180",
            "location": "Lower Hutt, Wellington",
            "type": "offline",
            "schedule_time": "Tue, 21 Apr 2026 03:00:00 GMT",
            "created_at": "Sun, 19 Apr 2026 12:20:27 GMT"
        },
        {
            "id": 877,
            "title": "Repair small garden brick wall in Henderson",
            "budget": "120",
            "location": "Henderson, Auckland",
            "type": "offline",
            "schedule_time": "Mon, 20 Apr 2026 02:00:00 GMT",
            "created_at": "Sun, 19 Apr 2026 12:20:39 GMT"
        },
        {
            "id": 875,
            "title": "Replace loose roof tiles after recent wind",
            "budget": "80",
            "location": "Henderson, Auckland",
            "type": "offline",
            "schedule_time": "Mon, 20 Apr 2026 06:00:00 GMT",
            "created_at": "Sat, 18 Apr 2026 12:20:20 GMT"
        },
        {
            "id": 874,
            "title": "Remove small fallen tree branch from backyard",
            "budget": "120",
            "location": "Palmerston North Central, Palmerston North",
            "type": "offline",
            "schedule_time": "Sun, 19 Apr 2026 19:30:00 GMT",
            "created_at": "Sat, 18 Apr 2026 12:20:13 GMT"
        },
        {
            "id": 873,
            "title": "Replace sliding door rollers in Napier South",
            "budget": "180",
            "location": "Napier South, Napier",
            "type": "offline",
            "schedule_time": "Sun, 19 Apr 2026 05:30:00 GMT",
            "created_at": "Sat, 18 Apr 2026 12:20:06 GMT"
        }
    ])

    const formatMoney = (obj) => {
        if (!obj.budget) return "Open to offers"

        const amount = obj.budget

        if (obj.budget_type === "hourly") {
            return `${amount}/hr`
        }
        return amount
    }

    const getWhen = (obj) => {
        return obj.schedule_time ? new Date(obj.schedule_time).toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            weekday: "short"
        }) : "-";
    }

    const formatPostedLabel = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();

        // Compare calendar days in local time
        const startOfDay = (d) =>
            new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const diffMs = startOfDay(now).getTime() - startOfDay(created).getTime();
        const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        if (diffDays === 0) return "Posted today";
        if (diffDays === 1) return "Posted yesterday";
        return `Posted ${diffDays} days ago`;
    }

    return (
        <Box
            component="section"
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) => `${alpha(theme.palette.secondary.main, 0.3)}`,
                py: { xs: 8, md: 12 },
            }}
        >
            <Container maxWidth="lg">
                <Box 
                    sx={{
                        mb: 4,
                        gap: 2,
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                    }}>
                        <Box>
                            <Typography variant="h2" sx={{ mb: 0.5, fontSize: 40, fontWeight: 600 }}>
                                Recent tasks
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ fontSize: { md: 18 } }}
                            >
                                Start earning today—browse all opportunities
                            </Typography>
                        </Box>
                        <Button 
                            component={Link}
                            to="/task/task-list"
                            size="large"
                            variant="contained"
                            endIcon={<ArrowForwardRounded />}
                            sx={{ textTransform: 'none', alignSelf: { xs: "stretch", sm: "center" }}}>
                            Browse all tasks
                        </Button>
                </Box>
                <Grid container spacing={2}>
                    {
                        tasks.map((item, index) => {
                            return (
                                <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Card 
                                        variant="outlined"
                                        sx={{
                                            height: "100%",
                                            transition: "box-shadow .2s ease",
                                            "&:hover": {
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                                display: "flex",
                                                flexDirection: "column",
                                            },
                                        }}>
                                        <CardContent 
                                            sx={{
                                            p: 2.5,
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                        }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography 
                                                    variant="h3" 
                                                    sx={{
                                                        mb: 1.5,
                                                        fontSize: 18,
                                                        fontWeight: 600,
                                                        lineHeight: 1.35,
                                                }}>
                                                    {item.title}
                                                </Typography>
                                                <Stack spacing={1.0} sx={{ color: (t) => t.palette.text.secondary, fontSize: 14 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <PlaceOutlined fontSize="small" />
                                                        <Typography variant="body2">{item.location ?? 'Remote'}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <AttachMoneyOutlined fontSize="small" />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: (t) => t.palette.text.primary, fontWeight: 600 }}
                                                        >
                                                            {formatMoney(item)}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <AccessTimeOutlined fontSize="small" />
                                                        <Typography variant="body2">{getWhen(item)}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <HistoryOutlined fontSize="small" />
                                                        <Typography variant="body2">
                                                            {formatPostedLabel(item.created_at)}
                                                        </Typography>
                                                    </Box>

                                                </Stack>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{ mt: 2, textTransform: 'none' }}>
                                                View details
                                            </Button>
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


