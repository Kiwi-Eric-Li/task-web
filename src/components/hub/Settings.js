import {useState, useEffect, useRef} from 'react'
import {
    Paper,
    Button,
    Avatar,
    Typography,
    Box,
    TextField,
    Chip,
} from "@mui/material"
import {useSelector, useDispatch} from 'react-redux';
import { Upload, Check } from "@mui/icons-material";

const MAX_AVATAR_BYTES = 1 * 1024 * 1024; // 1MB
const NAME_MAX = 40;
const BIO_MAX = 500;

export default function Settings(){

    const {userData} = useSelector(state => state.userData || {});
    const [currentAvatarSrc, setCurrentAvatarSrc] = useState('');
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: 'lxf101',
        bio: 'Hawke’s Bay Regional Prison is a prison facility in New Zealand located in the Hawke’s Bay Region on the North Island. It’s situated just outside the city of Hastings, south of the town centre.'
    });

    const [categoriesData, setCategoriesData] = useState([
        {
            id: 1,
            name: 'Administrative Services'
        },
        {
            id: 2,
            name: 'Alternative Services'
        },
        {
            id: 3,
            name: 'Applicance Installation'
        },
        {
            id: 4,
            name: 'Automotive Services'
        },
        {
            id: 5,
            name: 'Beauty & Wellness'
        },
        {
            id: 6,
            name: 'Computer & IT Services'
        },
        {
            id: 7,
            name: 'Education & Tutoring'
        },
        {
            id: 8,
            name: 'Roofing & Construction'
        }
    ]);

    const [initialCategoryIds, setInitialCategoryIds] = useState([1, 3]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([1, 3]);
    const [isCategoriesDirty, setIsCategoriesDirty] = useState(true);
    const [isAccountEditing, setIsAccountEditing] = useState(false);
    const [initialAccount, setInitialAccount] = useState({ username: "", email: "" });
    const [accountDraft, setAccountDraft] = useState({ username: "", email: "" });
    const [savingAccount, setSavingAccount] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);

    const toggleCategory = (categoryId) => {
        if(selectedCategoryIds.includes(categoryId)){
            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
        }else{
            setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        }
    }

    useEffect(() => {
        setCurrentAvatarSrc(userData.avatar_url);
    }, []);

    useEffect(() => {
        setIsCategoriesDirty(selectedCategoryIds.length === initialCategoryIds.length && [...selectedCategoryIds].sort().every((item, index) => item === [...initialCategoryIds].sort()[index]));
    }, [selectedCategoryIds])


    const onAvatarFileSelected = () => {

    }

    const onChangeAvatarClick = () => {

    }

    const handleSaveProfile = () => {

    }

    const handleSaveCategories = () => {

    }

    const handleStartAccountEdit = () => {
        setAccountDraft({
            username: initialAccount.username || "",
            email: initialAccount.email || "",
        });
        setIsAccountEditing(true);
    }

    const handleAccountFieldChange = (field, value) => {
        setAccountDraft((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancelAccountEdit = () => {
        setIsAccountEditing(false);
        setAccountDraft({
            username: initialAccount.username || "",
            email: initialAccount.email || "",
        });
    }

    const handleSaveAccount = () => {

    }

    const handlePasswordSubmit = () => {
        
    }


    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{p: 2}}>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Account Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your account preferences and settings
                </Typography>
            </Box>
            {/* Profile settings */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}>
                    Profile Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Avatar
                            src={currentAvatarSrc}
                            sx={{ width: 80, height: 80, fontSize: "1.125rem" }}
                        >
                            AJ
                        </Avatar>
                        <Box>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onAvatarFileSelected}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Upload />}
                                onClick={onChangeAvatarClick}
                                sx={{
                                    textTransform: "none",
                                    borderColor: "divider",
                                    color: "text.primary",
                                    "&:hover": { borderColor: "text.secondary", bgcolor: "action.hover" },
                                }}
                            >
                                Change Avatar
                            </Button>
                            <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 1 }}>
                                JPG or PNG. Max size 5&nbsp;MB.
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}>
                            Full Name
                        </Typography>
                        <TextField
                            fullWidth
                            value={profileData.name}
                            inputProps={{ maxLength: NAME_MAX }}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            size="small"
                        />
                    </Box>
                
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}>
                            Bio
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={profileData.bio}
                            inputProps={{ maxLength: BIO_MAX }}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        />
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 1 }}>
                            Brief description for your profile. Max 500 characters.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        // disabled={savingProfile || !isProfileDirty || profileData.name.trim().length === 0}
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            textTransform: "none",
                            alignSelf: "flex-start",
                            "&:hover": { bgcolor: "primary.dark" },
                        }}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
                    Preferred Categories
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                    Select topics you're interested in to personalize your experience
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {(categoriesData ?? []).map((category) => {
                        const isSelected = selectedCategoryIds.includes(category.id);
                        return (
                            <Chip
                                key={category.id}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {category.name}
                                        {isSelected && <Check sx={{ fontSize: 16, color: "primary.main" }} />}
                                    </Box>
                                }
                                onClick={() => toggleCategory(category.id)}
                                variant="outlined"
                                sx={{
                                    px: 1,
                                    py: 2,
                                    cursor: "pointer",
                                    bgcolor: "transparent",
                                    color: isSelected ? "primary.main" : "text.primary",
                                    borderColor: isSelected ? "primary.main" : "divider",
                                    borderWidth: isSelected ? 2 : 1,
                                    borderStyle: "solid",
                                    "&:hover": {
                                        bgcolor: "transparent",
                                        borderColor: isSelected ? "primary.main" : "text.primary",
                                    },
                                }}
                            />
                        );
                    })}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSaveCategories}
                        disabled={isCategoriesDirty}
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            textTransform: "none",
                            "&:hover": { bgcolor: "primary.dark" },
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Paper>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
                    Account Details
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                    Manage your login email, username, and password
                </Typography>
                {
                    !isAccountEditing ? 
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    Username
                                </Typography>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>{initialAccount.username || "Not set"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    Email
                                </Typography>
                                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                    {initialAccount.email || "Not set"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button variant="outlined" onClick={handleStartAccountEdit} sx={{ textTransform: "none" }}>
                                    Edit
                                </Button>
                            </Box>
                        </Box>
                    : 
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Username"
                            fullWidth
                            size="small"
                            value={accountDraft.username}
                            onChange={(e) => handleAccountFieldChange("username", e.target.value)}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            size="small"
                            type="email"
                            value={accountDraft.email}
                            onChange={(e) => handleAccountFieldChange("email", e.target.value)}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={handleCancelAccountEdit}
                                disabled={savingAccount}
                                sx={{ textTransform: "none" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveAccount}
                                disabled={savingAccount}
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    textTransform: "none",
                                    "&:hover": { bgcolor: "primary.dark" },
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                }
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "text.primary", mb: 1 }}>
                        Password
                    </Typography>
                    {
                        !isPasswordEditing ? 
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ letterSpacing: 4, color: "text.secondary" }}
                                >
                                    ••••••••
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsPasswordEditing(true)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Update Password
                                </Button>
                            </Box>
                            : 
                            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                            </Box>
                    }
                </Box>

            </Paper>



        </Box>
    )
}