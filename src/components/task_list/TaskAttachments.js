import {useState} from 'react';
import { Box, Chip, Dialog, DialogContent, IconButton, useTheme } from '@mui/material';
import { Close, ChevronLeft, ChevronRight } from '@mui/icons-material';

import theme from "../../utils/theme"

export default function TaskAttachments({attachments}){

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // no attachements
    if (!attachments || attachments.length === 0) {
    return (
      <Chip
        icon={<Close />}
        label="No attachments provided."
        size="small"
        variant="outlined"
        sx={{ opacity: 0.65 }}
      />
    );
  }


    return (
        <>
            {/* Image previews */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {attachments.map((att, idx) => (
                    <Box
                        key={att.url}
                        component={att.type === 'video' ? 'video' : 'img'}
                        src={att.url}
                        controls={att.type === 'video'}
                        alt="attachment"
                        onClick={() => {
                            setCurrentImageIdx(idx);
                            setLightboxOpen(true);
                        }}
                        sx={{
                            width: 140,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: 1,
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </Box>
            <Dialog
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '90vw',
                        maxWidth: '90vh',
                        height: '90vh',
                        maxHeight: '90vh',
                    },
                }}
            >
            <DialogContent
                sx={{
                    position: 'relative',
                    p: 0,
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* close buton */}
                <IconButton
                    onClick={() => setLightboxOpen(false)}
                    sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
                >
                    <Close />
                </IconButton>

                {/* turn to the left  */}
                <IconButton
                    onClick={() =>
                    setCurrentImageIdx((i) =>
                        i === 0 ? attachments.length - 1 : i - 1
                    )
                    }
                    sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 8,
                    transform: 'translateY(-50%)',
                    color: '#fff',
                    }}
                >
                    <ChevronLeft fontSize="large" />
                </IconButton>

                {/* current big image */}
                <Box
                    component="img"
                    src={attachments[currentImageIdx].url}
                    alt="attachment-large"
                    sx={{ maxWidth: '100%', maxHeight: '100%', display: 'contain' }}
                />

                    {/* turn to the right */}
                    <IconButton
                        onClick={() =>
                        setCurrentImageIdx((i) =>
                            i === attachments.length - 1 ? 0 : i + 1
                        )
                        }
                        sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 8,
                        transform: 'translateY(-50%)',
                        color: '#fff',
                        }}
                    >
                        <ChevronRight fontSize="large" />
                    </IconButton>
                </DialogContent>

                {/* Bottom thumbnail navigation */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflowX: 'auto',
                        p: 1,
                        background: '#000',
                    }}
                    >
                    {attachments.map((att, idx) => (
                        <Box
                        key={att.url}
                        component="img"
                        src={att.url}
                        alt={`thumb-${idx}`}
                        onClick={() => setCurrentImageIdx(idx)}
                        sx={{
                            width: 60,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 0.5,
                            cursor: 'pointer',
                            border:
                            idx === currentImageIdx
                                ? `2px solid ${theme.palette.primary.main}`
                                : '2px solid transparent',
                            mx: 0.5,
                        }}
                        />
                    ))}
                </Box>
            </Dialog>
        </>
    )
}