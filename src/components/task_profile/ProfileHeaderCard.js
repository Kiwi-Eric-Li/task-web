import {useState, useEffect} from 'react'
import {
  Paper,
  Stack,
  Avatar,
  Typography,
  Divider,
  Box
} from '@mui/material';

import KpiProgress from './KpiProgress';
import RatingSummary from './RatingSummary';
import ProfileTasksModal from './ProfileTasksModal';

export default function ProfileHeaderCard({role, profile, taskerStats, posterStats}){
    
    const [openModal, setOpenModal] = useState(null);

    const handleOpenTaskerCompleted = () => {
        setOpenModal("taskerCompleted");
    }
    
    const handleCardKeyDown = (e, target) => {
        e.preventDefault();
    }

    const handleOpenPosterPosted = () => {
        setOpenModal("posterPosted");
    }

    const handleOpenPosterHired = () => {
        setOpenModal("posterHired");
    }

    const handleOpenPosterCompleted = () => {
        setOpenModal("posterCompleted");
    }

    const handleCloseModal = () => {
        setOpenModal(null);
    }

    return (
        <Paper elevation={0} variant="outlined" sx={{p: 3, borderRadius: 3, position: {md: 'sticky'}, top: {md: 24}, overflow: 'hidden'}}>
            <Stack alignItems="center" spacing={2} textAlign="center">
                <Avatar src={profile?.avatar_url} sx={{width: 96, height: 96}}/>
                <Typography variant="h5" fontWeight={700}>
                    {profile?.username}
                </Typography>
                <Divider sx={{my: 2, alignSelf: 'stretch'}} />

                {
                    role === 'tasker' ? (
                    <Stack spacing={2} sx={{alignSelf: 'stretch'}}>
                        <KpiProgress label="Completion rate" value={taskerStats?.completion_rate || 0}/>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 1.5,
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                alignItems: 'stretch',
                            }}>
                            <Paper
                                variant="outlined"
                                onClick={handleOpenTaskerCompleted}
                                onKeyDown={(event) =>
                                    handleCardKeyDown(event, 'taskerCompleted')
                                }
                                sx={{
                                    p: 1.75,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    height: '100%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition:
                                        'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        boxShadow: 2,
                                        transform: 'translateY(-2px)',
                                        borderColor: 'primary.main',
                                    },
                                    '&:focus-visible': {
                                        outline: '2px solid',
                                        outlineColor: 'primary.main',
                                        outlineOffset: 2,
                                    },
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="View completed tasks">
                                    <Stack spacing={0.75} alignItems="center">
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                        >
                                            Jobs completed
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {taskerStats?.completed ?? 0}
                                        </Typography>
                                </Stack>
                            </Paper>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.75,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    height: '100%',
                                    display: 'grid',
                                    placeItems: 'center',
                                    textAlign: 'center',
                                }}>
                                    <Stack spacing={0.75} alignItems="center" sx={{ width: '100%' }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                        >
                                            Average rating
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            <RatingSummary
                                                value={taskerStats?.averageRating ?? 0}
                                                count={taskerStats?.ratingCount ?? 0}
                                            />
                                        </Box>
                                    </Stack>
                            </Paper>
                        </Box>
                    </Stack>) : (
                    <Stack spacing={2} sx={{ alignSelf: 'stretch' }}>
                        <KpiProgress label="Completion rate" value={posterStats?.completion_rate || 0} />
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 1.5,
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                alignItems: 'stretch',
                            }}>
                            {/* Posted */}
                            <Paper
                                variant="outlined"
                                onClick={handleOpenPosterPosted}
                                onKeyDown={(event) =>
                                    handleCardKeyDown(event, 'posterPosted')
                                }
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition:
                                        'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        boxShadow: 2,
                                        transform: 'translateY(-2px)',
                                        borderColor: 'primary.main',
                                    },
                                    '&:focus-visible': {
                                        outline: '2px solid',
                                        outlineColor: 'primary.main',
                                        outlineOffset: 2,
                                    },
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="View posted tasks">
                                <Typography variant="caption" color="text.secondary">
                                    Posted
                                </Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {posterStats?.posted_count ?? 0}
                                </Typography>
                            </Paper>
                            {/* Hired */}
                            <Paper
                                variant="outlined"
                                onClick={handleOpenPosterHired}
                                onKeyDown={(event) =>
                                    handleCardKeyDown(event, 'posterHired')
                                }
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition:
                                        'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        boxShadow: 2,
                                        transform: 'translateY(-2px)',
                                        borderColor: 'primary.main',
                                    },
                                    '&:focus-visible': {
                                        outline: '2px solid',
                                        outlineColor: 'primary.main',
                                        outlineOffset: 2,
                                    },
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="View hired tasks">
                                <Typography variant="caption" color="text.secondary">Hired</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {posterStats?.hided_count ?? 0}
                                </Typography>
                            </Paper>
                            {/* Completed */}
                            <Paper
                                variant="outlined"
                                onClick={handleOpenPosterCompleted}
                                onKeyDown={(event) =>
                                    handleCardKeyDown(event, 'posterCompleted')
                                }
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition:
                                        'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        boxShadow: 2,
                                        transform: 'translateY(-2px)',
                                        borderColor: 'primary.main',
                                    },
                                    '&:focus-visible': {
                                        outline: '2px solid',
                                        outlineColor: 'primary.main',
                                        outlineOffset: 2,
                                    },
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="View completed tasks">
                                <Typography variant="caption" color="text.secondary">Completed</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {posterStats?.completed_count ?? 0}
                                </Typography>
                            </Paper>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <RatingSummary
                                value={posterStats?.ratings_received_avg ?? null}
                                count={posterStats?.ratings_received_count ?? 0}
                            />
                        </Box>
                    </Stack>)
                }
            </Stack>

            <ProfileTasksModal
                open={Boolean(openModal)}
                view={openModal}
                profileId={profile.id}
                onClose={handleCloseModal} 
                taskData={taskerStats.list}
            />
        </Paper>
    )

}


