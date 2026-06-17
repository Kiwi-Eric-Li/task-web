import { createTheme, alpha } from "@mui/material/styles"

export const taskTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#ce4257",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#F5F5F5",
            contrastText: "#262626",
        },
        // add status colors so components can stop importing CUSTOM_COLORS
        info: {
            main: "#0F62FE",
        },
        success: {
            main: "#24A148",
        },
        warning: {
            main: "#F1C21B",
            contrastText: "#262626",
        },
        error: {
            main: "#DC2626",
        },
        // extra brand accents used by dashboard
        accent: {
            main: "#9B8FFF",
        },
        good: {
            main: "#12A979",
        },
        background: {
            default: "#FAFAFA",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#262626",
            secondary: "#737373",
        },
        divider: "#E5E5E5",
    },
    typography: {
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
        h2: { fontSize: "1.85rem", fontWeight: 600, lineHeight: 1.3 },
        h3: { fontSize: "1.35rem", fontWeight: 600, lineHeight: 1.2 },
        body1: { fontSize: "0.875rem", lineHeight: 1.5 },
        body2: { fontSize: "0.75rem", lineHeight: 1.5 },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                },
                contained: { "&:hover": { opacity: 0.9 } },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                },
            },
        },
        MuiTextField: {
            // remove any previous defaultProps.color = "secondary"
            styleOverrides: {
                root: ({ theme }) => ({
                    // base outline (unfocused)
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.divider,
                    },
                    // hover outline
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.common.black, 0.28),
                    },
                    // focused outline -> BLACK
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.common.black,
                    },
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // belt & braces to ensure focus ring is black
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.common.black,
                    },
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // focused label -> BLACK
                    "&.Mui-focused": { color: theme.palette.common.black },
                }),
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.Mui-focused": { color: theme.palette.common.black },
                }),
            },
        },


        // Soft, tinted Chip to replace ad-hoc chip bg/colors in dashboard
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // use theme token via shape if preferred
                    fontWeight: 600,
                },
            },
            variants: [
                {
                    props: { variant: "soft", color: "info" },
                    style: ({ theme }) => ({
                        backgroundColor: alpha(theme.palette.info.main, 0.12),
                        color: theme.palette.info.main,
                        "& .MuiChip-icon": { color: theme.palette.info.main },
                    }),
                },
                {
                    props: { variant: "soft", color: "primary" },
                    style: ({ theme }) => ({
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.main,
                        "& .MuiChip-icon": { color: theme.palette.primary.main },
                    }),
                },
                {
                    props: { variant: "soft", color: "success" },
                    style: ({ theme }) => ({
                        backgroundColor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.main,
                        "& .MuiChip-icon": { color: theme.palette.success.main },
                    }),
                },
                {
                    props: { variant: "soft", color: "warning" },
                    style: ({ theme }) => ({
                        backgroundColor: alpha(theme.palette.warning.main, 0.18),
                        color: theme.palette.warning.contrastText,
                        "& .MuiChip-icon": { color: theme.palette.warning.contrastText },
                    }),
                },
                {
                    props: { variant: "soft", color: "error" },
                    style: ({ theme }) => ({
                        backgroundColor: alpha(theme.palette.error.main, 0.12),
                        color: theme.palette.error.main,
                        "& .MuiChip-icon": { color: theme.palette.error.main },
                    }),
                },
            ],
        },

        // Default Rating styling to replace ad-hoc colors in RatingBlock
        MuiRating: {
            styleOverrides: {
                iconFilled: ({ theme }) => ({
                    color: theme.palette.success.main, // replaces COLORS.good
                }),
                iconEmpty: ({ theme }) => ({
                    color: alpha(theme.palette.text.primary, 0.18), // replaces alpha(COLORS.ink, 0.18)
                }),
            },
        },
    },
})