'use client';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { getAllUsers, updateUserRole } from '@/lib/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers();
      
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`User role updated to: ${newRole}`);
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-red-600" />;
      case 'user':
        return <FaUser className="text-blue-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaUsers className="text-2xl text-black" />
          <h3 className="text-2xl font-semibold text-black">Users Management</h3>
        </div>
        <div className="text-sm text-black">
          Total Users: {users.length}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading users: {error}</p>
            <button
              onClick={fetchUsers}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      {!loading && !error && (
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" key={index}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <h4 className="font-semibold text-lg text-black">
                          {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          User ID: {user.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Firebase UID: {user.uid}
                        </p>
                      </div>
                    </div>
                    <select
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      value={user.role || 'user'}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h5 className="font-medium mb-2 text-black">Contact Information:</h5>
                      <div className="space-y-1 text-sm text-black">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-500" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-500" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div>
                      <h5 className="font-medium mb-2 text-black">Personal Details:</h5>
                      <div className="space-y-1 text-sm text-black">
                        {user.firstName && (
                          <p>First Name: {user.firstName}</p>
                        )}
                        {user.lastName && (
                          <p>Last Name: {user.lastName}</p>
                        )}
                        <p>Display Name: {user.displayName || 'Not set'}</p>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div>
                      <h5 className="font-medium mb-2 text-black">Account Information:</h5>
                      <div className="space-y-1 text-sm text-black">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>Created: {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>Updated: {formatDate(user.updatedAt)}</span>
                        </div>
                        <p>Role: <span className={`font-semibold ${user.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                          {user.role || 'user'}
                        </span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-black text-lg">No users found</p>
              <p className="text-gray-500 text-sm mt-2">Users will appear here when they sign up</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
