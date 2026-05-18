import {useState} from 'react'
import {Box, Typography, Autocomplete, TextField} from "@mui/material"

import request from "../../utils/request"

export default function TaskLocationInput({onPlaceSelect, error, selectedSuburb}){
    const [options, setOptions] = useState([]);
    const [sessionId] = useState(() => crypto.randomUUID());
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value) => {
        if (!value || value.trim().length === 0) {
            setOptions([]);
            return;
        }

        try{
            const placeResult = await request.get(`/place/autocomplete?q=${value}&session=${sessionId}`);
            if(placeResult.code === 0){
                setOptions(placeResult.data);
            }
        }catch(error){
            console.error("Error fetching place autocomplete:", error);
        }
    }

    const handleAutoCompleteChange = async (event, value) => {
        if (!value) {
            onPlaceSelect?.("");
            return;
        }

        try {
            setLoading(true);

            const detailsResult = await request.get(`/place/details?place_id=${value.place_id}&session=${sessionId}`);

            if(detailsResult.code === 0){
                const {suburb, city, postcode} = detailsResult.data;
                onPlaceSelect?.([suburb, city, postcode].filter(Boolean).join(", "));
            }
        } catch(error) {
            console.error("Error fetching place details:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                What suburb is the task in?
            </Typography>
            <Autocomplete
                sx={{mt: '16px'}}
                options={options}
                getOptionLabel={(option) => option.description || ""}
                onInputChange={(event, value, reason) => {
                    if (reason === 'clear') {
                        setOptions([]);
                        onPlaceSelect?.("");
                        return;
                    }

                    // Ignore Autocomplete reset/blur events so remounting this step
                    // does not overwrite the selected suburb held by the parent.
                    if (reason !== 'input') {
                        return;
                    }

                    onPlaceSelect?.(value);
                    handleSearch(value);
                }}
                onChange={handleAutoCompleteChange}
                inputValue={selectedSuburb || ""}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Enter suburb or postcode *"
                        error={!!error}
                        helperText={error || "Select from the dropdown to confirm the location"}
                    />
                )}
            />
        </Box>
    )
}
