
import {
  Dialog, DialogTitle, DialogContent, IconButton, Stack, Avatar, Typography, Rating, Box, ButtonBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import StarIcon from '@mui/icons-material/Star';


export default function ReviewDetailDialog({open, onClose, review}){
    return (
        <Dialog 
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            scroll="paper"
            PaperProps={{sx: {borderRadius: 3}}}
        >
            <DialogTitle sx={{pr: 6}}>
                Full Review
                <IconButton 
                    aria-label="close" 
                    onClick={onClose} 
                    sx={{position: 'absolute', right: 8, top: 8}}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        </Dialog>
    )
}