import {useState} from 'react'
import {useDispatch} from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Link,
  Checkbox, 
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import service from "../../utils/request";
import { tokenService } from "../../utils/token";
import {setUserData} from '../../store/modules/userReducer'

export default function LoginDialog({open, onClose, onLogin, setOpenAlert, setAlertType, setAlertMsg}){
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        }
        if (!password){
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            
            const res = await service.post("/auth/login", {
                email,
                password,
                "remember_me": checked
            });
            
            const {code, data, message} = res;
            if(code === 0){
                setOpenAlert(true);
                setAlertType('success');
                setAlertMsg("Login successfully!");
                
                // 将数据保存到localStorage中
                tokenService.setLoginTokens(data.access_token, data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // 将用户数据放入store中
                dispatch(setUserData(data.user));
                onClose();
            }else{
                setOpenAlert(true);
                setAlertType('error');
                setAlertMsg(message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
                sx: {
                    borderRadius: '20px',
                },
            }}>
                <DialogTitle>
                    Login
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                    <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{pb: '0px'}}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                </DialogContent>
                <Typography 
                    variant='body2' 
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '16px',
                        ml: '24px',
                        mr: '24px',
                        mt: '5px'
                    }}>
                        <FormControlLabel 
                            sx={{color: '#4b5563'}}
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                            }
                            label="Keep me logged in"
                        />
                        <Link href="forgot-password" underline="hover" sx={{textTransform: 'none', color: '#4b5563'}}>Forget Password?</Link>
                    </Typography>
                <DialogActions sx={{ padding: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleLogin}
                        disabled={loading} 
                        sx={{bgcolor: '#4b5563', width: '100%', height: '50px'}}
                    >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </DialogActions>
                <Typography 
                    variant='body2' 
                    sx={{
                        textAlign: 'center', 
                        height: '50px', 
                        lineHeight: '50px', 
                        fontSize: '16px'
                    }}>Do not have an account? <Link href="register" underline="hover" sx={{textTransform: 'none', color: '#4b5563', fontWeight: 'bold'}}>Sign up</Link></Typography>
            </Dialog>
        </>
        
    );
}