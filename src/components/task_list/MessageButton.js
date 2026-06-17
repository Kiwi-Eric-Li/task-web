import {useState} from "react"
import {useNavigate} from "react-router-dom"
import { Button } from "@mui/material"
import { Chat } from "@mui/icons-material"


export default function MessageButton({taskId}){

    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);


    const handleClick = async () => {
        // const latest = await refetch()
        // const convId = latest?.data?.conversation_id ?? data?.conversation_id ?? null
        const convId = "";
        if (convId) {
            navigate(`/task/hub/messages?conversationId=${convId}`);
            return
        }

        // const s = startables?.find(x => x.task_id === taskId)
        const s = "";
        if (s) {
            // dispatch(taskChatUiActions.openCompose(s))
            navigate(
                `/task/hub/messages?compose=1&task_id=${s.task_id}&to=${s.other_profile_id}`)
        } else {
            // fallback: let panel resolve by task_id once startables load
            navigate(`/task/hub/messages?compose=1&task_id=${taskId}`);
        }
    }

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<Chat />}
            disabled={isFetching}
            onClick={handleClick}
            sx={{ textTransform: "none", borderRadius: 2 }}
        >
            Private message
        </Button>
    )
}




