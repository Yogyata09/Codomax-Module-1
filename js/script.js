
const sampleBlogs = [
  {
    id: "sample-1",
    title: "The Art of Slowing Down",
    category: "Lifestyle",
    excerpt: "Finding beauty in the little moments we usually rush past.",
    content: "Life does not always need to move at full speed. Sometimes, slowing down helps us notice the small moments that make life meaningful.",
    author: "Inkly Editorial",
    date: "2026-10-10",
    sample: true
  },
  {
    id: "sample-2",
    title: "A Human Side of AI",
    category: "Technology",
    excerpt: "How technology can support creativity without replacing it.",
    content: "Technology is most useful when it helps people explore ideas, solve problems, and create something meaningful.",
    author: "Inkly Editorial",
    date: "2026-10-08",
    sample: true
  },
  {
    id: "sample-3",
    title: "Postcards from Somewhere",
    category: "Travel",
    excerpt: "Why new places can change the way we see familiar things.",
    content: "Travelling is not only about reaching a destination. It is also about discovering different perspectives and experiences.",
    author: "Inkly Editorial",
    date: "2026-10-06",
    sample: true
  },
  {
    id: "sample-4",
    title: "Becoming Your Own Person",
    category: "Personal Growth",
    excerpt: "A gentle reminder that growth has no fixed timeline.",
    content: "Personal growth is not a race. Small steps, reflection, and consistency can help us move towards the person we want to become.",
    author: "Inkly Editorial",
    date: "2026-10-04",
    sample: true
  },
  {
    id: "sample-5",
    title: "A Home Full of Light",
    category: "Lifestyle",
    excerpt: "Creating a peaceful space with little things that matter.",
    content: "A comfortable home is built from personal touches, meaningful objects, and the feeling of being able to rest.",
    author: "Inkly Editorial",
    date: "2026-10-02",
    sample: true
  },
  {
    id: "sample-6",
    title: "Learning in Public",
    category: "Technology",
    excerpt: "Why sharing your progress can make learning more meaningful.",
    content: "Documenting what you learn helps you reflect, build confidence, and connect with others who are learning too.",
    author: "Inkly Editorial",
    date: "2026-10-01",
    sample: true
  }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getUsers() {
  return readStorage("inklyUsers", []);
}

function getBlogs() {
  return readStorage("inklyBlogs", []);
}

function getCurrentUser() {
  return readStorage("inklyCurrentUser", null);
}

function saveBlogs(blogs) {
  localStorage.setItem("inklyBlogs", JSON.stringify(blogs));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getAllDisplayBlogs() {
  return [...getBlogs().slice().reverse(), ...sampleBlogs];
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function renderBlogCards(category = "All") {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  const blogs = getAllDisplayBlogs().filter(blog =>
    category === "All" || blog.category === category
  );

  const styles = ["art-lilac", "art-peach", "art-green", "art-blue", "art-pink", "art-yellow"];
  const icons = {
    "Lifestyle": "☕",
    "Technology": "⌘",
    "Travel": "✈️",
    "Personal Growth": "🌱"
  };

  grid.innerHTML = blogs.length ? blogs.map((blog, index) => `
    <article class="blog-card">
      <div class="blog-art ${styles[index % styles.length]}">
        ${icons[blog.category] || "✍️"}
      </div>
      <div class="blog-card-content">
        <span class="blog-category">${escapeHTML(blog.category)}</span>
        <h3>${escapeHTML(blog.title)}</h3>
        <p>${escapeHTML(blog.excerpt)}</p>
        <div class="blog-meta">
          <span>${escapeHTML(blog.author || "Inkly Writer")}</span>
          <span>${formatDate(blog.date)}</span>
        </div>
        <details style="margin-top:12px">
          <summary class="text-link" style="cursor:pointer">Read story</summary>
          <p style="white-space:pre-wrap;margin-top:10px">${escapeHTML(blog.content)}</p>
        </details>
      </div>
    </article>
  `).join("") : `<div class="empty-state"><h3>No stories found</h3><p>Try another category.</p></div>`;
}

function initHome() {
  renderBlogCards();

  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-category]").forEach(item => {
        item.classList.remove("active");
      });
      button.classList.add("active");
      renderBlogCards(button.dataset.category);
    });
  });

  const navActions = document.getElementById("navActions");
  const user = getCurrentUser();

  if (navActions && user) {
    navActions.innerHTML = `
      <span style="font-size:12px">Hi, ${escapeHTML(user.name)}</span>
      <a class="btn btn-primary" href="dashboard.html">Dashboard</a>
    `;
  }
}

function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    if (name.length < 2 || password.length < 6) {
      message.textContent = "Please enter valid details.";
      message.className = "message error";
      return;
    }

    const users = getUsers();

    if (users.some(user => user.email === email)) {
      message.textContent = "This email is already registered. Please log in.";
      message.className = "message error";
      return;
    }

    // Demo only: never store plain-text passwords in a real application.
    users.push({ name, email, password });
    localStorage.setItem("inklyUsers", JSON.stringify(users));
    localStorage.setItem("inklyCurrentUser", JSON.stringify({ name, email }));

    message.textContent = "Account created! Opening your dashboard...";
    message.className = "message";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const user = getUsers().find(item =>
      item.email === email && item.password === password
    );

    if (!user) {
      message.textContent = "Account not found or password is incorrect. Register first if needed.";
      message.className = "message error";
      return;
    }

    localStorage.setItem("inklyCurrentUser", JSON.stringify({
      name: user.name,
      email: user.email
    }));

    message.textContent = "Login successful! Opening dashboard...";
    message.className = "message";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  });
}

function initCreateBlog() {
  const form = document.getElementById("createBlogForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const user = getCurrentUser();
    const message = document.getElementById("createBlogMessage");

    if (!user) {
      message.textContent = "Please log in or register before publishing.";
      message.className = "message error";
      return;
    }

    const title = document.getElementById("blogTitle").value.trim();
    const category = document.getElementById("blogCategory").value;
    const excerpt = document.getElementById("blogExcerpt").value.trim();
    const content = document.getElementById("blogContent").value.trim();

    if (!title || !category || !excerpt || content.length < 20) {
      message.textContent = "Please complete all fields. Your story needs at least 20 characters.";
      message.className = "message error";
      return;
    }

    const blogs = getBlogs();

    blogs.push({
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      title,
      category,
      excerpt,
      content,
      author: user.name,
      email: user.email,
      date: new Date().toISOString().slice(0, 10)
    });

    saveBlogs(blogs);
    window.location.href = "dashboard.html";
  });
}

function initDashboard() {
  const table = document.getElementById("dashboardBlogs");
  if (!table) return;

  const user = getCurrentUser();

  if (!user) {
    document.getElementById("welcomeMessage").textContent =
      "Please log in or create an account to manage your stories.";
    table.innerHTML = "";
    document.getElementById("dashboardEmpty").innerHTML = `
      <h3>Welcome to Inkly.</h3>
      <p>Log in to manage your blog posts.</p>
      <a class="btn btn-primary" style="margin-top:15px" href="login.html">Log in</a>
      <a class="btn btn-light" style="margin-top:15px" href="register.html">Register</a>
    `;
    return;
  }

  document.getElementById("welcomeMessage").textContent =
    `Welcome back, ${user.name}. Here's your writing space.`;

  function refreshDashboard() {
    const blogs = getBlogs().filter(blog => blog.email === user.email);

    document.getElementById("totalBlogs").textContent = blogs.length;
    document.getElementById("publishedBlogs").textContent = blogs.length;
    document.getElementById("categoryCount").textContent =
      new Set(blogs.map(blog => blog.category)).size;

    document.getElementById("dashboardEmpty").style.display =
      blogs.length ? "none" : "block";

    table.innerHTML = blogs.slice().reverse().map(blog => `
      <tr>
        <td>${escapeHTML(blog.title)}</td>
        <td>${escapeHTML(blog.category)}</td>
        <td>${formatDate(blog.date)}</td>
        <td><button class="delete-btn" data-delete="${escapeHTML(blog.id)}">Delete</button></td>
      </tr>
    `).join("");
  }

  table.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    const id = button.dataset.delete;
    const remaining = getBlogs().filter(blog =>
      !(blog.id === id && blog.email === user.email)
    );

    saveBlogs(remaining);
    refreshDashboard();
  });

  refreshDashboard();
}

function initLogout() {
  const button = document.getElementById("logoutBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    localStorage.removeItem("inklyCurrentUser");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initHome();
  initRegister();
  initLogin();
  initCreateBlog();
  initDashboard();
  initLogout();
});
