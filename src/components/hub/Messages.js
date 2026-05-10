import {useState} from 'react'
import {
    Paper,
    Button,
    Typography,
    Box,
} from "@mui/material"



export default function Messages(){

    const [startablesOpen, setStartablesOpen] = useState(false);
    const [showClosed, setShowClosed] = useState(false); // ADDED

    const openStartables = () => {
        setStartablesOpen(true);
    }



    return (
        <Paper sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',}}>
            <Box
                sx={{
                    p: 2,
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                    position: { xs: 'sticky', sm: 'static' },
                    top: 0,
                    zIndex: 1,
                    bgcolor: 'background.paper',
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Messages
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your conversations and direct messages
                    </Typography>
                </Box>
                <Button variant="contained" onClick={openStartables} sx={{ fontWeight: 700 }}>
                    New
                </Button>
            </Box>
            


        </Paper>
    )
}