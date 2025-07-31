import React from "react";

const Profile = () => {
  // For now, we'll use dummy user data. Replace with real auth/user context later.
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    company: "ClientFlow CRM",
    joinedAt: "March 2024",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-gray-700">
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">Company:</span> {user.company}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">Joined:</span> {user.joinedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
