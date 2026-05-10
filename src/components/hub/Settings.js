import {useState, useEffect, useRef} from 'react'
import {
    Paper,
    Button,
    Avatar,
    Typography,
    Box,
} from "@mui/material"
import {useSelector, useDispatch} from 'react-redux';
import { Upload, Check } from "@mui/icons-material";


export default function Settings(){

    const {userData} = useSelector(state => state.userData || {});
    const [currentAvatarSrc, setCurrentAvatarSrc] = useState('');
    const fileInputRef = useRef(null);


    useEffect(() => {
        setCurrentAvatarSrc(userData.avatar_url);
    }, []);

    const onAvatarFileSelected = () => {

    }

    const onChangeAvatarClick = () => {

    }


    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{p: 2}}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Account Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your account preferences and settings
                </Typography>
            </Box>
            {/* Profile settings */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}>
                    Profile Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Avatar
                            src={currentAvatarSrc}
                            sx={{ width: 80, height: 80, fontSize: "1.125rem" }}
                        >
                            AJ
                        </Avatar>
                        <Box>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onAvatarFileSelected}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Upload />}
                                onClick={onChangeAvatarClick}
                                sx={{
                                    textTransform: "none",
                                    borderColor: "divider",
                                    color: "text.primary",
                                    "&:hover": { borderColor: "text.secondary", bgcolor: "action.hover" },
                                }}
                            >
                                Change Avatar
                            </Button>


                        </Box>




                    </Box>
                </Box>
            </Paper>

        </Box>
    )
}