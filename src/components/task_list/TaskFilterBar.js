import {useState} from "react";

import {
    Paper,
    Toolbar,
    TextField,
    Button,
    IconButton,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function TaskFilterBar({onChange}){

    const [titleDraft, setTitleDraft] = useState("");


    const applySearch = () => {

    }

    const clearSearch = () => {

    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderBottom: `1px solid #E5E5E5"`,
                bgcolor: "#fff",
            }}
            role="region"
            aria-label="Task filters">
            <Toolbar
                sx={{
                    gap: 2,
                    display: "flex",
                    alignItems: "center",
                }}>
                <TextField
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") applySearch();
                    }}
                    size="small"
                    placeholder="Search title…"
                    sx={{ flex: 1, minWidth: 0, maxWidth: "unset" }}
                    InputProps={{
                        endAdornment: titleDraft ? (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Clear search"
                                    edge="end"
                                    size="small"
                                    onClick={clearSearch}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />

                <Button sx={{textTransform: 'none'}} variant="contained" color="primary" size="small" onClick={applySearch}>
                    Search
                </Button>
            </Toolbar>
        </Paper>
    )
}