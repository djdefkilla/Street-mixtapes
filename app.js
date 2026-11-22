(() => {
  "use strict";
  const genreButtons = [...document.querySelectorAll(".genre")];
  const mixes = [...document.querySelectorAll(".mix")];

  genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const genre = button.dataset.genre || "all";
      genreButtons.forEach((item) => item.classList.toggle("active", item === button));
      mixes.forEach((mix) => {
        mix.hidden = genre !== "all" && mix.dataset.category !== genre;
      });
    });
  });

  const audio = document.getElementById("audio");
  const fileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("play");
  const track = document.getElementById("track");
  const status = document.getElementById("status");
  const equalizer = document.querySelector(".equalizer");
  if (!audio || !fileInput || !playButton || !track || !status || !equalizer) return;

  let currentUrl = "";
  const setPlaying = (playing) => {
    playButton.textContent = playing ? "Ⅱ" : "▶";
    playButton.setAttribute("aria-label", playing ? "Mettre en pause" : "Lire");
    equalizer.classList.toggle("playing", playing);
  };

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.type && !file.type.startsWith("audio/")) {
      status.textContent = "FORMAT NON AUDIO — CHOISIS UN AUTRE FICHIER";
      fileInput.value = "";
      return;
    }
    audio.pause();
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(file);
    audio.src = currentUrl;
    track.textContent = file.name.replace(/\.[^.]+$/, "");
    status.textContent = "FICHIER PRÊT — APPUIE SUR PLAY";
    setPlaying(false);
  });

  playButton.addEventListener("click", async () => {
    if (!audio.src) {
      status.textContent = "CHARGE UN FICHIER AUDIO D'ABORD";
      fileInput.click();
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
      } catch (_) {
        status.textContent = "LECTURE IMPOSSIBLE — ESSAIE UN AUTRE FICHIER";
      }
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    setPlaying(true);
    status.textContent = "NOW PLAYING";
  });
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => {
    setPlaying(false);
    status.textContent = "MIX TERMINÉ";
  });
  audio.addEventListener("error", () => {
    setPlaying(false);
    status.textContent = "FICHIER ILLISIBLE — ESSAIE UN AUTRE FORMAT";
  });
  window.addEventListener("pagehide", () => {
    audio.pause();
    if (currentUrl) URL.revokeObjectURL(currentUrl);
  });
})();