import { useEffect, useState, useRef } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

function getInitials(name, email) {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
    role: "user",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        if (res.data.success) {
          setProfile(res.data.user);
          setPreviewUrl(res.data.user.avatarUrl || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (previewUrl && avatarFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, avatarFile]);

  const handleChange = (e) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      form.append("name", profile.name);
      form.append("bio", profile.bio);
      if (avatarFile) form.append("avatar", avatarFile);

      const res = await axios.put("/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        setProfile(res.data.user);
        setPreviewUrl('http//localhost:5000/uploads/' + res.data.user.avatarUrl);
        setAvatarFile(null);
        alert("Profile updated");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return<Layout><div className="p-6">Loading profile...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center text-gray-500 text-xl font-semibold">
              {previewUrl ? (
                <img
                  src={
                    previewUrl.startsWith("/")
                      ? `${window.location.origin}${previewUrl}`
                      : previewUrl
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    setPreviewUrl("");
                  }}
                />
              ) : (
                getInitials(profile.name, profile.email)
              )}
            </div>
            <div>
              <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                />
              </label>
              {avatarFile && (
                <button
                  type="button"
                  className="block text-xs text-gray-500 mt-1"
                  onClick={() => {
                    setAvatarFile(null);
                    setPreviewUrl(profile.avatarUrl || "");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={profile.email}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <span className="text-sm font-medium text-gray-700">Role:</span>{" "}
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
              {profile.role}
            </span>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
