import express from "express";
console.log("SERVER.TS LOADING...");
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    const db = new Database(path.join(__dirname, "aars.db"));

    // Initialize database
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        address TEXT,
        phone TEXT,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        booking_date TEXT,
        booking_time TEXT,
        service_type TEXT,
        notary_method TEXT,
        document_type TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS archives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        file_name TEXT,
        extracted_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });

    app.use(express.json({ limit: '50mb' }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  app.get("/api/test", (req, res) => {
    res.send("API is working");
  });

  // API Routes
  app.post("/api/users", (req, res) => {
    const { fullName, address, phone, email } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (full_name, address, phone, email) VALUES (?, ?, ?, ?)").run(fullName, address, phone, email);
      res.json({ id: info.lastInsertRowid });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as any;
        res.json({ id: user.id });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.get("/api/notes/:userId", (req, res) => {
    const notes = db.prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(notes);
  });

  app.post("/api/notes", (req, res) => {
    const { userId, content } = req.body;
    db.prepare("INSERT INTO notes (user_id, content) VALUES (?, ?)").run(userId, content);
    res.json({ success: true });
  });

  app.get("/api/bookings/:userId", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { userId, date, time, serviceType, notaryMethod, documentType } = req.body;
    db.prepare("INSERT INTO bookings (user_id, booking_date, booking_time, service_type, notary_method, document_type) VALUES (?, ?, ?, ?, ?, ?)").run(userId, date, time, serviceType, notaryMethod, documentType);
    res.json({ success: true });
  });

  app.get("/api/archives/:userId", (req, res) => {
    const archives = db.prepare("SELECT * FROM archives WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json(archives);
  });

  app.post("/api/archives", (req, res) => {
    const { userId, fileName, extractedText } = req.body;
    db.prepare("INSERT INTO archives (user_id, file_name, extracted_text) VALUES (?, ?, ?)").run(userId, fileName, extractedText);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        allowedHosts: true,
        cors: true,
      },
      appType: "spa",
    });
    
    console.log("Vite server created in middleware mode");
    app.use(vite.middlewares);

    // Explicit SPA fallback for development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      console.log(`[Dev SPA Fallback] Request for ${url}`);
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        console.error(`SPA Fallback Error for ${url}:`, e);
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  console.log("Starting server in", process.env.NODE_ENV || "development", "mode");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();
