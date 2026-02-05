import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StudentDashCard from "../component/StudentDashCard";
import { getProfileApi, updateProfileApi } from "../services/api";
import userAvatar from "../assets/user.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getProfileApi();
      setUser(data);
      setFormData({
        firstName: data.username?.split(" ")[0] || "",
        lastName: data.username?.split(" ")[1] || "",
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("profilePicture", file);

    try {
      setUploading(true);
      await updateProfileApi(fd);
      toast.success("Profile photo updated");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        username: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      await updateProfileApi(dataToSend);
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  const profileImage = user.profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}?t=${Date.now()}`
    : userAvatar;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <div className="md:w-1/4">
          <StudentDashCard />
        </div>

        <div className="md:w-3/4 space-y-6">

          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-gray-500">
              Manage your account and learning preferences
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="border rounded-xl p-6 flex flex-col items-center">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
                onError={(e) => (e.target.src = userAvatar)}
              />
              <h2 className="font-semibold text-lg">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-500 capitalize">{user.role}</p>

              <span className="mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Active Learner
              </span>

              <label className="mt-4 w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
                <div className="w-full border rounded-lg py-2 text-center hover:bg-gray-50">
                  {uploading ? "Uploading..." : "Change Photo"}
                </div>
              </label>
            </div>

            <div className="lg:col-span-2 border rounded-xl p-6">
              <h3 className="font-semibold mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
                <InfoInput
                  label="Location"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  readOnly={!editing}
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                {editing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          firstName: user.username?.split(" ")[0] || "",
                          lastName: user.username?.split(" ")[1] || "",
                          email: user.email,
                          phoneNumber: user.phoneNumber,
                          address: user.address,
                        });
                      }}
                      className="px-6 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-black text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-black text-white rounded-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoInput = ({ label, value, icon, onChange, name, readOnly }) => (
  <div>
    <label className="text-sm text-gray-500 mb-1 block">{label}</label>
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
      {icon && <span>{icon}</span>}
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className="bg-transparent w-full outline-none text-sm"
      />
    </div>
  </div>
);

export default Profile;
