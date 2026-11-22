const genreButtons = [...document.querySelectorAll('.genre')];
const mixCards = [...document.querySelectorAll('.mix')];

genreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    genreButtons.forEach((item) => item.classList.toggle('active', item === button));
    mixCards.forEach((card) => {
      card.hidden = button.dataset.genre !== 'all' &&
        card.dataset.category !== button.dataset.genre;
    });
  });
});

const audio = document.querySelector('#audio');
const fileInput = document.querySelector('#audioFile');
const playButton = document.querySelector('#play');
const trackName = document.querySelector('#track');
const status = document.querySelector('#status');

fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;

  if (audio.src) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(file);
  trackName.textContent = file.name;
  status.textContent = 'LOCAL FILE LOADED';
  playButton.textContent = '▶';
});

playButton.addEventListener('click', async () => {
  if (!audio.src) {
    status.textContent = 'LOAD AN AUDIO FILE FIRST';
    return;
  }

  if (audio.paused) {
    try {
      await audio.play();
      playButton.textContent = 'Ⅱ';
      status.textContent = 'NOW PLAYING';
    } catch (error) {
      status.textContent = 'PLAYBACK UNAVAILABLE';
    }
  } else {
    audio.pause();
    playButton.textContent = '▶';
    status.textContent = 'PAUSED';
  }
});

audio.addEventListener('ended', () => {
  playButton.textContent = '▶';
  status.textContent = 'PLAYBACK FINISHED';
});
