// Save new user to localStorage
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('regUsername').value;
  const pass = document.getElementById('regPassword').value;

  if (user && pass) {
    localStorage.setItem(`user_${user}`, pass);
    alert("Registration successful! Now login.");
    window.location.href = "login.html";
  } else {
    alert("Fill in both fields!");
  }
});

// Check login
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value;
  const pass = document.getElementById('loginPassword').value;

  const storedPass = localStorage.getItem(`user_${user}`);

  if (storedPass === pass) {
    alert(`Welcome back, ${user}!`);
    localStorage.setItem("loggedInUser", user);
    window.location.href = "profile.html";
  } else {
    alert("Invalid username or password.");
  }
});
