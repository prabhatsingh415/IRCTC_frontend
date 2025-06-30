const backendURL = "https://irctc-ticket-booking-app.onrender.com/bookTicket";
const bookingLoader = document.getElementById("bookingLoader");

let trainIdValidated = false;

// 1) Validate Train ID
document
  .getElementById("validateTrainBtn")
  .addEventListener("click", async () => {
    const trainId = document.getElementById("trainId").value.trim();
    if (!trainId) {
      return showPopup("Please enter Train ID first.");
    }

    bookingLoader.classList.remove("hidden");
    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ step: "trainId", trainId }),
      });
      const data = await res.json();
      bookingLoader.classList.add("hidden");

      // LOGIN check on Validate step
      if (!data.success && data.message.toLowerCase().includes("not logged")) {
        return showLoginModal();
      }
      if (!data.success) {
        return showPopup(data.message);
      }

      // Populate stations dropdowns
      if (Array.isArray(data.stations)) {
        const stations = data.stations;
        const sourceStations = stations.slice(0, -1);
        const destStations = stations.slice(1);

        const sourceSelect = document.getElementById("sourceStation");
        const destSelect = document.getElementById("destinationStation");

        sourceSelect.innerHTML =
          "<option value=''>Select Source Station</option>";
        sourceStations.forEach((s) => {
          const o = document.createElement("option");
          o.value = s;
          o.textContent = s;
          sourceSelect.appendChild(o);
        });

        destSelect.innerHTML =
          "<option value=''>Select Destination Station</option>";
        destStations.forEach((s) => {
          const o = document.createElement("option");
          o.value = s;
          o.textContent = s;
          destSelect.appendChild(o);
        });
      }

      trainIdValidated = true;
      document.getElementById("trainIdSection").classList.add("hidden");
      document.getElementById("bookingFormSection").classList.remove("hidden");
      showPopup("Train ID validated! Please complete the rest of the form.");
    } catch (err) {
      console.error("Error validating Train ID:", err);
      bookingLoader.classList.add("hidden");
      showPopup("Something went wrong. Try again.");
    }
  });

// 2) Confirm Booking (Date + Final)
document.getElementById("confirmBtn").addEventListener("click", async () => {
  if (!trainIdValidated) {
    return showPopup("Please validate Train ID first.");
  }

  const name = document.getElementById("passengerName").value.trim();
  const source = document.getElementById("sourceStation").value.trim();
  const dest = document.getElementById("destinationStation").value.trim();
  const date = document.getElementById("travelDate").value;

  if (!name || !source || !dest || !date) {
    return showPopup("Please fill all fields.");
  }

  bookingLoader.classList.remove("hidden");
  try {
    // STEP 2: Date
    let res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: new URLSearchParams({ step: "date", date }),
    });
    let data = await res.json();

    // LOGIN check on Date step
    if (!data.success && data.message.toLowerCase().includes("not logged")) {
      bookingLoader.classList.add("hidden");
      return showLoginModal();
    }
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
        dest,
      }),
    });
    data = await res.json();
    bookingLoader.classList.add("hidden");

    // LOGIN check on Final step
    if (!data.success && data.message.toLowerCase().includes("not logged")) {
      return showLoginModal();
    }
    if (!data.success) {
      return showPopup(data.message);
    }

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
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}
