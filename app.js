(() => {
  "use strict";

  const genreButtons = [...document.querySelectorAll(".genre")];
  const mixes = [...document.querySelectorAll(".mix")];
  genreButtons.forEach((button) => button.addEventListener("click", () => {
    const genre = button.dataset.genre || "all";
    genreButtons.forEach((item) => item.classList.toggle("active", item === button));
    mixes.forEach((mix) => { mix.hidden = genre !== "all" && mix.dataset.category !== genre; });
  }));

  // Les morceaux publiés par le DJ seront ajoutés ici, jamais depuis le lecteur public.
  const playlist = [
    // { title: "Street Tapes Vol. 1", meta: "DJ DEFKILLA", src: "audio/Street_Tapes_Vol_01_DJ_Defkilla/01-Intro.mp3" }
  ];

  const audio = document.getElementById("audio");
  const play = document.getElementById("play");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const track = document.getElementById("track");
  const meta = document.getElementById("trackMeta");
  const status = document.getElementById("status");
  const count = document.getElementById("playlistCount");
  const progress = document.getElementById("progress");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const equalizer = document.getElementById("equalizer");
  const cassette = document.querySelector(".cassette-shell");
  if (!audio || !play) return;

  let index = 0;
  const formatTime = (value) => {
    if (!Number.isFinite(value)) return "00:00";
    return String(Math.floor(value / 60)).padStart(2, "0") + ":" +
      String(Math.floor(value % 60)).padStart(2, "0");
  };
  const setPlaying = (playing) => {
    play.textContent = playing ? "Ⅱ" : "▶";
    play.setAttribute("aria-label", playing ? "Mettre en pause" : "Lire");
    equalizer?.classList.toggle("playing", playing);
    cassette?.classList.toggle("spinning", playing);
  };
  const loadTrack = (nextIndex, autoplay) => {
    if (!playlist.length) return;
    index = (nextIndex + playlist.length) % playlist.length;
    const item = playlist[index];
    audio.src = item.src;
    track.textContent = item.title;
    meta.textContent = item.meta || "DJ DEFKILLA • STREET MIXTAPE";
    status.textContent = "MIXTAPE " + String(index + 1).padStart(2, "0") +
      " / " + String(playlist.length).padStart(2, "0");
    progress.value = 0;
    currentTime.textContent = "00:00";
    duration.textContent = "00:00";
    if (autoplay) audio.play().catch(() => {
      status.textContent = "APPUYER SUR PLAY POUR ÉCOUTER";
    });
  };

  count.textContent = playlist.length ? String(playlist.length).padStart(2, "0") + " MIXTAPE(S)" : "DJ SELECTS";
  if (playlist.length) {
    [play, prev, next, progress].forEach((element) => { element.disabled = false; });
    loadTrack(0, false);
  } else {
    status.textContent = "STREET MIXTAPE • ON AIR";
    track.textContent = "STREET MIXTAPE RADIO";
    meta.textContent = "DJ DEFKILLA • CURATED SOUND";
  }

  play.addEventListener("click", () => {
    if (!playlist.length) return;
    if (audio.paused) audio.play().catch(() => { status.textContent = "LECTURE IMPOSSIBLE"; });
    else audio.pause();
  });
  prev.addEventListener("click", () => loadTrack(index - 1, true));
  next.addEventListener("click", () => loadTrack(index + 1, true));
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => loadTrack(index + 1, true));
  audio.addEventListener("loadedmetadata", () => { duration.textContent = formatTime(audio.duration); });
  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = Math.round(audio.currentTime / audio.duration * 1000);
    }
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Number(progress.value) / 1000 * audio.duration;
    }
  });
})();