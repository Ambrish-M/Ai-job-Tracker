import User from "../models/user.model.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    // Email validation regex (strict format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (name) {
      if (name.length < 2) {
        return res
          .status(400)
          .json({ message: "The name must be at least two characters long" });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
        },
      },
      { new: true }
    )
      .select("-password")
      .lean();

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};
