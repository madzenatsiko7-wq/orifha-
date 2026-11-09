const questions = [
  { title: 'Ready to celebrate<br><em>your next beautiful chapter?</em>', copy: 'Your birthday was October 7, but you deserve to be celebrated well beyond one day.' },
  { title: 'Will you make<br><em>a birthday wish?</em>', copy: 'May this year bring you peace, laughter, and the kindness you deserve.' },
  { title: 'Here’s to you<br><em>and all the good ahead.</em>', copy: 'I hope you always remember how special you are—and that you deserve to be treated like gold.' }
];

const slides = [
  { src: 'WhatsApp Image 2026-11-09 at 18.21.42 (1).jpeg', alt: 'A birthday photo of Orifha', caption: 'A new chapter, and so many good things ahead.' },
  { src: 'WhatsApp Image 2026-11-09 at 18.21.43.jpeg', alt: 'Another favorite birthday photo', caption: 'Keep making the world brighter in your own way.' },
  { src: 'WhatsApp Image 2026-11-09 at 18.21.44.jpeg', alt: 'A special photo from her birthday collection', caption: 'Wishing you joy in all the little moments, too.' },
  { src: 'WhatsApp Image 2026-11-09 at 18.21.45.jpeg', alt: 'A birthday photo to remember', caption: 'May this year be filled with love, laughter, and everything you dream of.' },
  { src: 'WhatsApp Image 2026-11-09 at 18.21.46.jpeg', alt: 'A birthday photo to cherish', caption: 'Here’s to a year of growth, happiness, and unforgettable memories.' },
  { src: 'WhatsApp Image 2026-11-09 at 18.21.45 (1).jpeg', alt: 'A birthday photo to treasure', caption: 'Wishing you a year of love, laughter, and all the things that bring you joy.' }

];

const birthdayAudio = document.querySelector('#birthdayAudio');
const musicToggle = document.querySelector('#musicToggle');
const welcomeScreen = document.querySelector('#welcomeScreen');
const questionScreen = document.querySelector('#questionScreen');
const slideshowScreen = document.querySelector('#slideshowScreen');
const questionTitle = document.querySelector('#questionTitle');
const questionCopy = document.querySelector('#questionCopy');
const questionCount = document.querySelector('#questionCount');

const progressBar = document.querySelector('#progressBar');
const answerHint = document.querySelector('#answerHint');
const yesButton = document.querySelector('#yesButton');
const noButton = document.querySelector('#noButton');
let questionIndex = 0;
let slideIndex = 0;
let autoplayTimer;
let isPlaying = true;

function showScreen(screenToShow) {
  [welcomeScreen, questionScreen, slideshowScreen].forEach((screen) => {
    const isCurrent = screen === screenToShow;
    screen.hidden = !isCurrent;
    screen.classList.toggle('is-active', isCurrent);
  });
}

function setMusicState(isPlaying) {
  musicToggle.classList.toggle('is-playing', isPlaying);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.querySelector('.music-text').textContent = isPlaying ? 'favorite song on' : 'favorite song';
}

function playFavoriteSong() {
  if (!birthdayAudio) return;
  birthdayAudio.volume = 0.7;
  birthdayAudio.play().then(() => {
    setMusicState(true);
  }).catch(() => {
    setMusicState(false);
  });
}

function toggleFavoriteSong() {
  if (!birthdayAudio) return;

  if (birthdayAudio.paused) {
    playFavoriteSong();
  } else {
    birthdayAudio.pause();
    setMusicState(false);

  }
}

document.querySelector('#envelopeButton').addEventListener('click', () => {
  document.querySelector('.envelope-flap').style.transform = 'rotateX(180deg)';
  document.querySelector('.envelope-paper').style.transform = 'translateY(-45px)';
  playFavoriteSong();
  setTimeout(() => showScreen(questionScreen), 600);
});

musicToggle.addEventListener('click', toggleFavoriteSong);

function renderQuestion() {
  const question = questions[questionIndex];
  questionTitle.innerHTML = question.title;
  questionCopy.textContent = question.copy;
  questionCount.textContent = `0${questionIndex + 1} / 03`;
  progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  answerHint.textContent = '';
}

noButton.addEventListener('click', () => {
  showScreen(slideshowScreen);
  renderSlide();
  startAutoplay();
});

yesButton.addEventListener('click', () => {
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  showScreen(slideshowScreen);
  renderSlide();
  startAutoplay();
});

function renderSlide() {
  const slide = slides[slideIndex];
  const image = document.querySelector('#slideImage');
  image.src = slide.src;
  image.alt = slide.alt;
  image.style.animation = 'none';
  void image.offsetWidth;
  image.style.animation = 'photo-in .7s ease both';
  document.querySelector('#slideCaption').textContent = slide.caption;
  document.querySelector('#slideNumber').textContent = `0${slideIndex + 1}`;
  document.querySelector('#dots').innerHTML = slides.map((_, index) => `<button class="dot ${index === slideIndex ? 'is-current' : ''}" type="button" aria-label="Show photo ${index + 1}"></button>`).join('');
  document.querySelectorAll('.dot').forEach((dot, index) => dot.addEventListener('click', () => { slideIndex = index; renderSlide(); restartAutoplay(); }));
}

function nextSlide() { slideIndex = (slideIndex + 1) % slides.length; renderSlide(); }
function previousSlide() { slideIndex = (slideIndex - 1 + slides.length) % slides.length; renderSlide(); }
function startAutoplay() { clearInterval(autoplayTimer); isPlaying = true; updatePlayButton(); autoplayTimer = setInterval(nextSlide, 4800); }
function stopAutoplay() { clearInterval(autoplayTimer); isPlaying = false; updatePlayButton(); }
function restartAutoplay() { if (isPlaying) startAutoplay(); }
function updatePlayButton() { document.querySelector('#playIcon').textContent = isPlaying ? 'Ⅱ' : '▶'; document.querySelector('#playText').textContent = isPlaying ? 'pause' : 'play'; }

document.querySelector('#nextButton').addEventListener('click', () => { nextSlide(); restartAutoplay(); });
document.querySelector('#previousButton').addEventListener('click', () => { previousSlide(); restartAutoplay(); });
document.querySelector('#playButton').addEventListener('click', () => isPlaying ? stopAutoplay() : startAutoplay());
document.querySelector('#replayButton').addEventListener('click', () => { clearInterval(autoplayTimer); isPlaying = true; questionIndex = 0; renderQuestion(); updatePlayButton(); showScreen(welcomeScreen); playFavoriteSong(); });

renderQuestion();
setMusicState(false);
function handleKeydown(event) {
  if (event.key === 'ArrowRight') {
    nextSlide();
    restartAutoplay();
  } else if (event.key === 'ArrowLeft') {
    previousSlide();
    restartAutoplay();
  } else if (event.key === ' ') {
    event.preventDefault();
    isPlaying ? stopAutoplay() : startAutoplay();

  }

}

document.addEventListener('keydown', handleKeydown);