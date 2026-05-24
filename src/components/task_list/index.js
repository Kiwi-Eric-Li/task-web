import {useState, useRef} from "react";

import {
    Box, 
    Container, 
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import themeUtil from "../../utils/theme"
import TaskFilterBar from "./TaskFilterBar"

const rightPaneSx = {
  flex: { md: '0 0 62%', lg: '0 0 65%' },
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  overflowY: 'auto',
}

export default function TaskList(){
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const listRef = useRef(null);
    const detailRef = useRef(null);


    console.log("isMdUp", isMdUp);



    const handleFilterChange = () => {

    }




    return (
        <ThemeProvider theme={themeUtil}>
            <Box sx={{paddingTop: '90px', paddingBottom: '32px', bgcolor: 'rgba(255, 255, 255, 0.85)'}}>
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        flex: 1,
                        height: { md: '100dvh', xs: 'auto' },
                        overflow: { md: 'hidden', xs: 'visible' },}}>
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0, // layout already pads content under TaskHeader
                                zIndex: (t) => t.zIndex.appBar - 1, // ensure it's under TaskHeader
                                bgcolor: "background.paper",
                                borderColor: "divider",
                            }}>
                            <TaskFilterBar onChange={handleFilterChange} />
                        </Box>
                        
                        {isMdUp ? (
                            <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', mx: '24px' }}>
                                <Box 
                                    ref={listRef} 
                                    sx={{
                                        flex: { md: '0 0 38%', lg: '0 0 35%' },
                                        minWidth: 0,
                                        minHeight: 0,
                                        height: '100%',
                                        overflowY: 'auto',
                                        background: 'linear-gradient(180deg,#f7f9fc 0%,#f1f4f9 100%)',
                                        borderRight: `1px solid ${themeUtil.palette.divider}`}}>

                                    </Box>
                                    <Box ref={detailRef} sx={rightPaneSx}>

                                    </Box>
                            </Box>
                        ) : (
                            <Box>小屏幕</Box>
                        )}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}