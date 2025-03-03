import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    monthlyBudget: 0,
    savingsGoal: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/1"); // Replace with actual user ID or logic
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      await axios.put("http://localhost:5000/api/users/1", formData); // Replace with actual user ID
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <input type="number" name="monthlyBudget" value={formData.monthlyBudget} onChange={handleChange} />
        <input type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Profile;
