let menuDiv = document.getElementById("menu");
function handleMenu() {
  menuDiv.classList.toggle("hidden");

  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const navbar = document.getElementById("navbar");

  // Only toggle these if they exist
  if (menuDiv.classList.contains("hidden")) {
    main?.classList.remove("hidden");
    footer?.classList.remove("hidden");
    navbar?.classList.remove("hidden");
  } else {
    main?.classList.add("hidden");
    footer?.classList.add("hidden");
    navbar?.classList.add("hidden");
  }
}
