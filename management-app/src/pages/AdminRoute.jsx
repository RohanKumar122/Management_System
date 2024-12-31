import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";

const AdminRoute = () => {
  const firebase = useFirebase();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await firebase.listAllUsers(); // Assuming firebase.listUsers() is fetching the user data
      console.log("Fetched users:", fetchedUsers);
      setUsers(fetchedUsers); // Set fetched users to state
    };

    fetchUsers();
  }, [firebase]);

  // Filter users into admin and non-admin
  const adminUsers = users.filter(user => user.isAdmin);
  const nonAdminUsers = users.filter(user => !user.isAdmin);

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      await firebase.addUser({ email, isAdmin });
      setEmail(""); // Clear input after adding
      setIsAdmin(false);
      setShowModal(false); // Close modal
      // Re-fetch users
      const fetchedUsers = await firebase.listAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (uid) => {
    try {
      await firebase.deleteUser(uid); // Assume deleteUser deletes a user by UID
      // Re-fetch users
      const fetchedUsers = await firebase.listAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle setting a user as admin
  const handleSetAsAdmin = async (uid) => {
    try {
      await firebase.setUserAdmin(uid, true); // Assume setUserAdmin makes a user an admin
      // Re-fetch users
      const fetchedUsers = await firebase.listAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error setting user as admin:", error);
    }
  };

  // Handle removing admin from a user
  const handleRemoveAdmin = async (uid) => {
    try {
      await firebase.setUserAdmin(uid, false); // Assume setUserAdmin removes admin status
      // Re-fetch users
      const fetchedUsers = await firebase.listAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h2>

      {/* Admin Users Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">Admin Users</h3>
        {adminUsers.length === 0 ? (
          <p>No admin users found.</p>
        ) : (
          <ul>
            {adminUsers.map((user) => (
              <li key={user.uid} className="flex justify-between items-center py-2 px-4 bg-gray-100 mb-2 rounded-md">
                <div>
                  <p>{user.email}</p>
                  <p className="text-sm text-gray-500">Status: Admin</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveAdmin(user.uid)}
                  >
                    Remove
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.uid)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Non-Admin Users Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">Non-Admin Users</h3>
        {nonAdminUsers.length === 0 ? (
          <p>No non-admin users found.</p>
        ) : (
          <ul>
            {nonAdminUsers.map((user) => (
              <li key={user.uid} className="flex justify-between items-center py-2 px-4 bg-gray-100 mb-2 rounded-md">
                <div>
                  <p>{user.email}</p>
                  <p className="text-sm text-gray-500">Status: Non-Admin</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleSetAsAdmin(user.uid)}
                  >
                    Set as Admin
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.uid)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button to open Add User Modal */}
      <button
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        Add New User
      </button>

      {/* Modal for Adding User */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Add New User</h3>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="block text-sm mb-2">Role</label>
            <select
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={isAdmin}
              onChange={(e) => setIsAdmin(e.target.value === "true")}
            >
              <option value={false}>Non-Admin</option>
              <option value={true}>Admin</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded text-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoute;
