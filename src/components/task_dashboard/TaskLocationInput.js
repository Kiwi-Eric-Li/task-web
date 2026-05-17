import {useState, useEffect} from 'react'
import {Box, Typography, Autocomplete, TextField} from "@mui/material"

import request from "../../utils/request"

export default function TaskLocationInput(){
    const [options, setOptions] = useState([]);
    const [sessionId, setSessionId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);


    const handleSearch = async (value) => {
        if (!value || value.trim().length === 0) {
            setOptions([]);
            return;
        }
        
        try{
            const placeResult = await request.get(`/place/autocomplete?q=${value}&session=${sessionId}`);
            console.log("placeResult=", placeResult);
            if(placeResult.code === 0){
                setOptions(placeResult.data);
            }
        }catch(error){
            console.error("Error fetching place autocomplete:", error);
        }
        
    }

    const handleAutoCompleteChange = async (event, value) => {
        console.log("Selected place:", value);
        
        if (!value) {
            setIsSelected(false);
            return;
        }
        
        try {
            setLoading(true);
            
            const detailsResult = await request.get(`/place/details?place_id=${value.place_id}&session=${sessionId}`);
            
            if(detailsResult.code === 0){
                const {suburb, city, postcode} = detailsResult.data;
                console.log("suburb=", suburb);
                console.log("city=", city);
                console.log("postcode=", postcode);
                setInputValue([suburb, city, postcode].filter(Boolean).join(", "));
                setIsSelected(true);
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
                    // If the address is chosen, the inputValue is not changed when the focus is lost
                    if (isSelected && reason !== 'input') {
                        return;
                    }
                    
                    setInputValue(value);
                    // The search interface is only called 
                    // when the user actively inputs to avoid repeated calls 
                    // when the focus is lost
                    if (reason === 'input') {
                        setIsSelected(false);
                        handleSearch(value);
                    }
                }} 
                onChange={handleAutoCompleteChange}
                inputValue={inputValue}
                loading={loading}
                renderInput={(params) => (
                    <TextField {...params} label="Suburb" />
                )}
            />
        </Box>
    )
}