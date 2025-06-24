const resultContainer = document.getElementById("resultContainer");
const resultBody = document.getElementById("result");
const messageBox = document.getElementById("message");
const table = document.getElementById("table");

console.log("loaded the page");

const stations = [
  "AHMEDABAD",
  "AJMER",
  "AMRITSAR",
  "BANGALORE",
  "BHOPAL",
  "CHENNAI",
  "CHITORGARH",
  "DIBRUGARH",
  "DEHRADUN",
  "DELHI",
  "GOA",
  "GORAKHPUR",
  "HOWRAH",
  "HISAR",
  "HYDERABAD",
  "INDORE",
  "JAIPUR",
  "JOADHPUR",
  "JODHPUR",
  "JAMMU",
  "KATHGODAM",
  "KANPUR",
  "KOTA",
  "KOLKATA",
  "LUCKNOW",
  "MUMBAI",
  "PATNA",
  "PURI",
  "PUNE",
  "RAJKOT",
  "SEALDAH",
  "SIKAR",
  "UDAIPUR",
  "VARANASI",
];

const destInput = document.getElementById("destination");
const sourceInput = document.getElementById("source");
const destSuggeesion = document.getElementById("destinationSuggestion");
const sourceSuggeesion = document.getElementById("sourceSuggestion");

function suggest(e) {
  console.log("Suggest function called");
  const inputEl = e.target;
  const input = inputEl.value.toLowerCase();
  const suggestionBox =
    inputEl.id === "destination" ? destSuggeesion : sourceSuggeesion;

  suggestionBox.innerHTML = "";

  if (input === "") {
    suggestionBox.classList.add("hidden");
    return;
  }

  const filtered = stations.filter((station) =>
    station.toLowerCase().startsWith(input)
  );

  if (filtered.length === 0) {
    suggestionBox.classList.add("hidden");
    return;
  }

  filtered.forEach((station) => {
    const li = document.createElement("li");
    li.textContent = station;
    li.className = "px-4 py-2 hover:bg-blue-100 cursor-pointer";
    li.addEventListener("click", () => {
      inputEl.value = station;
      suggestionBox.classList.add("hidden");
    });
    suggestionBox.appendChild(li);
  });

  suggestionBox.classList.remove("hidden");
}

destInput.addEventListener("keyup", suggest);
sourceInput.addEventListener("keyup", suggest);

// Search button logic
document.getElementById("search").addEventListener("click", (e) => {
  resultBody.innerHTML = "";
  messageBox.innerHTML = "";
  e.preventDefault();

  const arrivalStation = sourceInput.value.trim();
  const destinationStation = destInput.value.trim();

  if (!arrivalStation || !destinationStation) {
    console.error("⚠️ Please enter both stations");
    return;
  }

  // Show loading
  table.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  messageBox.classList.remove("hidden");
  messageBox.innerHTML = `
    <div class="flex justify-center items-center">
      <svg class="animate-spin h-8 w-8 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span class="text-yellow-300 font-semibold">Searching Trains...</span>
    </div>
  `;

  fetch("https://irctc-ticket-booking-app.onrender.com/searchTrain", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      arrivalStation: arrivalStation,
      destinationStation: destinationStation,
    }),
    credentials: "include",
  })
    .then((res) => res.text())
    .then((text) => {
      try {
        const data = JSON.parse(text); // Try parsing as JSON
        console.log(data);
        presentData(data); // Show in table
      } catch (e) {
        // Not JSON, treat as plain message
        resultContainer.classList.remove("hidden");
        document.getElementById("table").classList.add("hidden");
        messageBox.textContent = text; // E.g., "No Trains Found"
        messageBox.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("❌ Error occurred:", error);
      resultContainer.classList.remove("hidden");
      resultBody.innerHTML = "";
      document.getElementById("table").classList.add("hidden");
      messageBox.textContent = "❌ Something went wrong.";
      messageBox.classList.remove("hidden");
    });

  function presentData(data) {
    resultBody.innerHTML = "";

    if (!data || data.length === 0) {
      table.classList.add("hidden");
      messageBox.classList.remove("hidden");
      messageBox.innerHTML = `<div class="text-yellow-300 text-center font-semibold">🚫 No trains found.</div>`;
      return;
    }

    // Hide message and show table
    messageBox.classList.add("hidden");
    table.classList.remove("hidden");

    data.forEach((train) => {
      const row = document.createElement("tr");

      const stationsFormatted = train.stations
        .map(
          (station) =>
            `<div class="text-yellow-300 whitespace-nowrap">${station}</div>`
        )
        .join("");

      row.innerHTML = `
      <td class="px-4 py-2 font-semibold">${train.trainName}</td>
      <td class="px-4 py-2">${train.trainType}</td>
      <td class="px-4 py-2">${train.sourceStation} → ${train.destinationStation}</td>
      <td class="px-4 py-2">${train.departureTime}</td>
      <td class="px-4 py-2">${train.arrivalTime}</td>
      <td class="px-4 py-2">${train.totalSeats}</td>
      <td class="px-4 py-2">${stationsFormatted}</td>
    `;
      resultBody.appendChild(row);
    });
  }
});
