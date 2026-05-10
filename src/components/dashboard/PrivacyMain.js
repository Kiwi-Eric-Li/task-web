
import {
  Container, 
  Paper,
  Typography,
  Box
} from '@mui/material';

export default function PrivacyMain(){
    return (
        <Container maxWidth="md" sx={{ my: 4, pt: "80px" }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                }}>
                {/* 标题 */}
                <Typography variant="h4" sx={{ color: "#000000", mb: 2, fontWeight: 600 }}>Privacy Policy</Typography>

                {/* 介绍区域 */}
                <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f0f0", borderRadius: "8px" }}>
                <Typography variant="subtitle1" sx={{ color: "#000000", fontWeight: 500 }}>
                    Your privacy matters! Please review our Privacy Policy carefully.
                </Typography>
                </Box>

                {/* 隐私政策内容 */}
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    Welcome to our website. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our platform. By using our website, you agree to the collection and use of information in accordance with this policy. If you do not agree with our practices, please do not use our website.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Information Collection</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    We may collect personal information such as your name, email address, and other details when you register on our website or use our services. Additionally, we may collect data about your interactions with our site through cookies and similar technologies.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Use of Information</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    The information we collect is used to improve our services, personalize your experience, and communicate with you. We may also use your information to send periodic emails regarding updates, new features, or promotional offers.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Data Security</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    We implement a variety of security measures to maintain the safety of your personal information. However, please note that no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Third-Party Disclosure</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties except as necessary to provide our services, comply with the law, or protect our rights.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Policy Updates</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    We may update our Privacy Policy from time to time. Any changes will be posted on this page, and your continued use of our website constitutes acceptance of those changes.
                </Typography>

                <Typography variant="body2" sx={{ color: "#555", mt: 4 }}>Last updated: February 6, 2025</Typography>
            </Paper>
        </Container>
    )
}