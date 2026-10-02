import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// Render deployment: Serve the static files from the React app
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.use((req, res) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});
