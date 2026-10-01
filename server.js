import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // Basic sanitization
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// JSON file to persist messages
const dbFile = path.join(__dirname, 'messages.json');
let messages = [];
if (fs.existsSync(dbFile)) {
  try {
    messages = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (e) {
    messages = [];
  }
}

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', upload.single('image'), (req, res) => {
  const { name, text, date } = req.body;
  let imageUrl = null;
  
  if (req.file) {
    // Return relative URL so it works in production regardless of domain
    // Add timestamp to ensure uniqueness and bust cache if needed
    imageUrl = '/uploads/' + req.file.filename;
  }

  const newMessage = {
    id: Date.now().toString(),
    name: name || '名無し',
    text: text || '',
    date: date || new Date().toLocaleString('ja-JP'),
    image: imageUrl
  };

  messages.unshift(newMessage);
  fs.writeFileSync(dbFile, JSON.stringify(messages, null, 2));

  res.status(201).json(newMessage);
});

const PORT = process.env.PORT || 3001;

// Render deployment: Serve the static files from the React app
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
