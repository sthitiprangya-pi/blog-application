let blogs = [
  {
    title: "My First Blog",
    content: "Welcome to my blog! This is my first post."
  }
];

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

// Display blog posts
function displayBlogs() {
  const blogList = document.getElementById("blog-list");
  const myPosts = document.getElementById("my-posts");

  blogList.innerHTML = "";
  myPosts.innerHTML = "";

  blogs.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blog-card";

    const title = document.createElement("h3");
    title.textContent = blog.title;

    const content = document.createElement("p");
    content.textContent = blog.content;

    card.append(title, content);

    blogList.appendChild(card);
    myPosts.appendChild(card.cloneNode(true));
  });
}

// Create and publish a blog
document.getElementById("blog-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const title = document.getElementById("blog-title").value.trim();
    const content = document.getElementById("blog-content").value.trim();

    if (!title || !content) {
      alert("Please enter a title and content.");
      return;
    }

    blogs.unshift({ title, content });

    this.reset();

    displayBlogs();
    showPage("home");

    alert("Blog published successfully!");
  }
);

// Demo registration form
document.getElementById("register-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();
    alert("Registration demo completed!");
    this.reset();
    showPage("login");
  }
);

// Demo login form
document.getElementById("login-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();
    alert("Login demo completed!");
    showPage("dashboard");
  }
);

// Load initial blog posts
displayBlogs();