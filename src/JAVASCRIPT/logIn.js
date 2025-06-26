console.log("Login script loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const loader = document.getElementById("loader") || null;
  const blurOverlay = document.getElementById("blurOverlay") || null;

  function showLoader(show) {
    if (loader && blurOverlay) {
      loader.classList.toggle("hidden", !show);
      blurOverlay.classList.toggle("hidden", !show);
    }
  }

  if (!form) {
    console.error("❌ Login form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader(true);

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      showLoader(false);
      return;
    }

    try {
      const response = await fetch(
        "https://irctc-ticket-booking-app.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "include", // include cookies for session
          body: new URLSearchParams({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (data.message === "Login successful") {
        alert("✅ Login successful!");
        window.location.href = "index.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error during login:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      showLoader(false);
    }
  });
});
