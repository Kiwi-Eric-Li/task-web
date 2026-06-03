import {useState, useEffect, useRef} from 'react'
import { createPortal } from "react-dom";
import {
    Paper,
    Button,
    Avatar,
    Typography,
    Box,
    TextField,
    Chip,
    Switch,
    Snackbar,
    Alert,
} from "@mui/material"
import {useSelector} from 'react-redux';
import { Upload, Check } from "@mui/icons-material";

import request from "../../utils/request"

const MAX_AVATAR_BYTES = 1 * 1024 * 1024; // 1MB
const NAME_MAX = 40;
const BIO_MAX = 500;


export default function Settings(){
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMsg, setAlertMsg] = useState("");

    const {categories} = useSelector((state) => state.categories);
    const [currentAvatarSrc, setCurrentAvatarSrc] = useState('');
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        id: '',
        name: '',
        bio: ''
    });

    const [categoriesData, setCategoriesData] = useState([]);

    const [initialCategoryIds, setInitialCategoryIds] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [isCategoriesDirty, setIsCategoriesDirty] = useState(true);
    const [isAccountEditing, setIsAccountEditing] = useState(false);
    const [initialAccount, setInitialAccount] = useState({ username: "", email: "" });
    const [accountDraft, setAccountDraft] = useState({ username: "", email: "" });
    
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [avatarError, setAvatarError] = useState("");
    const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
    
    const [notificationSettings, setNotificationSettings] = useState({
        inApp: true,
        email: true,
        marketing: true,
    });

    const toggleCategory = (categoryId) => {
        if(selectedCategoryIds.includes(categoryId)){
            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
        }else{
            setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        }
    }

    const getNotificationSettings = async() => {
        try{
            const response = await request.get("/auth/notification-settings?user_id=" + profileData.id);
            if(response.code === 0){
                setNotificationSettings({
                    inApp: response.data.app_enabled ? true : false,
                    email: response.data.email_enabled ? true : false,
                    marketing: response.data.marketing_opt ? true : false
                });
            }else{
                setOpenAlert(true);
                setAlertType('error');
                setAlertMsg("Failed to load notification settings");
            }
        }catch(e){
            console.error(e);
        }
    }

    useEffect(() => {
        
        const getUserInfo = async () => {
            try{
                const response = await request.get("auth/user-info");
                
                if(response.code === 0){
                    setCurrentAvatarSrc(response.data.avatar_url);
                    setProfileData({
                        id: response.data.id,
                        name: (response.data.firstname || "") + " " + (response.data.lastname || ""),
                        bio: response.data.bio || ""
                    });
                    setInitialAccount({
                        username: response.data.username || "",
                        email: response.data.email || ""
                    });
                }else{
                    console.error(response.message);
                }
            }catch(e){
                console.error(e);
            }
        };

        const getUserCategories = async () => {
            try{
                const response = await request.get("/auth/preferred-category");
                if(response.code === 0){
                    const categoryIds = response.data.map(cat => String(cat.category_id));
                    setSelectedCategoryIds(categoryIds);
                    setInitialCategoryIds(categoryIds);
                }
            }catch(e){
                console.error(e);
            }
        }

        async function init(){
            await getUserInfo();
            await getUserCategories();
        }

        init();
        
    }, []);

    useEffect(() => {
        if (profileData.id) {
            getNotificationSettings();
        }
    }, [profileData.id]);

    useEffect(() => {
        setIsCategoriesDirty(selectedCategoryIds.length === initialCategoryIds.length && [...selectedCategoryIds].sort().every((item, index) => item === [...initialCategoryIds].sort()[index]));
    }, [selectedCategoryIds])

    useEffect(() => {
        if(categories.length > 0){
            setCategoriesData(categories);
        }
    }, [categories])

    const onAvatarFileSelected = (e) => {
        const file = e.target.files?.[0];
        console.log(file);
        if(!file){
            return;
        }
        if(!file.type.startsWith("image/")){
            setAvatarError("Please choose an image file.");
            e.target.value = "";
            return;
        }
        if(file.size > MAX_AVATAR_BYTES){
            setAvatarError("Image must be smaller than 1MB.");
            e.target.value = "";
            return;
        }
        const url = URL.createObjectURL(file);
        setCurrentAvatarSrc(url);

        setAvatarError(null);
        setPendingAvatarFile(file);
    }

    const onChangeAvatarClick = () => {
        fileInputRef.current?.click();
    }

    const handleSaveProfile = async () => {

        try{
            const formData = new FormData();
            formData.append("id", profileData.id);
            formData.append("firstname", profileData.name.trim().split(" ")[0]);
            formData.append("lastname", profileData.name.trim().split(" ")[1]);
            formData.append("bio", profileData.bio);
            if (pendingAvatarFile) {
                formData.append("avatar", pendingAvatarFile);
            }

            const response = await request.put("/auth/user-info", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if(response.code === 0){
                setOpenAlert(true);
                setAlertType('success');
                setAlertMsg(response.message);
                setPendingAvatarFile(null);
            }else{
                setOpenAlert(true);
                setAlertType('error');
                setAlertMsg(response.message);
            }
        }catch(e){
            console.error(e);
        }
    }

    const handleSaveCategories = async () => {
        const data = [];
        selectedCategoryIds.forEach((id) => {
            data.push({"user_id": profileData.id, "category_id": Number(id) });
        });

        try{
            const response = await request.put("/auth/preferred-category", data);
            if(response.code === 0){
                setOpenAlert(true);
                setAlertType('success');
                setAlertMsg("replace successfully");
            }
        }catch(e){
            console.error(e);
        }
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

    const handleSaveAccount = async () => {

        try{
            const response = await request.put("/auth/user-account", {
                "id": profileData.id,
                "username": accountDraft.username,
                "email": accountDraft.email
            });
            if(response.code === 0){
                setOpenAlert(true);
                setAlertType('success');
                setAlertMsg(response.message);
                setIsAccountEditing(false);
                setInitialAccount({
                    "username": accountDraft.username,
                    "email": accountDraft.email
                });
            }else{
                setOpenAlert(true);
                setAlertType('error');
                setAlertMsg(response.message);
            }
        }catch(e){
            console.error(e);
        }
    }

    const handleCancelPasswordEdit = () => {
        setIsPasswordEditing(false);
    }

    const updateNotif = async (val) => {
        
        const key = Object.keys(val)[0];
        val[key] = Number(val[key]);

        try{
            const response = await request.put("/auth/notification-settings", val);
            
            if(response.code === 0){
                setOpenAlert(true);
                setAlertType('success');
                setAlertMsg("set successfully");
            }else{
                setOpenAlert(true);
                setAlertType('error');
                setAlertMsg("set failed");
            }
        }catch(e){
            console.error(e);
        }

    }

    const handleUpdatePassword = () => {
        setIsPasswordEditing(true);
        setPwdError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    const ModifyPwdChange = async () => {
        setPwdError("");

        if(newPassword !== confirmPassword){
            setPwdError("New password and confirm password do not match.");
            return ;
        }

        try{
            const response = await request.put("auth/modify-password", {
                "id": profileData.id,
                "current_pwd": oldPassword,
                "new_pwd": newPassword
            });
            
            setOpenAlert(true);
            if(response.code === 0){
                setAlertType('success');
                setAlertMsg(response.message);
                handleUpdatePassword();
                handleCancelPasswordEdit();
            }else{
                setAlertType('error');
                setAlertMsg(response.message);
            }
        }catch(e){
            console.error(e);
        }
    }


    const snackbar = (
        <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ zIndex: 99999 }}>
            <Alert severity={alertType}>{alertMsg}</Alert>
        </Snackbar>
    );

    return (
        <>
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
                                {avatarError && (
                                    <Typography variant="caption" sx={{ display: "block", color: "error.main", mt: 0.5 }}>
                                        {avatarError}
                                    </Typography>
                                )}
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
                            disabled={profileData.name.trim().length === 0 || profileData.bio.trim().length === 0}
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
                {/* Preferred Categories */}
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
                                            {category.title}
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
                {/* Account Details */}
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
                                    sx={{ textTransform: "none" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveAccount}
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
                                        onClick={handleUpdatePassword}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Update Password
                                    </Button>
                                </Box>
                                : 
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        label="Current password"
                                        type="password"
                                        fullWidth
                                        size="small"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <TextField
                                        label="New password"
                                        type="password"
                                        fullWidth
                                        size="small"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <TextField
                                        label="Confirm new password"
                                        type="password"
                                        fullWidth
                                        size="small"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {pwdError && (
                                        <Typography color="error" fontSize={14} mt={1}>
                                            {pwdError}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancelPasswordEdit}
                                            sx={{ textTransform: "none" }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={oldPassword === "" || newPassword === "" || confirmPassword === ""}
                                            sx={{
                                                bgcolor: "primary.main",
                                                color: "primary.contrastText",
                                                textTransform: "none",
                                                "&:hover": { bgcolor: "primary.dark" },
                                            }}
                                            onClick={ModifyPwdChange}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Box>
                        }
                    </Box>
                </Paper>
                {/* Notification Preferences */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
                        Notification Preferences
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                        Choose how you want to be notified about updates
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    In-App Notifications
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    Receive notifications while using the app
                                </Typography>
                            </Box>
                            <Switch
                                checked={notificationSettings.inApp}
                                onChange={(e) => {
                                    const val = e.target.checked;
                                    setNotificationSettings((s) => ({ ...s, inApp: val }));
                                    updateNotif({ "app_enabled": val });
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    Email Notifications
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    Get important updates via email
                                </Typography>
                            </Box>
                            <Switch
                                checked={notificationSettings.email}
                                onChange={(e) => {
                                    const val = e.target.checked;
                                    setNotificationSettings((s) => ({ ...s, email: val }));
                                    updateNotif({ "email_enabled": val });
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "text.primary" }}>
                                    Marketing Emails
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    Receive news, tips, and special offers
                                </Typography>
                            </Box>
                            <Switch
                                checked={notificationSettings.marketing}
                                onChange={(e) => {
                                    const val = e.target.checked;
                                    setNotificationSettings((s) => ({ ...s, marketing: val }));
                                    // server uses "opt-out"
                                    updateNotif({ "marketing_opt": val });
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Box>
            {openAlert && createPortal(snackbar, document.body)}
        </>
    )
}