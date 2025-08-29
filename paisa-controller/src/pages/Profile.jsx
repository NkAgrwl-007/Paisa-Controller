import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    monthlyBudget: 0,
    savingsGoal: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // TODO: Replace hardcoded "1" with logged-in user's ID
        const res = await axios.get("http://localhost:5000/api/users/1");
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/1", formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="number"
          name="monthlyBudget"
          placeholder="Monthly Budget"
          value={formData.monthlyBudget}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="number"
          name="savingsGoal"
          placeholder="Savings Goal"
          value={formData.savingsGoal}
          onChange={handleChange}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
