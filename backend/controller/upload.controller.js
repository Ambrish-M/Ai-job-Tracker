import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Multer config
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("file");

// Convert file buffer → Base64 Data URI
const bufferToDataURI = (file) => {
  const base64 = file.buffer.toString("base64");
  const mime = file.mimetype; // example: application/pdf
  return `data:${mime};base64,${base64}`;
};

// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        message: "File too large. Maximum allowed size is 2MB.",
      });
    }

    const fileDataURI = bufferToDataURI(req.file);

    const result = await cloudinary.uploader.upload(fileDataURI, {
      folder: "resume_uploads",
      resource_type: "auto",
      pages: true, // Enables PDF preview thumbnails
    });

    return res.json({
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.file.originalname,
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

// Delete file by publicId
export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ msg: "publicId is required" });
    }

    const decodedId = decodeURIComponent(publicId);

    await cloudinary.uploader.destroy(decodedId, {
      resource_type: "raw", // ensures both raw & image files get deleted
    });

    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ msg: "Failed to delete file" });
  }
};
