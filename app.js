(() => {
  "use strict";
  const buttons = document.querySelectorAll(".genre");
  const cards = document.querySelectorAll(".mix");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const genre = button.dataset.genre || "all";
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      cards.forEach((card) => {
        card.hidden = genre !== "all" && card.dataset.category !== genre;
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
  function updatePlayState(playing) {
    playButton.textContent = playing ? "Ⅱ" : "▶";
    equalizer.classList.toggle("playing", playing);
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      status.textContent = "CHOISIS UN FICHIER AUDIO";
      return;
    }
    audio.pause();
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(file);
    audio.src = currentUrl;
    track.textContent = file.name;
    status.textContent = "FICHIER PRÊT — APPUIE SUR PLAY";
    updatePlayState(false);
  });

  playButton.addEventListener("click", async () => {
    if (!audio.src) {
      status.textContent = "CHARGE UN FICHIER AUDIO D'ABORD";
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
    updatePlayState(true);
    status.textContent = "NOW PLAYING";
  });
  audio.addEventListener("pause", () => updatePlayState(false));
  audio.addEventListener("ended", () => {
    updatePlayState(false);
    status.textContent = "MIX TERMINÉ";
  });
  window.addEventListener("pagehide", () => {
    audio.pause();
    if (currentUrl) URL.revokeObjectURL(currentUrl);
  });
})();