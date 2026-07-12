import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography,
  Divider,
  ListItemIcon,
  Link
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { MailOutlineOutlined } from '@mui/icons-material'



export default function UserMenu({userData}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <Tooltip title="Profile & settings">
        <IconButton onClick={handleOpen} size="small">
          <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} src={userData.avatar_url}/>
        </IconButton>
      </Tooltip>
      
      <Menu 
        id='user-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          },
        }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
            <Typography variant='body2' color='text.secondary'>
            Signed in as
            </Typography>
            <Typography variant='subtitle2' fontWeight={700}>
            {userData.username}
            </Typography>
        </Box>
        <Divider sx={{borderColor: 'rgb(229, 229, 229)', opacity: '0.09'}}/>

        <MenuItem onClick={handleClose} component={Link} href={`/task/profile/${userData.id}`} dense>
            <ListItemIcon>
                <PersonIcon fontSize='small' />
            </ListItemIcon>
            Public Profile
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href="/task/dashboard" dense>
            <ListItemIcon>
                <DashboardIcon fontSize='small' />
            </ListItemIcon>
          My Dashboard
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href='/task/hub/messages'  dense>
            <ListItemIcon>
                <MailOutlineOutlined fontSize='small' />
          </ListItemIcon>
          Messages
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href='/task/hub/notifications' dense>
            <ListItemIcon>
                <NotificationsNoneIcon fontSize='small' />
            </ListItemIcon>
          Notifications
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href='/task/hub/settings' dense>
            <ListItemIcon>
                <SettingsIcon fontSize='small' />
            </ListItemIcon>
           Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} dense>
            <ListItemIcon>
                <ExitToAppIcon fontSize='small' />
            </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}