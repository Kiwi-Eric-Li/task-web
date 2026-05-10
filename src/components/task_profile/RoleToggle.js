import {
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from "@mui/material/styles";

import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';


export default function RoleToggle({role, onChange, disabled = false}){
    return (
        <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(_, v) => v && onChange(v)}
            size="small"
            disabled={disabled}
            sx={(theme) => ({
                borderRadius: 999,
                p: 0.5,
                gap: 0.5,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[0],
                '& .MuiToggleButton-root': {
                textTransform: 'none',
                border: 0,
                borderRadius: 999,
                px: 1.5,
                minWidth: 104,
                transition: 'all 0.2s ease',
                color: theme.palette.text.secondary,
                '&:hover': {
                    bgcolor: theme.palette.action.hover,
                },
                // Selected: green, a bit darker on hover
                '&.Mui-selected': {
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                    bgcolor: theme.palette.primary.light,
                    },
                },
                '&.Mui-disabled': {
                    opacity: 0.6,
                },
                '&:focus-visible': {
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.25)}`,
                },
                },
            })}
        >
            <ToggleButton value="tasker" aria-label="Tasker">
                <Stack direction="row" spacing={1} alignItems="center">
                    <HandymanOutlinedIcon fontSize="small" />
                    <Typography variant="body2">Tasker</Typography>
                </Stack>
            </ToggleButton>

            <ToggleButton value="poster" aria-label="Poster">
                <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    <Typography variant="body2">Poster</Typography>
                </Stack>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}



