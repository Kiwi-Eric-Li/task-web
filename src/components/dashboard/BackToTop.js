import { Box, Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollTop(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    threshold: 100, // 滚动多少显示
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

export default function BackToTop() {
  return (
    <ScrollTop>
      <Fab 
        color="primary" 
        size="small" 
        sx={{
            bgcolor: '#00bf58', 
            '&:hover': {
                bgcolor: '#00bf58',
        }}}>
        <KeyboardArrowUpIcon />
      </Fab>
    </ScrollTop>
  );
}