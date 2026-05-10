import {useState} from 'react'
import { Box, TextField, Typography, FormControlLabel, Checkbox, Link, Button } from "@mui/material";

export default function Register(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    let flag = false;

    const handleRegister = () => {
        // 验证数据合法性
        if(username.trim() === ''){
            setUsernameError("Username is required");
            flag = true;
        }
        if(email.trim() === ''){
            setEmailError("Email is required");
            flag = true;
        }
        const regex = /^.{6,}$/;
        if(!regex.test(password.trim())){
            setPasswordError('Password must be at least 6 characters');
            flag = true;
        }
        if(confirmPassword === ''){
            setConfirmPasswordError("Confirm Password is required");
            flag = true;
        }else if(password !== confirmPassword){
            setConfirmPasswordError("The password and the confirmation password are inconsistent");
            flag = true;
        }

        // 调用注册接口
        if(!flag){
            
        }
    }


    return (
        <Box
            sx={{
                maxWidth: "720px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mx: 'auto',
                px: { xs: 3, sm: 4, md: 0 },
                py: { xs: 4, sm: 6, md: 8 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "720px",
                    px: '40px'
                }}>
                <Box>
                    <Typography variant="h2" sx={{fontSize: '40px', color: '#244034', fontWeight: 400, textAlign: 'center'}}>Create Account</Typography>
                </Box>
                <Box>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Box sx={{height: '24px', color: 'red'}}>{usernameError}</Box>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Box sx={{height: '24px', color: 'red'}}>{emailError}</Box>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box sx={{height: '24px', color: 'red'}}>{passwordError}</Box>
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Box sx={{height: '24px', color: 'red'}}>{confirmPasswordError}</Box>
                    <FormControlLabel sx={{color: '#244034'}} control={<Checkbox defaultChecked />} label={<>By hitting the Register button, you agree to the <Link href="terms" underline="hover" sx={{color: '#31795a'}}>Terms conditions</Link> & <Link href="privacy" underline="hover" sx={{color: '#31795a'}}>Privacy Policy</Link>.</>} size="small" />
                    <Button onClick={handleRegister} sx={{width: '100%', height: '50px', bgcolor: '#4b5563', my: '10px'}} variant="contained">Register</Button>
                    <Box sx={{color: '#244034', textAlign: 'center', my: '10px'}}>Have an account? <Link href="#" underline="hover" sx={{color: '#31795a'}}>Sign up</Link></Box>
                </Box>
            </Box>
        </Box>
    )
}


