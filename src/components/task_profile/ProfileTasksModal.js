import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,

} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


export default function ProfileTasksModal({open, view, profileId, onClose, taskData}){
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(()=>{
        setTasks(taskData);
    }, [taskData]);



    // const [tasks, setTasks] = useState([
    //     {
    //         budget: null,
    //         budget_type: "fixed",
    //         categories: ["Auto Services"],
    //         comment_count: 2,
    //         created_at: "Mon, 02 Feb 2026 09:26:24 GMT",
    //         estimated_hours: 0,
    //         expires_at: "Sat, 07 Mar 2026 09:10:00 GMT",
    //         id: 514,
    //         location: "Auckland, ,0616",
    //         offer_count: 0,
    //         poster_avatar_url: null,
    //         poster_display_name: "lxf101",
    //         schedule_time: "Thu, 05 Feb 2026 09:10:00 GMT",
    //         status: "Open",
    //         title: "test posting a task",
    //         type: "offline",
    //         updated_at: "Mon, 02 Feb 2026 09:26:24 GMT"
    //     }
    // ]);

    console.log("view====11111====", view);

    if(view === "posterPosted"){
        // 请求后端接口，获取 posterPosted 数据
    }else if(view === "posterHired"){
        // 请求后端接口，获取 posterHired 数据
    }else if(view === "posterCompleted"){
        // 请求后端接口，获取 posterCompleted 数据
    }else if(view === "taskerCompleted"){
        // 请求后端接口，获取 taskerCompleted 数据

    }

    const title =
        view === 'taskerCompleted'
            ? 'Completed tasks'
            : view === 'posterPosted'
                ? 'Posted tasks'
                : view === 'posterHired'
                    ? 'Hired tasks'
                    : view === 'posterCompleted'
                        ? 'Completed tasks'
                        : ''

    const description =
        view === 'taskerCompleted'
            ? 'Tasks this tasker has completed.'
            : view === 'posterPosted'
                ? 'All tasks this poster has posted.'
                : view === 'posterHired'
                    ? 'Tasks where this poster has hired a tasker.'
                    : view === 'posterCompleted'
                        ? 'Tasks this poster has completed.'
                        : 'Tasks related to this profile.'

    const handleOpenTask = (taskId) => {
        onClose();
        navigate(`/task/task-list?id=${taskId}`);
    }



    const renderContent = () => {
        // if(!profileId){
        //     return (
        //         <Typography variant='body2' color='text.secondary'>
        //             Profile information is missing. Unable to load tasks.
        //         </Typography>
        //     )
        // }

        if (isLoading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                    }}>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography variant='body2' color='text.secondary'>
                        Loading tasks...
                    </Typography>
                </Box>
            )
        }

        if(hasError){
            return (
                <Typography variant='body2' color='error.main'>
                    Failed to load tasks. Please try again later.
                </Typography>
            )
        }

        if(!tasks || tasks.length === 0){
            return (
                <Typography variant='body2' color='text.secondary'>
                    No tasks to show yet.
                </Typography>
            )
        }

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {
                    tasks.map(item => {
                        const budget = item.budget
                            ? `$${item.budget}${item.budget_type === 'hourly' ? ' /hr' : ''}`
                            : 'Flexible'

                        const location = item.location ?? 'Remote'

                        const handleKeyDown = (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                handleOpenTask(item.id)
                            }
                        }

                        return (
                            <Box
                            key={item.id}
                            role='button'
                            tabIndex={0}
                            onClick={() => handleOpenTask(item.id)}
                            onKeyDown={handleKeyDown}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                cursor: 'pointer',
                                transition:
                                    'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
                                '&:hover': {
                                    boxShadow: 3,
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-1px)',
                                },
                                '&:focus-visible': {
                                    outline: '2px solid',
                                    outlineColor: 'primary.main',
                                    outlineOffset: 2,
                                },
                            }}>
                                <Stack
                                    direction='row'
                                    alignItems='flex-start'
                                    justifyContent='space-between'
                                    spacing={1.5}>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant='subtitle2'
                                            fontWeight={600}
                                            noWrap
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                            noWrap
                                            sx={{ mt: 0.5 }}
                                        >
                                            {location} • {item.status}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant='subtitle1'
                                        fontWeight={700}
                                        color='primary.main'
                                        sx={{ ml: 1, whiteSpace: 'nowrap' }}
                                    >
                                        {budget}
                                    </Typography>
                                </Stack>
                            </Box>
                        )
                    })
                }
            </Box>
        )
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent dividers>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 2 }}>
                    {description}
                </Typography>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{textTransform: 'none'}}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}


