import {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Stack,
  Typography,
  Rating,
  Button,
  Box,
  ButtonBase
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

import ReviewDetailDialog from "./ReviewDetailDialog";

export default function ReviewCard({review, role}){
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const targetId = review.reviewer_userid;
    const targetName = review.reviewer_username;
    const initials = (targetName ?? "U").slice(0, 2) || "U";
    const date = new Date(review.created_at).toLocaleDateString();
    const comment = review.comment ?? "";

    const isCommentLong = comment.length > 70;
    const isTitleLong = (review.task_title ?? "").length > 48;
    const shouldShowSeeMore = isCommentLong || isTitleLong;

    return (
        <>
            <Card variant="outlined" sx={{borderRadius: 3, display: 'flex', flexDirection: 'column'}}>
                <CardHeader 
                    avatar={
                        <ButtonBase
                            sx={{borderRadius: '50%'}}
                            aria-label={`Open profile of ${targetName}`}
                            onClick={() => {navigate(`/task/profile/${targetId}`); window.location.reload();}}
                        >
                            <Avatar src={review.reviewer_avatar_url ?? undefined}>{initials}</Avatar>
                        </ButtonBase>
                    }
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <ButtonBase
                                sx={{display: 'inline-flex', alignItems: 'center', gap: 1, borderRadius: 2, px: 0.5}}
                                onClick={() => {navigate(`/task/profile/${targetId}`); window.location.reload();}}
                            >
                                <Typography fontWeight={600} sx={{lineHeight: 1.2}}>{targetName}</Typography>
                            </ButtonBase>
                            <Typography variant="caption" color="text.secondary">{date}</Typography>
                        </Stack>
                    }
                    subheader={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Rating 
                                value={review.rating} 
                                readOnly 
                                precision={0.5} 
                                size="small" 
                                icon={<StarIcon fontSize="inherit" color="warning" />} 
                                emptyIcon={<StarIcon fontSize="inherit" />}    
                            />
                        </Stack>
                    }
                    sx={{pb: 0}}
                />

                <Box sx={{px: 2, mt: 1}}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{minWidth: 0}}>
                        <AssignmentOutlinedIcon fontSize="small" />
                        <Typography variant="body1" fontWeight={500} noWrap title={review.task_title} sx={{flex: 1, minWidth: 0}}>
                            {review.task_title}
                        </Typography>
                    </Stack>
                </Box>
                
                {comment && (
                    <CardContent sx={{pt: 1, pb: 0.5}}>
                        <Box sx={{pl: 2, borderLeft: '3px solid rgb(206, 66, 87)'}}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.6
                                }}>{comment}</Typography>
                        </Box>
                    </CardContent>
                )}
                <CardActions sx={{pt: 0.5, px: 2, pb: 2, mt: 'auto', justifyContent: 'flex-end'}}>
                    {
                        shouldShowSeeMore && (
                            <Button sx={{textTransform: 'none'}} size="small" onClick={() => setOpen(true)} aria-label="See full review">See more</Button>
                        )
                    }
                </CardActions>
            </Card>
            <ReviewDetailDialog open={open} onClose={() => setOpen(false)} review={review}/>
        </>
    )
}

