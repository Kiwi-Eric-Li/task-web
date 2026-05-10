import {useState, useEffect} from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function ForgetPassword(){

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [afterSendEmail, setAfterSendEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setAfterSendEmail(`If you have an existing account associated with ${submittedEmail}, you will receive an email with instructions to reset your password. If you do not receive a password reset email after one minute, make sure that you have entered the correct email address. Alternatively, check your spam folder. If you need further assistance, please contact support.`,
        `如果您已有与 ${submittedEmail} 关联的账号，您将收到一封包含密码重置说明的电子邮件。如果您在一分钟后仍未收到密码重置邮件，请确保您输入了正确的电子邮件地址。或者，您可以检查您的垃圾邮件文件夹。如果您需要进一步帮助，请联系客服。`);
    }, [submittedEmail]);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = () => {
        if(submittedEmail === ""){
            setErrorMessage("Email is required");
            return ;
        }else if(!isValidEmail(submittedEmail)){
            setErrorMessage("Invalid email format");
        }else{
            // 合法的邮箱，调用接口来发送邮件

        }
    }


    return (
        <Box 
            sx={{
                width: "100%",
                height: '100vh',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: { xs: 3, sm: 4, md: 0 },
                py: { xs: 4, sm: 6, md: 8 },
                bgcolor: 'rgb(244, 242, 254)'
            }}>
            <Box
                className="user-data-form"
                sx={{
                    width: "100%",
                    maxWidth: "720px",
                    bgcolor: "#fff",
                    borderRadius: '20px',
                    padding: '50px 15px 20px',
                }}>
                    <Box className="text-center" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                        {!isSubmitted ? (
                            <Box textAlign="center">
                                <Typography variant="h2" sx={{color: '#244034', fontSize: {xs: '30px', md: '50px'}, fontWeight: 400}}>Forgot your password?</Typography>
                                <Typography variant="body2" sx={{color: 'rgba(0, 0, 0, 0.7)', fontSize: '16px', my: '10px'}}>Please enter your email address below to receive password reset instructions.</Typography>
                                <TextField 
                                    sx={{
                                        maxWidth: '400px', 
                                        minWidth: '200px',
                                        margin: '20px auto',
                                        bgcolor: 'rgba(49,121,90,.09)'
                                    }}
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    placeholder="james@example.com" 
                                    autoComplete="off" 
                                    onChange={(e) => setSubmittedEmail(e.target.value)}
                                />
                                <Typography variant="body2" 
                                    sx={{
                                        maxWidth: '400px', 
                                        minWidth: '200px',
                                        marginBottom: '10px',
                                        margin: 'auto',
                                        color: (t) => t.palette.primary.main
                                    }}
                                >
                                    {errorMessage}
                                </Typography>
                                <Button 
                                    onClick={handleSubmit}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ 
                                        mt: 2, 
                                        maxWidth: '400px', 
                                        minWidth: '200px', 
                                        height: '60px',
                                        bgcolor: '#4b5563',
                                        color: '#fff',
                                        margin: 'auto'
                                    }}>
                                    Submit
                                </Button>
                            </Box>
                        ) : (
                            <p className="text-center">{afterSendEmail}</p>
                        )}
                </Box>
            </Box>
        </Box>
    )
}