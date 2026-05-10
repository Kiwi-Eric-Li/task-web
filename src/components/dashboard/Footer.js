
import {
  Box,
  Container, 
  Grid, 
  Typography, 
  Link, 
  Stack
} from '@mui/material';


export default function Footer(){
    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                py: 4,
                bgcolor: 'grey.100',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}>
                <Container maxWidth="lg">
                    
                    {/* 上面两栏 */}
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                    
                        {/* 左：Logo */}
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="https://kiwisquare.co.nz/_next/static/media/kiwisquare.e273274e.png"
                                alt="Logo"
                                sx={{
                                    height: 69,
                                }}
                            />
                        </Grid>

                        {/* 右：Links */}
                        <Grid item xs={12} md={6}>
                            <Stack
                                direction="row"
                                spacing={3}
                                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                            >
                                <Link href="terms" underline="hover" sx={{color: (t) => t.palette.footer.primary, fontWeight: 500}}>
                                    Terms & Conditions
                                </Link>
                                <Link href="privacy" underline="hover" sx={{color: (t) => t.palette.footer.primary, fontWeight: 500}}>
                                    Privacy Policy
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* 版权 */}
                    <Typography
                        variant="body2"
                        align="center" sx={{color: (t) => t.palette.footer.copy, mt: 2}}>
                        &copy;Copyright {new Date().getFullYear()} Kiwi Square. All rights reserved.
                    </Typography>
                </Container>
        </Box>
    )
}