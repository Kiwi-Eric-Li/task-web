import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import {
  Box, 
  Container,
  Tabs, 
  Tab,
  Typography,
  Stack,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import WorkOutline from "@mui/icons-material/WorkOutline";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";

import theme from "../../utils/theme"
import {setActiveRole} from '../../store/modules/activeRoleReducer'
import request from "../../utils/request"

const MAX_TITLE_LENGTH = 80

export default function SearchTask(){
    const dispatch = useDispatch();

    const [role, setRole] = useState('poster');
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [skill, setSkill] = useState("");
    const [location, setLocation] = useState("");
    const [allCategories, setAllCategories] = useState([]);

    const handleRole = (val) => {
        setRole(val);
        dispatch(setActiveRole(val));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("<<<<<<<<<<<<");
    }

    useEffect(() => {

        async function fetchCategories(){
            try{
                const taskCategories = await request.get("/task-category");
                setAllCategories(taskCategories);
            } catch (err) {
                console.error("Failed to fetch task categories", err);
            }
        }

        fetchCategories();
    }, []);


    return (
        <Box sx={{
            py: {xs: 8, md: 12},
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.07)
        }}>
            <Container maxWidth="lg">
                <Tabs 
                    value={role} 
                    onChange={(e, newVal) => handleRole(newVal)}
                    sx={{
                        maxWidth: 512,
                        mx: "auto",
                        mb: 6,
                        p: 0.5,
                        borderRadius: 999,
                        bgcolor: (t) => t.palette.background.paper,
                        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                        "& .MuiTabs-indicator": { display: "none" },
                    }}
                >
                    <Tab 
                        value="poster"
                        label="I need help" 
                        icon={<LocationOnOutlined fontSize="small" />}
                        iconPosition="start" 
                        sx={{
                            flex: 1, minHeight: 44, borderRadius: 999, textTransform: "none", fontWeight: 700, color: (t) => t.palette.text.primary,
                            "&.Mui-selected": { bgcolor: (t) => t.palette.primary.main, color: (t) => t.palette.primary.contrastText },
                        }}
                    />
                    <Tab 
                        value="tasker"
                        label="I want to earn" 
                        icon={<WorkOutline fontSize="small" />}
                        iconPosition="start" 
                        sx={{
                            flex: 1, minHeight: 44, borderRadius: 999, textTransform: "none", fontWeight: 700, color: (t) => t.palette.text.primary,
                            "&.Mui-selected": { bgcolor: (t) => t.palette.primary.main, color: (t) => t.palette.primary.contrastText },
                        }}
                    />
                </Tabs>
                
                {/* headline */}
                <Box sx={{mb: 4}} textAlign="center">
                    <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 44, lg: 56 }, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                        {role === 'poster' ? 'Post a task. Get offers. Done.' : 'Turn spare hours into income'}
                    </Typography>

                    <Typography variant="h6" sx={{mt: 1, color: (t) => t.palette.text.secondary}}>
                        {role === 'poster' ? 'Get local help today' : 'Find nearby tasks—start today'}
                    </Typography>

                    <Typography sx={{mt: 0.75, fontWeight: 700, fontSize: 12, color: (t) => t.palette.primary.main}}>
                        Start in minutes—no ID checks or verification required
                    </Typography>
                </Box>
                
                {/* headline */}
                <Paper 
                    elevation={6}
                    component="form"
                    onSubmit={onSubmit} 
                    sx={{
                        mx: 'auto',
                        maxWidth: 1200,
                        p: {xs: 2, md: 3},
                        borderRadius: 4,
                        bgcolor: (t) => t.palette.background.paper,
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)"
                    }}
                >
                    {
                        role === 'poster' 
                            ? <Box 
                                sx={{
                                    display: "grid",
                                    gap: { xs: 2, md: 1.5 },
                                    gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr auto" },
                                    alignItems: "center",
                                }}>
                                    <TextField
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="What do you need done?"
                                        aria-label="task description"
                                        variant="outlined" 
                                        autoComplete="off"
                                        fullWidth
                                        inputProps={{ maxLength: MAX_TITLE_LENGTH }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                                "& .MuiInputBase-input": { py: { xs: 1.5, md: 2 }, fontSize: { xs: 15, md: 16 } },
                                            },
                                        }}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={category}
                                            label="Category"
                                            onChange={(e) => setCategory(e.target.value)} 
                                            sx={{
                                                borderRadius: 3,
                                                "& .MuiOutlinedInput-input": { py: { xs: 1.5, md: 2 }, fontSize: { xs: 15, md: 16 } },
                                            }}
                                        >
                                            {
                                                allCategories.map((item, index) => {
                                                    return (
                                                        <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardRounded />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 3,
                                            px: { xs: 2.5, md: 4 },
                                            fontWeight: 800,
                                            fontSize: { xs: 15, md: 16 },
                                            whiteSpace: "nowrap",
                                            minHeight: { xs: 56, md: 64 },
                                        }}
                                    >
                                        Get offers
                                    </Button>
                              </Box>
                            : <Box 
                                sx={{
                                    display: "grid",
                                    gap: { xs: 2, md: 1.5 },
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
                                    alignItems: "center",
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="hero-skill-label">What can you do?</InputLabel>
                                        <Select 
                                            labelId="hero-skill-label" 
                                            value={skill}
                                            onChange={(e) => setSkill(e.target.value)}
                                            label="What can you do?"
                                            sx={{
                                                borderRadius: 3,
                                                "& .MuiOutlinedInput-input": { py: { xs: 1.5, md: 2 }, fontSize: { xs: 15, md: 16 } }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>All skills</em>
                                            </MenuItem>
                                            {
                                                allCategories.map((item, index) => {
                                                    return (
                                                        <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Location"
                                        aria-label="location"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PlaceOutlined fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                                "& .MuiInputBase-input": { py: { xs: 1.5, md: 2 }, fontSize: { xs: 15, md: 16 } },
                                            },
                                        }}
                                    />

                                    <Button 
                                        component={Link} 
                                        to="/task/task-list"
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardRounded />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 3,
                                            px: { xs: 2.5, md: 4 },
                                            fontWeight: 800,
                                            fontSize: { xs: 15, md: 16 },
                                            whiteSpace: "nowrap",
                                            minHeight: { xs: 56, md: 64 },
                                        }}
                                    >
                                        Browse tasks
                                    </Button>
                            </Box>
                    }
                </Paper>

                <Stack 
                    direction="row"
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={3}
                    sx={{ mt: 4, color: (t) => t.palette.text.secondary, "& svg": { color: (t) => t.palette.primary.main } }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
                        <LocationOnOutlined fontSize="small" />
                        <Typography>NZ-based</Typography>
                    </Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
                        <AccessTimeOutlined fontSize="small" />
                        <Typography>Fast signup</Typography>
                    </Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
                        <ChatBubbleOutline fontSize="small" />
                        <Typography>Real-time messaging</Typography>
                    </Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
                        <AttachMoneyOutlined fontSize="small" />
                        <Typography>{role === "poster" ? "Flexible budgets" : "Get paid fast"}</Typography>
                    </Box>
                </Stack>
            </Container>
        </Box>
    )
}