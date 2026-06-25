import {useState} from "react"

import {
  Box,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";


import CommentItem from "./CommentItem";
const MAX_LEVEL = 1;

export default function CommentTree({comments, taskId, posterId, level = 0, onMutate, emptyText, parentName, isBuilt = false}){

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
            current.attachments = (c.attachments || []).map(url => ({ url, type: 'image' }));
            
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

    // Build the tree only during the top-level call, 
    // and use the existing tree structure during recursive calls.
    commentsData = isBuilt ? comments : buildCommentTree(comments);

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
                            parentName={c.comment_id == null ? "" : parentName}
                            onMutate={onMutate}
                            onToggle={() =>
                                setOpenMap((m) => ({ ...m, [c.id]: !opened }))
                            }
                        />

                        {c?.children?.length ? (
                            <Collapse in={opened} timeout="auto" unmountOnExit>
                                <CommentTree
                                    comments={c.children}
                                    level={level + 1}
                                    taskId={taskId}
                                    onMutate={onMutate}
                                    posterId={posterId}
                                    parentName={c?.user?.username}
                                    isBuilt={true}
                                />
                            </Collapse>
                        ) : null}
                    </Box>
                )
            })}
        </Stack>
    )
}