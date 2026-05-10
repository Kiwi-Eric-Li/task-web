

import {
  Container, 
  Paper,
  Typography,
  Box
} from '@mui/material';

export default function TermsMain(){
    return (
        <Container maxWidth="md" sx={{ my: 4, pt: "80px" }}>
            <Paper
                elevation={3}
                sx={{
                p: 4,
                backgroundColor: "#ffffff",
                borderRadius: "12px",
            }}>
                <Typography variant="h4" sx={{ color: "#000000", mb: 2, fontWeight: 600 }}>Terms and Conditions</Typography>
                <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f0f0", borderRadius: "8px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#000000", fontWeight: 500 }}>
                        Almost there! Please review our Terms and Conditions carefully.
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    Welcome to our website. These terms and conditions outline the rules and regulations for the use of our platform. By accessing this website, you accept these terms and conditions in full. If you disagree with any part of these terms and conditions, please do not use our website.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>
                    Intellectual Property
                </Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    Unless otherwise stated, we or our licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and/or print pages for your own personal use, but you must not reuse any material without obtaining permission.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>
                    Acceptable Use
                </Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website. You must not use our website in any way which is unlawful, illegal, fraudulent, or harmful.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>User Responsibilities</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    As a user, you agree to use our website responsibly and ensure that your actions do not violate any laws or infringe upon the rights of others. Misuse of our services may result in termination of your access without notice.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Limitation of Liability</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    In no event shall we be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of our website. This includes any damages caused by viruses, bugs, or other technical issues.
                </Typography>

                <Typography variant="h6" sx={{ color: "#000000", mt: 3, mb: 1, fontWeight: 500 }}>Changes to Terms</Typography>
                <Typography variant="body1" sx={{ color: "#333", mb: 2, lineHeight: 1.8 }}>
                    We reserve the right to update or change these terms and conditions at any time. It is your responsibility to check this page periodically for changes. Your continued use of the website constitutes acceptance of any changes.
                </Typography>

                <Typography variant="body2" sx={{ color: "#555", mt: 4 }}>Last updated: February 6, 2025</Typography>
            </Paper>
        </Container>
    )
}