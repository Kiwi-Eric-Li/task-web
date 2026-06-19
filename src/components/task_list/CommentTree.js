import {useState} from "react"

import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  ExpandLess,
  ExpandMore,
  Forum as ForumIcon,
  ArrowRightAlt,
} from "@mui/icons-material";



export default function CommentTree({comments, taskId, posterId, level = 0, onMutate, emptyText}){

    const [openMap, setOpenMap] = useState({});


    if (!comments?.length) {
        return level === 0 ? (
            <Typography variant="body2" color="text.secondary">
                {emptyText}
            </Typography>
        ) : null;
    }
}