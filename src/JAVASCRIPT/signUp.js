console.log("SignUp script loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const form = document.getElementById("signupForm");
  const otpSection = document.getElementById("otpSection");
  const passwordSection = document.getElementById("passwordSection");
  const loader = document.getElementById("loader");
  const blurOverlay = document.getElementById("blurOverlay");

  if (!form || !otpSection || !passwordSection || !loader || !blurOverlay) {
    console.error("❌ Missing elements:", {
      form: !!form,
      otpSection: !!otpSection,
      passwordSection: !!passwordSection,
      loader: !!loader,
      blurOverlay: !!blurOverlay,
    });
    return;
  }

  let currentStep = "sendEmail";

  function showLoader(show) {
    console.log("Toggling loader:", show);
    loader.classList.toggle("hidden", !show);
    blurOverlay.classList.toggle("hidden", !show);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🟡 Form submission started, step:", currentStep);

    // Step-wise validation
    if (currentStep === "sendEmail") {
      const userName = document.getElementById("username").value.trim();
      const userEmail = document.getElementById("email").value.trim();
      if (!userName || !userEmail) {
        alert("Please enter both username and email.");
        showLoader(false);
        return;
      }
    } else if (currentStep === "verifyCode") {
      const otpVal = document.getElementById("otp").value.trim();
      if (!otpVal) {
        alert("Please enter the OTP.");
        showLoader(false);
        return;
      }
    } else if (currentStep === "setPassword") {
      const pwd = document.getElementById("password").value.trim();
      if (!pwd) {
        alert("Please enter a password.");
        showLoader(false);
        return;
      }
    }

    showLoader(true);
    try {
      let res, data;
      const commonOpts = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
      };

      if (currentStep === "sendEmail") {
        const userName = document.getElementById("username").value.trim();
        const userEmail = document.getElementById("email").value.trim();
        const body = new URLSearchParams({
          step: "sendEmail",
          userName,
          userEmail,
        });
        console.log("Sending email request:", { userName, userEmail });
        res = await fetch(
          "https://irctc-ticket-booking-app.onrender.com/SignUp",
          {
            ...commonOpts,
            body,
          }
        );
      } else if (currentStep === "verifyCode") {
        const otpVal = document.getElementById("otp").value.trim();
        const body = new URLSearchParams({
          step: "verifyCode",
          InputCode: otpVal,
        });
        console.log("Verifying OTP:", otpVal);
        res = await fetch(
          "https://irctc-ticket-booking-app.onrender.com/SignUp",
          {
            ...commonOpts,
            body,
          }
        );
      } else if (currentStep === "setPassword") {
        const pwd = document.getElementById("password").value.trim();
        const body = new URLSearchParams({
          step: "setPassword",
          password: pwd,
        });
        console.log("Setting password");
        res = await fetch(
          "https://irctc-ticket-booking-app.onrender.com/SignUp",
          {
            ...commonOpts,
            body,
          }
        );
      }

      console.log("Fetch status:", res.status);
      data = await res.json();
      console.log("Fetch data:", data);

      // Handle per step response
      if (currentStep === "sendEmail") {
        alert(data.message);
        console.log(
          "sendEmail response success:",
          data.success,
          typeof data.success
        );
        if (data.success === "true" || data.success === true) {
          // Handle both string and boolean
          console.log("Email sent, showing OTP section");
          console.log("otpSection before:", otpSection.classList);
          otpSection.classList.remove("hidden");
          console.log("otpSection after:", otpSection.classList);
          currentStep = "verifyCode";
        } else {
          console.error("❌ sendEmail failed:", data.message);
        }
      } else if (currentStep === "verifyCode") {
        alert(data.message);
        if (data.success === "true" || data.success === true) {
          // Handle both string and boolean
          console.log("OTP verified, showing password section");
          passwordSection.classList.remove("hidden");
          currentStep = "setPassword";
        } else {
          console.error("❌ OTP failed:", data.message);
          const otpInput = document.getElementById("otp");
          otpInput.value = "";
          otpInput.focus();
          passwordSection.classList.add("hidden");
        }
      } else if (currentStep === "setPassword") {
        alert(data.message);
        if (data.success === "true" || data.success === true) {
          // Handle both string and boolean
          console.log("Password set, redirecting...");
          form.reset();
          window.location.href = "index.html";
        } else {
          console.error("❌ setPassword failed:", data.message);
        }
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Something went wrong! Please try again.");
    } finally {
      showLoader(false);
    }
  });
});
