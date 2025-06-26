const backendURL = "https://irctc-ticket-booking-app.onrender.com/bookTicket";

// Grab loader element
const bookingLoader = document.getElementById("bookingLoader");

document.getElementById("confirmBtn").addEventListener("click", async () => {
  const name = document.getElementById("passengerName").value.trim();
  const trainId = document.getElementById("trainId").value.trim();
  const source = document.getElementById("sourceStation").value.trim();
  const destination = document
    .getElementById("destinationStation")
    .value.trim();
  const date = document.getElementById("travelDate").value;

  // Show loader overlay
  bookingLoader.classList.remove("hidden");

  try {
    // STEP 1: Train ID
    let res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include", // <-- necessary to send session cookie
      body: new URLSearchParams({ step: "trainId", trainId }),
    });
    let data = await res.json();

    if (!data.success) {
      bookingLoader.classList.add("hidden");
      if (data.message.toLowerCase().includes("not logged")) {
        return showLoginModal();
      }
      return showPopup(data.message);
    }

    // STEP 2: Date
    res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: new URLSearchParams({ step: "date", date }),
    });
    data = await res.json();

    if (!data.success) {
      bookingLoader.classList.add("hidden");
      return showPopup(data.message);
    }

    // STEP 3: Final Booking
    res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: new URLSearchParams({
        step: "passengerName",
        name,
        src: source,
        dest: destination,
      }),
    });
    data = await res.json();

    if (!data.success) {
      bookingLoader.classList.add("hidden");
      return showPopup(data.message);
    }

    // Final Success
    bookingLoader.classList.add("hidden");
    showPopup(data.message, true);
  } catch (err) {
    console.error("Error booking ticket:", err);
    bookingLoader.classList.add("hidden");
    showPopup("Something went wrong. Try again.");
  }
});

function showPopup(message, success = false) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center";

  modal.innerHTML = `
    <div class="bg-slate-800 text-yellow-400 p-6 rounded-2xl w-80 text-center shadow-xl">
      <h2 class="text-xl font-bold mb-2">${
        success ? "Success ✅" : "Notice ⚠️"
      }</h2>
      <p class="mb-4">${message}</p>
      ${
        success
          ? `<a href="../html/index.html" class="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300">Home</a>`
          : `<button onclick="this.closest('div.fixed').remove()" class="mt-2 px-4 py-2 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black">OK</button>`
      }
    </div>`;
  document.body.appendChild(modal);
}

function showLoginModal() {
  document.getElementById("loginModal")?.classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal")?.classList.add("hidden");
}

// Optional: If you want closeLoginModal to be globally available (e.g., inline onclick),
// ensure this script is loaded after DOM, which is already the case since it's at end of body.
