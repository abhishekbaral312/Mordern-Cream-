window.addEventListener("load", function () {
    const loader = document.getElementById("preloader");
    if (loader) {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 500); // optional fade-out
    }
  });
