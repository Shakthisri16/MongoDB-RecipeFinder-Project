const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginBtn.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  signupForm.classList.add("hidden");
});

signupBtn.addEventListener("click", () => {
  signupForm.classList.toggle("hidden");
  loginForm.classList.add("hidden");
});

//Handle Signup
signupForm.querySelector("button").addEventListener("click", async () => {
  const username = signupForm.querySelector("input[type='text']").value;
  const password = signupForm.querySelector("input[type='password']").value;

  const res = await fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);
});

// Handle Login
loginForm.querySelector("button").addEventListener("click", async () => {
  const username = loginForm.querySelector("input[type='text']").value;
  const password = loginForm.querySelector("input[type='password']").value;

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);
});

document.getElementById('loginSubmit').addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('username', username);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.message);
  }
});

document.querySelectorAll(".save-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const recipeId = btn.getAttribute("data-id");
    const action = btn.innerText === "Save" ? "save" : "unsave";

    await fetch(`http://localhost:5000/recipes/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId, username: 'tempUser' }) // Replace with session username
    });

    btn.innerText = action === "save" ? "Unsave" : "Save";
  });
});

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}
