(() => {
  "use strict";
  const genreButtons = [...document.querySelectorAll(".genre")];
  const mixes = [...document.querySelectorAll(".mix")];
  genreButtons.forEach((button) => button.addEventListener("click", () => {
    const genre = button.dataset.genre || "all";
    genreButtons.forEach((item) => item.classList.toggle("active", item === button));
    mixes.forEach((mix) => { mix.hidden = genre !== "all" && mix.dataset.category !== genre; });
  }));

  // Seules les pistes publiées par l'administrateur du site sont listées ici.
  // Les visiteurs ne disposent d'aucun champ d'ajout ou d'envoi de fichiers.
  const playlist = [\n    // Exemple à compléter avec les fichiers MP3 publiés dans le dossier audio :\n    // { title: "Street Mix Vol. 1", meta: "Hip-Hop • DJ DEFKILLA", src: "audio/street-mix-vol-1.mp3" }\n  ];
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
  const time = (value) => {
    if (!Number.isFinite(value)) return "00:00";
    const m = Math.floor(value / 60);
    const s = Math.floor(value % 60);
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  };
  const setActive = (playing) => {
    play.textContent = playing ? "Ⅱ" : "▶";
    play.setAttribute("aria-label", playing ? "Mettre en pause" : "Lire");
    equalizer?.classList.toggle("playing", playing);
    cassette?.classList.toggle("spinning", playing);
  };
  const loadTrack = (n, autoplay) => {
    if (!playlist.length) return;
    index = (n + playlist.length) % playlist.length;
    const item = playlist[index];
    audio.src = item.src;
    track.textContent = item.title;
    meta.textContent = item.meta || "DJ DEFKILLA • STREET MIXTAPE";
    status.textContent = "MIXTAPE "+String(index+1).padStart(2,"0")+" / "+String(playlist.length).padStart(2,"0");
    progress.value = 0;
    if (autoplay) audio.play().catch(() => { status.textContent = "APPUYER SUR PLAY POUR ÉCOUTER"; });
  };
  count.textContent = "DJ SELECTS";
  if (playlist.length) {
    [play,prev,next,progress].forEach((el) => { el.disabled = false; });
    loadTrack(0,false);
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
  prev.addEventListener("click", () => loadTrack(index-1,true));
  next.addEventListener("click", () => loadTrack(index+1,true));
  audio.addEventListener("play", () => setActive(true));
  audio.addEventListener("pause", () => setActive(false));
  audio.addEventListener("ended", () => loadTrack(index+1,true));
  audio.addEventListener("loadedmetadata", () => { duration.textContent=time(audio.duration); });
  audio.addEventListener("timeupdate", () => {
    currentTime.textContent=time(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration>0) progress.value=Math.round(audio.currentTime/audio.duration*1000);
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime=(Number(progress.value)/1000)*audio.duration;
  });
})();