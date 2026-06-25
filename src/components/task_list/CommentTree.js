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

import CommentItem from "./CommentItem";
const MAX_LEVEL = 1;
const INDENT_PX = 16;
const BORDER_KEYS = ["primary", "success", "info", "warning"];

export default function CommentTree({comments, taskId, posterId, level = 0, onMutate, emptyText}){

    const [openMap, setOpenMap] = useState({});
    let commentsData = [];

    if (!comments?.length) {
        return level === 0 ? (
            <Typography variant="section" color="text.secondary">
                {emptyText}
            </Typography>
        ) : null;
    }

    const buildCommentTree = (comments) => {
        const map = new Map();
        const roots = [];

        // first, let every comment have "children" property
        comments.forEach(c => {
            map.set(c.id, {
                ...c,
                children: []
            });
        });

        // second, build a parent-child relation
        comments.forEach(c => {
            const current = map.get(c.id);
            if(c.comment_id === null){
                roots.push(current);
            }else{
                const parent = map.get(c.comment_id);
                if(parent){
                    parent.children.push(current);
                }else{
                    roots.push(current);
                }
            }
        });

        return roots;
    }

    commentsData = buildCommentTree(comments);

    return (
        <Stack spacing={1.5} sx={{ mt: level ? 1.2 : 0 }}>
            {commentsData.map((c)=>{
                const opened = openMap[c.id] ?? true;
                return (
                    <Box key={c.id}>
                        <CommentItem
                            c={c}
                            level={Math.min(level, MAX_LEVEL)}
                            taskId={taskId}
                            isPoster={posterId === c.commenter_user_id}
                            opened={opened}
                            parentName={c.comment_id == null ? "" : c?.user?.username}
                            onMutate={onMutate}
                            onToggle={() =>
                                setOpenMap((m) => ({ ...m, [c.id]: !opened }))
                            }
                        />

                        {/* 有子评论时递归显示 */}
                        {c?.children?.length ? (
                            <Collapse in={opened} timeout="auto" unmountOnExit>
                                <CommentTree
                                    comments={c.children}
                                    level={level + 1}
                                    taskId={taskId}
                                    onMutate={onMutate}
                                    posterId={posterId}
                                    parentName={c?.user?.username}
                                />
                            </Collapse>
                        ) : null}
                    </Box>
                )
            })}
        </Stack>
    )
}