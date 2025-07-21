"use client";
import { ApiResponse, IUser } from "@/types";
import { useState } from "react";

export default function UserSection({ users }: { users: IUser[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const { data } = useUsers();

  // console.log("dataa", data?.data);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
  });

  // Create user
  const createUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || null,
          age: formData.age ? parseInt(formData.age) : null,
        }),
      });

      const result: ApiResponse<IUser> = await response.json();

      if (result.success) {
        setSuccess("User created successfully!");
        setFormData({ email: "", name: "", age: "" });
        // fetchUsers(); // Refresh list
      } else {
        setError(result.error || "Failed to create user");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<IUser> = await response.json();

      if (result.success) {
        setSuccess("User deleted successfully!");
        // fetchUsers(); // Refresh list
      } else {
        setError(result.error || "Failed to delete user");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  //   // Load users on component mount
  //   useEffect(() => {
  //     fetchUsers();
  //   }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Prisma Demo - User Management
        </h1>
        <p className="text-gray-600">
          Test your Prisma setup with this simple CRUD application
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25"
              />
            </div>

            <button
              onClick={createUser}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
            <button
              //   onClick={fetchUsers}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No users found. Create your first user!
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {user.name || "No name"}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.age && (
                        <p className="text-sm text-gray-500">Age: {user.age}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Created: {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Prisma Connected Successfully
        </div>
      </div>
    </div>
  );
}
