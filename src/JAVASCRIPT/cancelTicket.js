// cancelTicket.js
// Handles ticket cancellation via CancelTicketServlet
console.log("file loaded: cancelTicket.js");

const backendUrl = "https://irctc-ticket-booking-app.onrender.com/cancelTicket"; // Update with your backend URL

// Select elements by ID
const ticketInput = document.getElementById("ticketIdInput");
const cancelBtn = document.getElementById("cancelBtn");
const loader = document.getElementById("bookingLoader");

if (!cancelBtn) {
  console.warn("Cancel button not found in DOM");
} else {
  if (!loader)
    console.warn("Loader element with id 'bookingLoader' not found.");

  // Show loader overlay
  function showLoader() {
    loader?.classList.remove("hidden");
  }
  // Hide loader overlay
  function hideLoader() {
    loader?.classList.add("hidden");
  }

  // Create and display a styled popup modal
  function showPopup(message, isSuccess) {
    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "loginModal"; // reuse id for consistency
    // Overlay
    overlay.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm";

    // Modal box
    const box = document.createElement("div");
    box.className =
      "bg-slate-800 text-yellow-400 rounded-2xl shadow-xl p-6 w-80 text-center";

    // Title
    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = isSuccess ? "Success" : "Error";

    // Message
    const msg = document.createElement("p");
    msg.className = "mb-4";
    msg.textContent = message;

    // Button group container
    const btnGroup = document.createElement("div");
    btnGroup.className = "flex flex-col gap-3";

    // OK button
    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.className =
      "w-full bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition";
    okBtn.addEventListener("click", () => document.body.removeChild(overlay));

    btnGroup.appendChild(okBtn);
    box.append(title, msg, btnGroup);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // Attach listener directly to the button
  cancelBtn.addEventListener("click", () => {
    const ticketId = ticketInput.value.trim();
    if (!ticketId) {
      showPopup("Please enter a valid Ticket ID.", false);
      return;
    }

    showLoader();
    cancelBtn.disabled = true;

    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `ticketId=${encodeURIComponent(ticketId)}`,
    })
      .then((res) => res.json())
      .then(({ success, message }) => {
        hideLoader();
        cancelBtn.disabled = false;
        showPopup(message, success);
        if (success) ticketInput.value = "";
      })
      .catch((err) => {
        hideLoader();
        cancelBtn.disabled = false;
        console.error(err);
        showPopup("Network error. Please try again.", false);
      });
  });
}
