import {useState} from 'react';
import { Box, Stack, Typography, Button, TextField, Rating, Alert } from "@mui/material";

import request from "../../utils/request";


export default function ReviewBlock({taskId, role, posterId, taskerId, onMutate}){

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const createReview = async () => {
        
        try{
            const res = await request.post("/tasks/review", {
                "task_id": taskId,
                "reviewer_id": role === "poster" ? posterId : taskerId,
                "reviewee_id": role === "poster" ? taskerId : posterId,
                "rating": rating,
                "comment": comment
            });
            if(res.code === 0){
                setSubmitted(true);
                onMutate();
            }
        }catch(e){
            console.log("error====review=====", e);
        }finally{
            setSubmitted(false);
        }
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={700}>
                {role === "poster" ? "Leave a review for the tasker" : "Leave a review for the poster"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
                Your feedback helps build trust for future tasks.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2, maxWidth: 560 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2" sx={{ width: 80, fontWeight: 'bold' }}>Rating</Typography>
                    <Rating 
                        value={rating} 
                        sx={{
                            color: "#24a148"
                        }}
                        onChange={(_, v) => setRating(v)} />
                </Stack>
                <TextField
                    label="Comment (optional)"
                    multiline minRows={3} value={comment} onChange={(e) => setComment(e.target.value)}
                />
                <Box>
                    <Button 
                        sx={{ textTransform: "none" }}
                        variant="contained"
                        disabled={!rating || submitted}
                        onClick={async () => {
                            await createReview(); 
                        }}
                    >
                        Submit review
                    </Button>
                </Box>
            </Stack>
        </Box>
    )
}