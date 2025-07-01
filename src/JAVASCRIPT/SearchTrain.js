const resultContainer = document.getElementById("resultContainer");
const resultBody = document.getElementById("result");
const messageBox = document.getElementById("message");
const table = document.getElementById("table");
const searchLoader = document.getElementById("searchLoader");

function showSearchLoader() {
  searchLoader.classList.remove("hidden");
}

function hideSearchLoader() {
  searchLoader.classList.add("hidden");
}

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
const destSuggestion = document.getElementById("destinationSuggestion");
const sourceSuggestion = document.getElementById("sourceSuggestion");

function suggest(e) {
  const inputEl = e.target;
  const input = inputEl.value.toLowerCase();
  const suggestionBox =
    inputEl.id === "destination" ? destSuggestion : sourceSuggestion;

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

document.getElementById("search").addEventListener("click", (e) => {
  e.preventDefault();

  const arrivalStation = sourceInput.value.trim();
  const destinationStation = destInput.value.trim();

  if (!arrivalStation || !destinationStation) {
    alert("Please enter both stations!");
    return;
  }

  showSearchLoader();

  table.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  messageBox.classList.add("hidden");

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
      hideSearchLoader();

      try {
        const data = JSON.parse(text);
        presentData(data);
      } catch (e) {
        resultContainer.classList.remove("hidden");
        table.classList.add("hidden");
        messageBox.textContent = text;
        messageBox.classList.remove("hidden");
      }
    })
    .catch((error) => {
      hideSearchLoader();
      resultContainer.classList.remove("hidden");
      resultBody.innerHTML = "";
      table.classList.add("hidden");
      messageBox.textContent = "❌ Something went wrong.";
      messageBox.classList.remove("hidden");
      console.error("Error:", error);
    });
});

function presentData(data) {
  resultBody.innerHTML = "";

  if (!data || data.length === 0) {
    table.classList.add("hidden");
    messageBox.classList.remove("hidden");
    messageBox.innerHTML = `<div class="text-yellow-300 text-center font-semibold">🚫 No trains found.</div>`;
    return;
  }

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
