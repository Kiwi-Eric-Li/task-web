import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,

} from '@mui/material';

import request from "../../utils/request";
import ProfileHeaderCard from './ProfileHeaderCard';
import RoleToggle from './RoleToggle';
import AboutCard from './AboutCard';
import ReviewsCard from './ReviewsCard';
import theme from "../../utils/theme"


export default function TaskProfile(){
    const {userid} = useParams();
    const [role, setRole] = useState('tasker');
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [tab, setTab] = useState({
        poster_stats: {
            posted_total: 1, 
            hired_total: 0, 
            completed: 0, 
            completion_rate: 0, 
            ratings_received_count: 0,
            ratings_received_avg: null
        },
        reviews: {
            rows: [], 
            total: 0
        },
        role: "poster",
        tasker_stats: null
    });

    const ratingAvg =
        role === 'tasker'
        ? tab?.tasker_stats?.ratings_received_avg ?? null
        : tab?.poster_stats?.ratings_received_avg ?? null;

    const ratingCount =
        role === 'tasker'
        ? tab?.tasker_stats?.ratings_received_count ?? 0
        : tab?.poster_stats?.ratings_received_count ?? 0;


    const [profile, setProfile] = useState({});

    const [taskerStats, setTaskerStats] = useState({
        completed: 0,
        list: [],
        ratingCount: 0,
        averageRating: 0
    });

    const [posterStats, setPosterStats] = useState({
        
    });
    
    useEffect(() => {
        // 根据userid, 请求后端接口，获取profile数据
        async function getUserInfo(){
            const res = await request.get(`/auth/${userid}/info`);
            if(res.code === 0){
                setProfile(res.data);
            }
        }

        async function getCompletedList(){
            const res = await request.get(`/tasks/${userid}/completed-list`);
            
            if(res.code === 0){
                setTaskerStats({
                    completed: res.data.length,
                    list: res.data,
                    ratingCount: res.rating_count,
                    averageRating: res.average_rating
                });
            }
        }
        
        async function getTaskInfo(){

        }

        getUserInfo();
        getCompletedList();
        getTaskInfo();
        
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{paddingTop: '90px', paddingBottom: '32px'}}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} sx={{px: '24px'}}>
                        <Grid size={{xs: 12, md: 4}}>
                            <ProfileHeaderCard role={role} profile={profile} taskerStats={taskerStats} posterStats={posterStats}/>
                        </Grid>
                        <Grid size={{xs: 12, md: 8}}>
                            <Stack spacing={2.5}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            About {profile?.username ?? (loadingProfile ? '' : '—')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {role === 'tasker' ? 'Tasker profile' : 'Poster profile'}
                                        </Typography>
                                    </Box>
                                    <RoleToggle role={role} onChange={setRole} />
                                </Stack>

                                <AboutCard bio={profile?.bio ?? null} loading={loadingProfile} />
                                <ReviewsCard
                                    role={role}
                                    reviews={tab?.reviews.rows ?? []}
                                    ratingSummary={{ value: ratingAvg, count: ratingCount }}
                                />    
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    )
}