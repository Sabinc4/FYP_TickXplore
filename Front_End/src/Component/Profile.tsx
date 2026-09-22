import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usersApi, authApi, type Role } from "../api";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  role: string;
  profilePhoto?: string;
  vendorName?: string;
  vendorLocation?: string;
  _id: string;
}

interface ProfileFormData extends Record<string, unknown> {
  name: string;
  email: string;
  location: string;
  role: string;
  profilePhotoFile: File | null;
}

const extractProfileFields = (data: ProfileData) => ({
  name: data.vendorName || data.name || "",
  location: data.vendorLocation || data.location || "",
  email: data.email || "",
  role: data.role || "user",
});

const getUpdatePayload = (role: string, form: Pick<ProfileFormData, "name" | "location">) =>
  role === "vendor"
    ? { vendorName: form.name, vendorLocation: form.location }
    : { name: form.name, location: form.location };

const validatePassword = (password: string) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<Role>("user");
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ profile: string | null; password: string | null; delete: string | null }>({
    profile: null,
    password: null,
    delete: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    location: "",
    role: "",
    profilePhotoFile: null,
  });
  const [profilePhoto, setProfilePhoto] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [actionLoading, setActionLoading] = useState({ save: false, password: false, delete: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const loggedIn = localStorage.getItem("userLoggedIn");
      const storedRole = localStorage.getItem("userRole") as Role | null;
      const id =
        storedRole === "admin"
          ? localStorage.getItem("adminId")
          : storedRole === "vendor"
          ? localStorage.getItem("vendorId")
          : localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!loggedIn || !storedRole || !id || !token) {
        toast.error("Please login to access your profile");
        navigate("/sign-in");
        return;
      }

      setUserRole(storedRole);

      try {
        const data = await usersApi.getById(id);
        const profile = (data.admin || data.vendor || data.user) as ProfileData | undefined;
        if (!profile) throw new Error("Profile data not found");

        setUser(profile);
        setProfilePhoto(profile.profilePhoto || "");
        setFormData({ ...extractProfileFields(profile), profilePhotoFile: null });
      } catch (err) {
        console.error("Profile load error:", err);
        const message = (err as Error).message || "Failed to load profile";
        toast.error(message);
        setErrors((prev) => ({ ...prev, profile: message }));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!editMode) setShowPasswordFields(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setFormData((prev) => ({ ...prev, profilePhotoFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user || !user._id) return;
    if (!validateForm()) return;

    const toastId = toast.loading("Saving profile changes...");
    setActionLoading((prev) => ({ ...prev, save: true }));
    const payload = getUpdatePayload(userRole, formData);
    const body = new FormData();

    Object.entries(payload).forEach(([key, value]) => body.append(key, String(value)));
    if (formData.profilePhotoFile) body.append("profilePhoto", formData.profilePhotoFile);

    try {
      const updated = await usersApi.updateProfile(userRole, user._id, body);
      const updatedUser = (updated.admin || updated.vendor || updated.user) as ProfileData;

      if (!updatedUser) throw new Error("No updated user returned from server");

      const updatedName = userRole === "vendor" ? updatedUser.vendorName : updatedUser.name;

      localStorage.setItem("userName", updatedName || "");
      window.dispatchEvent(new Event("storageUpdate"));

      setUser(updatedUser);
      setFormData({ ...extractProfileFields(updatedUser), profilePhotoFile: null });
      setProfilePhoto(updatedUser.profilePhoto || "");
      setPreview(null);
      setEditMode(false);

      toast.dismiss(toastId);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again");
        return;
      }
      console.error("Profile update error:", err);
      toast.dismiss(toastId);
      toast.error((err as Error).message || "Failed to update profile");
    } finally {
      setActionLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
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
      toast.error("Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char");
      return;
    }

    const toastId = toast.loading("Updating password...");
    setActionLoading((prev) => ({ ...prev, password: true }));

    try {
      await authApi.changePassword(userRole, { currentPassword, newPassword, confirmPassword });
      toast.dismiss(toastId);
      toast.success("Password changed successfully!");
      setShowPasswordFields(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again");
        return;
      }
      console.error("Password change error:", err);
      toast.dismiss(toastId);
      toast.error(axiosErr.response?.data?.message || "Password update failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const toastId = toast.loading("Processing account deletion...");
    setActionLoading((prev) => ({ ...prev, delete: true }));

    try {
      await usersApi.deleteAccount(userRole, user._id);
      localStorage.clear();
      toast.dismiss(toastId);
      toast.success("Account deleted");
      window.setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
        toast.error("Session expired. Please login again");
        return;
      }
      console.error("Account deletion error:", err);
      toast.dismiss(toastId);
      toast.error(axiosErr.response?.data?.message || "Account deletion failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: false }));
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center text-slate-900">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );

  if (errors.profile)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-card">
          <div className="mb-4 text-red-500">{errors.profile}</div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const avatarImage = preview || profilePhoto;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="mx-2 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-card-lg md:p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">My Profile</h1>

        {editMode ? (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    No Image
                  </div>
                )}
                <div>
                  <label className="cursor-pointer rounded-xl bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600">
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
                        setFormData((prev) => ({ ...prev, profilePhotoFile: null }));
                        setPreview(null);
                        toast.info("Profile photo removed (unsaved changes)");
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2 text-slate-400"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                {showPasswordFields ? "Hide Password Change" : "Change Password?"}
              </button>
            </div>

            {showPasswordFields && (
              <div className="mb-6 space-y-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field !pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.current ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-700">New Password *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field !pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.new ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Must be at least 8 characters with uppercase, lowercase, number, and special
                    character
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-slate-700">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field !pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPasswords.confirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={actionLoading.password}
                  className="w-full rounded-xl bg-emerald-600 py-2 text-white transition hover:bg-emerald-700"
                >
                  {actionLoading.password ? "Processing..." : "Update Password"}
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-between gap-4">
              <button
                onClick={handleSave}
                disabled={actionLoading.save}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white transition hover:bg-blue-700"
              >
                {actionLoading.save ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleEditToggle}
                className="flex-1 rounded-xl bg-slate-600 py-2 text-white transition hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-500 bg-slate-200 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-lg font-medium text-slate-900">{formData.name}</p>
            </div>

            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg font-medium text-slate-900">{formData.email}</p>
            </div>

            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Location</p>
              <p className="text-lg font-medium text-slate-900">
                {formData.location || "Not specified"}
              </p>
            </div>

            <div className="mb-6 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Role</p>
              <p className="text-lg font-medium capitalize text-slate-900">{formData.role}</p>
            </div>

            <div className={`flex ${userRole !== "admin" ? "justify-between" : ""} gap-4`}>
              <button
                onClick={handleEditToggle}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white transition hover:bg-blue-700"
              >
                Edit Profile
              </button>
              {userRole !== "admin" && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 rounded-xl bg-red-600 py-2 text-white transition hover:bg-red-700"
                >
                  Delete Account
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteModal && userRole !== "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Confirm Account Deletion
            </h2>
            <p className="mb-6 text-slate-500">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl bg-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={actionLoading.delete}
                className="rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                {actionLoading.delete ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;