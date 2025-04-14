import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Helper functions
const extractProfileFields = (data, role) => {
  if (role === "vendor") {
    return {
      name: data.vendorName || "",
      location: data.vendorLocation || "",
      email: data.email || "",
      role: data.role || "vendor",
    };
  } else {
    return {
      name: data.name || "",
      location: data.location || "",
      email: data.email || "",
      role: data.role || role,
    };
  }
};

const getUpdatePayload = (role, formData) => {
  if (role === "vendor") {
    return {
      vendorName: formData.name,
      vendorLocation: formData.location,
    };
  } else {
    return {
      name: formData.name,
      location: formData.location,
    };
  }
};

const getEndpoint = (role) => {
  if (role === "user") return "users";   // ✅ correct plural
  return role;
};

const validatePassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    profile: null,
    password: null,
    delete: null
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    location: "", 
    role: "", 
    profilePhotoFile: null 
  });
  const [profilePhoto, setProfilePhoto] = useState("");
  const [preview, setPreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [actionLoading, setActionLoading] = useState({
    save: false,
    password: false,
    delete: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const loggedIn = localStorage.getItem("userLoggedIn");
      const role = localStorage.getItem("userRole");
      const id = role === "admin" 
        ? localStorage.getItem("adminId") 
        : role === "vendor" 
          ? localStorage.getItem("vendorId") 
          : localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!loggedIn || !role || !id || !token) {
        navigate("/sign-in");
        toast.error("Please login to access your profile");
        return;
      }
      
      setUserRole(role);
      const endpoint = getEndpoint(role);
      
      try {
        const response = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
          toast.error("Session expired. Please login again.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        const profile = data.admin || data.vendor || data.user;
        if (!profile) {
          throw new Error("Profile data not found");
        }
        
        setUser(profile);
        setProfilePhoto(profile.profilePhoto || "");
        const fields = extractProfileFields(profile, role);
        setFormData({ ...fields, profilePhotoFile: null });
        toast.success("Profile loaded successfully");
      } catch (err) {
        console.error("Profile load error:", err);
        setErrors(prev => ({...prev, profile: err.message || "Failed to load profile"}));
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    return true;
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setPreview(null);
    if (!editMode) {
      setShowPasswordFields(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Show toast when name changes in edit mode
    if (editMode && name === "name" && value !== user?.name) {
      toast.info("Name updated (changes not saved yet)");
    }
    
    // Show toast when location changes in edit mode
    if (editMode && name === "location" && value !== user?.location) {
      toast.info("Location updated (changes not saved yet)");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setFormData({ ...formData, profilePhotoFile: file });
    setPreview(URL.createObjectURL(file));
    toast.info("Profile photo selected (changes not saved yet)");
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    setActionLoading(prev => ({ ...prev, save: true }));
    const endpoint = getEndpoint(userRole);
    const token = localStorage.getItem("token");
    const payload = getUpdatePayload(userRole, formData);
    const formDataToSend = new FormData();
  
    for (let key in payload) {
      formDataToSend.append(key, payload[key]);
    }
  
    if (formData.profilePhotoFile) {
      formDataToSend.append("profilePhoto", formData.profilePhotoFile);
    }
  
    try {
      const response = await fetch(`http://localhost:3001/${endpoint}/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
  
      console.log("UPDATE RESPONSE:", response);
  
      if (response.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again.");
        return;
      }
  
      const updated = await response.json();
  
      //Correctly extract updatedUser based on role
      let updatedUser = null;
      if (userRole === "admin") updatedUser = updated.admin;
      else if (userRole === "vendor") updatedUser = updated.vendor;
      else if (userRole === "user") updatedUser = updated.user;
  
      if (!updatedUser) {
        throw new Error("No updated user returned from server");
      }
  
      // Update localStorage for navbar initials
      if (updatedUser?.name) {
        localStorage.setItem("userName", updatedUser.name);
        window.dispatchEvent(new Event("storageUpdate"));
      }
  
      const updatedFields = extractProfileFields(updatedUser, userRole);
      setUser(updatedUser);
      setFormData({ ...updatedFields, profilePhotoFile: null });
      setProfilePhoto(updatedUser.profilePhoto || "");
      setPreview(null);
      setEditMode(false);
  
      // Toast message
      let successMessage = "Profile updated successfully!";
      if (formData.name !== user.name) {
        successMessage += ` Name changed from "${user.name}" to "${formData.name}".`;
      }
      if (formData.location !== user.location) {
        successMessage += ` Location changed from "${user.location || 'not specified'}" to "${formData.location}".`;
      }
      if (formData.profilePhotoFile) {
        successMessage += " Profile photo updated.";
      }
  
      toast.success(successMessage);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Profile update error:", err);
      setErrors(prev => ({ ...prev, profile: "Failed to update profile" }));
      toast.error(err.message || "Failed to update profile");
    } finally {
      setActionLoading(prev => ({ ...prev, save: false }));
    }
  };
  

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (!validatePassword(newPassword)) {
      toast.error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
      return;
    }

    setActionLoading(prev => ({...prev, password: true}));
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/auth/change-password/${userRole}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword, 
          confirmPassword 
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again.");
        return;
      }

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Password changed successfully. Please use your new password for future logins.");
        setShowPasswordFields(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(result.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err.message || "Something went wrong while changing password");
    } finally {
      setActionLoading(prev => ({...prev, password: false}));
    }
  };

  const handleDeleteAccount = async () => {
    setActionLoading(prev => ({...prev, delete: true}));
    const endpoint = getEndpoint(userRole);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://localhost:3001/${endpoint}/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (response.ok) {
        localStorage.clear();
        navigate("/");
        toast.success("Account deleted successfully. We're sorry to see you go!");
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete account");
      }
    } catch (err) {
      console.error("Account deletion error:", err);
      toast.error(err.message || "Failed to delete account");
    } finally {
      setActionLoading(prev => ({...prev, delete: false}));
      setShowDeleteModal(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    </div>
  );

  if (errors.profile) return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full text-center">
        <div className="text-red-400 mb-4">{errors.profile}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-10">
      <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-4 md:p-8 border border-slate-700 mx-2">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">My Profile</h1>
        
        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Profile Photo</label>
              <div className="flex items-center space-x-4">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-full" />
                ) : profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
                ) : (
                  <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
                <div>
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-md text-sm">
                    Change Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                  {formData.profilePhotoFile && (
                    <button 
                      onClick={() => {
                        setFormData({...formData, profilePhotoFile: null});
                        setPreview(null);
                        toast.info("Profile photo removed (changes not saved yet)");
                      }}
                      className="mt-2 text-red-400 hover:text-red-300 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                disabled 
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-300 cursor-not-allowed" 
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Location *</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              />
            </div>

            <div className="mb-4">
              <button 
                onClick={() => setShowPasswordFields(!showPasswordFields)} 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                {showPasswordFields ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Password Change
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Change Password?
                  </>
                )}
              </button>
            </div>

            {showPasswordFields && (
              <div className="space-y-3 mb-6 p-4 bg-slate-700 rounded-lg">
                <div>
                  <label className="block text-sm text-white mb-1">Current Password *</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.current ? "text" : "password"} 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      className="w-full px-3 py-2 rounded bg-slate-100 text-black pr-10" 
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.current ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white mb-1">New Password *</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.new ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full px-3 py-2 rounded bg-slate-100 text-black pr-10" 
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.new ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-white mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.confirm ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full px-3 py-2 rounded bg-slate-100 text-black pr-10" 
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.confirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handlePasswordChange} 
                  disabled={actionLoading.password}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex justify-center items-center"
                >
                  {actionLoading.password ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Update Password"}
                </button>
              </div>
            )}

            <div className="flex justify-between gap-4 mt-6">
              <button 
                onClick={handleSave} 
                disabled={actionLoading.save}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex justify-center items-center"
              >
                {actionLoading.save ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
              <button 
                onClick={handleEditToggle} 
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-24 h-24 object-cover rounded-full border-4 border-blue-500" 
                />
              ) : (
                <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center text-white border-4 border-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Name</p>
              <p className="text-lg font-medium text-white">{formData.name}</p>
            </div>

            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Email</p>
              <p className="text-lg font-medium text-white">{formData.email}</p>
            </div>

            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Location</p>
              <p className="text-lg font-medium text-white">{formData.location || "Not specified"}</p>
            </div>

            <div className="mb-6 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Role</p>
              <p className="text-lg font-medium text-white capitalize">{formData.role}</p>
            </div>

            <div className="flex justify-between gap-4">
              <button 
                onClick={handleEditToggle} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Account Deletion</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount} 
                disabled={actionLoading.delete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
              >
                {actionLoading.delete ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;