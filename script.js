const API_URL = "http://localhost:3000/api";

// Switch between pages
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");

  if (pageId === "home" || pageId === "dashboard") {
    displayBlogs();
  }
}

// Display blogs from the backend

async function displayBlogs() {
  try {
    const response = await fetch(`${API_URL}/blogs`);

    if (!response.ok) {
      throw new Error("Could not load blogs");
    }

    const blogs = await response.json();
    const blogList = document.getElementById("blog-list");
    const myPosts = document.getElementById("my-posts");

    blogList.innerHTML = "";
    myPosts.innerHTML = "";

    blogs.forEach(blog => {
      function createCard(isMyPost) {
        const card = document.createElement("article");
        card.className = "blog-card";

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const content = document.createElement("p");
        content.textContent = blog.content;

        const readButton = document.createElement("button");
        readButton.textContent = "Read More";
        readButton.addEventListener("click", () => {
          document.getElementById("detail-title").textContent = blog.title;
          document.getElementById("detail-content").textContent = blog.content;
          showPage("blog-detail");
        });

        card.append(title, content, readButton);

        if (isMyPost) {
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";

          editButton.addEventListener("click", async () => {
            const newTitle = prompt("Edit blog title:", blog.title);
            if (newTitle === null) return;

            const newContent = prompt("Edit blog content:", blog.content);
            if (newContent === null) return;

            if (!newTitle.trim() || !newContent.trim()) {
              alert("Title and content are required.");
              return;
            }

            try {
              const result = await fetch(`${API_URL}/blogs/${blog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: newTitle.trim(),
                  content: newContent.trim()
                })
              });

              const data = await result.json();
              if (!result.ok) throw new Error(data.message);

              alert("Blog updated successfully!");
              await displayBlogs();
            } catch (error) {
              alert(error.message || "Unable to update blog");
            }
          });

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";

          deleteButton.addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this blog?")) return;

            try {
              const result = await fetch(`${API_URL}/blogs/${blog._id}`, {
                method: "DELETE"
              });

              const data = await result.json();
              if (!result.ok) throw new Error(data.message);

              alert("Blog deleted successfully!");
              await displayBlogs();
            } catch (error) {
              alert(error.message || "Unable to delete blog");
            }
          });

          card.append(editButton, deleteButton);
        }

        return card;
      }

      blogList.appendChild(createCard(false));
      myPosts.appendChild(createCard(true));
    });
  } catch (error) {
    console.error(error);
    alert("Unable to load blogs. Is the backend running?");
  }
}


// Create a blog using the backend API
document.getElementById("blog-form").addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    const title = document.getElementById("blog-title").value.trim();
    const content = document.getElementById("blog-content").value.trim();

    if (!title || !content) {
      alert("Please enter title and content");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Blog published successfully!");
      this.reset();

      showPage("home");

    } catch (error) {
      alert(error.message || "Unable to publish blog");
    }
  }
);

// Registration API
document.getElementById("register-form").addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    const inputs = this.querySelectorAll("input");

    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert(result.message);
      this.reset();
      showPage("login");

    } catch (error) {
      alert(error.message || "Registration failed");
    }
  }
);

// Login API
document.getElementById("login-form").addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    const inputs = this.querySelectorAll("input");

    const email = inputs[0].value.trim();
    const password = inputs[1].value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert(result.message);
      this.reset();
      showPage("dashboard");

    } catch (error) {
      alert(error.message || "Login failed");
    }
  }
);

// Load blogs when the page opens
displayBlogs();
async function showBlogDetail(blogId) {
  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}`);

    if (!response.ok) {
      throw new Error("Could not load blog details");
    }

    const blog = await response.json();

    document.getElementById("detail-title").textContent = blog.title;
    document.getElementById("detail-content").textContent = blog.content;

    showPage("blog-detail");
  } catch (error) {
    console.error(error);
    alert("Unable to load blog details");
  }
}