// Import multer (tool used to upload files)
import multer from "multer";

// Tell multer to save uploaded file temporarily on server
const storage = multer.diskStorage({});

// Create upload middleware
// This helps us get the uploaded file in req.file
const upload = multer({ storage });

// Export it so we can use in other files
export default upload;
