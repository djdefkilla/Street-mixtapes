const genreButtons = [...document.querySelectorAll('.genre')];
const mixCards = [...document.querySelectorAll('.mix')];

genreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    genreButtons.forEach((item) => item.classList.toggle('active', item === button));
    const genre = button.dataset.genre;
    mixCards.forEach((card) => {
      card.hidden = genre !== 'all' && card.dataset.category !== genre;
    });
    document.querySelector('#mixes').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const audio = document.querySelector('#audio');
const fileInput = document.querySelector('#audioFile');
const playButton = document.querySelector('#play');
const trackName = document.querySelector('#track');
const status = document.querySelector('#status');
const equalizer = document.querySelector('.equalizer');

function setPlaying(playing) {
  playButton.innerHTML = playing ? '<span>Ⅱ</span>' : '<span>▶</span>';
  equalizer.classList.toggle('playing', playing);
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;
  if (audio.src) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(file);
  trackName.textContent = file.name;
  status.textContent = 'LOCAL FILE LOADED — READY TO PLAY';
  setPlaying(false);
});

playButton.addEventListener('click', async () => {
  if (!audio.src) {
    status.textContent = 'CHARGE UN FICHIER AUDIO POUR COMMENCER';
    document.querySelector('.load-audio').focus();
    return;
  }
  if (audio.paused) {
    try {
      await audio.play();
      setPlaying(true);
      status.textContent = 'NOW PLAYING — FEEL THE VIBE';
      document.body.classList.add('sound-on');
    } catch (error) {
      status.textContent = 'LECTURE IMPOSSIBLE — ESSAIE UN AUTRE FICHIER';
    }
  } else {
    audio.pause();
    setPlaying(false);
    status.textContent = 'PAUSED — TAKE A BREATH';
    document.body.classList.remove('sound-on');
  }
});

audio.addEventListener('ended', () => {
  setPlaying(false);
  status.textContent = 'TAPE FINISHED — REWIND THE VIBE';
  document.body.classList.remove('sound-on');
});
audio.addEventListener('pause', () => {
  if (audio.ended) setPlaying(false);
});
