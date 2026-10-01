const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary data (Module 2 only)
const users = [];
const blogs = [];

let nextUserId = 1;
let nextBlogId = 1;

// Test route
app.get("/", (req, res) => {
  res.send("Blog Application Backend is running!");
});

// 1. User Registration API
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill in all fields"
    });
  }

  const existingUser = users.find(
    user => user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered"
    });
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    password
  };

  users.push(user);

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// 2. User Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// 3. Create Blog API
app.post("/api/blogs", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required"
    });
  }

  const blog = {
    id: nextBlogId++,
    title,
    content,
    userId: userId || null,
    createdAt: new Date().toISOString()
  };

  blogs.push(blog);

  res.status(201).json({
    message: "Blog created successfully",
    blog
  });
});

// 4. Get All Blogs API
app.get("/api/blogs", (req, res) => {
  res.json(blogs);
});

// 5. Get One Blog API
app.get("/api/blogs/:id", (req, res) => {
  const blog = blogs.find(
    blog => blog.id === Number(req.params.id)
  );

  if (!blog) {
    return res.status(404).json({
      message: "Blog not found"
    });
  }

  res.json(blog);
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});