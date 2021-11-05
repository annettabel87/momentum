import playList from "./playList.js";

let language = localStorage.getItem("language") || "en";
const greetingTranslation = {
  ru: {
    night: "Доброй ночи",
    morning: "Доброе утро",
    afternoon: "Добрый день",
    evening: "Добрый вечер",
  },
  en: {
    night: "Good night",
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  },
};

const settingsTranslation = {
  ru: {
    lang: "Язык рус/анг",
    time: "Время",
    date: "Дата",
    greet: "Приветствие",
    quote: "Цитата",
    weather: "Погода",
    audio: "Аудио",
    img: "Фон",
    todo: "Список дел",
  },
  en: {
    lang: "Language ru/en",
    time: "Time",
    date: "Date",
    greet: "Greeting",
    quote: "Quote",
    weather: "Weather",
    audio: "Audio",
    img: "Background",
    todo: "TODO",
  },
};

const humidityName = {
  ru: "влажность",
  en: "humidity",
};

const placeholderLang = {
  ru: "[Введите имя]",
  en: "[Enter name]",
};
const windSpeedName = {
  ru: "скорость ветра",
  en: "windSpeed",
};
const windSpeed = {
  ru: "м/с",
  en: "m/s",
};
const dateLang = {
  ru: "ru-Ru",
  en: "en-Us",
};

/* greeting */
const date = new Date();
const greeting = document.querySelector(".greeting");
const userName = document.querySelector(".name");

function getTimeOfDay() {
  const hours = date.getHours();

  if (hours > 6 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 18) {
    return "afternoon";
  } else if (hours >= 18 && hours <= 23) {
    return "evening";
  } else {
    return "night";
  }
}
const timeOfDay = getTimeOfDay();
function showGreeting(lang) {
  greeting.textContent = `${lang}`;
  userName.placeholder = placeholderLang[language];
}

function setLocalStorage() {
  localStorage.setItem("name", userName.value);
  localStorage.setItem("city", userCity.value);
  localStorage.setItem("language", language);
  localStorage.setItem("bgSource", checkImg);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    userName.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    userCity.value = localStorage.getItem("city");
  }
  if (localStorage.getItem("language")) {
    language = localStorage.getItem("language");
  }
}
window.addEventListener("load", getLocalStorage);

/* Clock */

const time = document.querySelector(".time");
const dateMomentum = document.querySelector(".date");

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  showDate(language);
  showGreeting(greetingTranslation[language][timeOfDay]);
  setTimeout(showTime, 1000);
}
showTime();

function showDate(lang) {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  const currentDate = date.toLocaleDateString(`${dateLang[lang]}`, options);
  dateMomentum.textContent = currentDate;
}

/* API Image */

async function getLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=8rN0OqslGbJNEIiB6c__y0qyWTkIAtFioZi-scPdCfo`;
  const res = await fetch(url);
  const data = await res.json();
  return data.urls.regular;
}

async function getFlicrToImage() {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=049ffa0bbe0703402c2cbe6fbac78c66&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.photos.photo[randomNum].url_l;
}

/* slider */

let randomNum;
const body = document.querySelector("body");

function getRandomNum() {
  const min = 0;
  const max = 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomNum = getRandomNum();

const checkSelect = document.querySelector("#background");

function setBg() {
  const checkImg = document.getElementById("background").options.selectedIndex;
  const bgNum = randomNum.toString().padStart(2, "0");
  const image = new Image();
  if (checkImg == 0) {
    image.src = `https://raw.githubusercontent.com/annettabel87/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  } else if (checkImg == 1) {
    getLinkToImage().then((url) => {
      image.src = url;
    });
  } else {
    getFlicrToImage().then((url) => {
      image.src = url;
    });
  }

  image.onload = () => {
    body.style.backgroundImage = `url(${image.src}) `;
  };
}

const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");

function getSlideNext() {
  randomNum++;
  if (randomNum > 20) {
    randomNum = 1;
  }
  setBg();
}

function getSlidePrev() {
  randomNum--;
  if (randomNum < 1) {
    randomNum = 20;
  }
  setBg();
}
slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

setBg();

checkSelect.addEventListener("change", (e) => {
  setBg();
});
/* weather*/

const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const userCity = document.querySelector(".city");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
let city;

async function getWeather(language) {
  try {
    if (userCity.value == "") {
      userCity.value = "Moscow";
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity.value}&lang=${language}&appid=931dfeb5fa99112cdf52eaf3fdba27b6&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${windSpeedName[language]}: ${Math.round(
      data.wind.speed
    )}${windSpeed[language]}`;
    humidity.textContent = `${humidityName[language]}: ${Math.round(
      data.main.humidity
    )}%`;
  } catch (e) {
    userCity.value = "Please, enter correct city";
    console.log(`Error!Enter correct city! ${e}`);
  }
}

getWeather(language);

userCity.addEventListener("change", getWeather);

/* quote */

const quoteText = document.querySelector(".quote");
const quoteAuthor = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");

async function getQuotes(lang) {
  const quotes = "data.json";
  const res = await fetch(quotes);
  const data = await res.json();
  let randomQuote = getRandomNum();
  quoteText.textContent = data[randomQuote][lang].text;
  quoteAuthor.textContent = data[randomQuote][lang].author;
}

getQuotes(language);

changeQuote.addEventListener("click", () => {
  getQuotes(language);
});
/* aidio-player*/
let isPlay = true;
let playNum = 0;

const audio = document.querySelector("audio");
const play = document.querySelector(".play");
const btnPlayPrev = document.querySelector(".play-prev");
const btnPlayNext = document.querySelector(".play-next");
const songTitle = document.querySelector(".song-title");

function playAudio() {
  if (isPlay) {
    audio.currentTime = 0;
    audio.play();
    isPlay = false;
    play.classList.add("pause");
    songTitle.textContent = playList[playNum].title;
    changeSongMarker();
  } else {
    audio.pause();
    isPlay = true;
    play.classList.remove("pause");
    songTitle.textContent = playList[playNum].title;
  }
}

audio.addEventListener("ended", playNext);

play.addEventListener("click", playAudio);

function playNext() {
  playNum++;
  if (playNum > 3) {
    playNum = 0;
  }
  audio.src = playList[playNum].src;

  isPlay = true;
  playAudio();
}
function playPrev() {
  playNum--;
  if (playNum < 0) {
    playNum = 3;
  }
  audio.src = playList[playNum].src;
  isPlay = true;
  playAudio();
}

btnPlayPrev.addEventListener("click", playPrev);
btnPlayNext.addEventListener("click", playNext);

const playlistContainer = document.querySelector(".play-list");

for (let i = 0; i < playList.length; i++) {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = `${playList[i].title}`;
  li.setAttribute("data-index", i);
  const playlistContainer = document.querySelector(".play-list");
  playlistContainer.append(li);
}
const songs = document.querySelectorAll(".play-item");

for (let i = 0; i < songs.length; i++) {
  songs[i].addEventListener("click", getClickedElement);
}

function getClickedElement(event) {
  for (let i = 0; i < songs.length; i++) {
    if (songs[i] == event.target) {
      audio.src = playList[i].src;
      playNum = i;
      playAudio();
    }
  }
}

function changeSongMarker() {
  for (let i = 0; i < songs.length; i++) {
    songs[i].classList.remove("item-active");
    if (i == playNum) {
      songs[i].classList.add("item-active");
    }
  }
}

const progressBar = document.querySelector(".timeline");
function changeProgressBar() {
  audio.currentTime = progressBar.value;
  progressBar.style.background = `linear-gradient( to right, #710707 0%, #710707 ${progressBar.value}%, #c4c4c4 ${progressBar.value}%, #c4c4c4 100% )`;
}

progressBar.addEventListener("input", changeProgressBar);

const currentTimeEl = document.querySelector(".current-time");
const durationTimeEl = document.querySelector(".duration-time");

function updateProgressValue() {
  progressBar.max = audio.duration;
  progressBar.value = audio.currentTime;
  currentTimeEl.textContent = `${formatTime(Math.floor(audio.currentTime))}`;

  if (durationTimeEl.textContent === "NaN:NaN") {
    durationTimeEl.textContent = "0:00";
  } else {
    durationTimeEl.textContent = `${formatTime(Math.floor(audio.duration))}`;
  }
}

setInterval(updateProgressValue, 500);

function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds - min * 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}

const volumeBtn = document.querySelector(".volume-btn");

function muteAudio() {
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeBtn.style.background = 'url("../assets/svg/mute.svg")';
  } else {
    volumeBtn.style.background = 'url("../assets/svg/volume.svg")';
  }
}

const volumeSlider = document.querySelector(".volume-slider");

function changeVolume(e) {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  document.querySelector(".volume-percentage").style.width =
    newVolume * 100 + "%";
}

volumeBtn.addEventListener("click", muteAudio);
volumeSlider.addEventListener("click", changeVolume);

/* Language */

const setLang = document.querySelector(".settings-lang");
const setTime = document.querySelector(".settings-time");
const setDate = document.querySelector(".settings-date");
const setGreet = document.querySelector(".settings-greet");
const setQuote = document.querySelector(".settings-quote");
const setWeather = document.querySelector(".settings-weather");
const setAudio = document.querySelector(".settings-audio");
const setImg = document.querySelector(".settings-img");
const setTodo = document.querySelector(".settings-todo");
const todoBtn = document.querySelector(".todo-btn");

function changeLangSettings(language) {
  setLang.textContent = settingsTranslation[language].lang;
  setTime.textContent = settingsTranslation[language].time;
  setDate.textContent = settingsTranslation[language].date;
  setGreet.textContent = settingsTranslation[language].greet;
  setQuote.textContent = settingsTranslation[language].quote;
  setWeather.textContent = settingsTranslation[language].weather;
  setAudio.textContent = settingsTranslation[language].audio;
  setImg.textContent = settingsTranslation[language].img;
  setTodo.textContent = settingsTranslation[language].todo;
  todoBtn.textContent = settingsTranslation[language].todo;
}

changeLangSettings(language);

function changeLanguageOnRu() {
  language = "ru";
  userName.placeholder = placeholderLang[language];
  getWeather(language);
  getQuotes(language);
  changeLangSettings(language);
}

function changeLanguageOnEn() {
  language = "en";
  userName.placeholder = placeholderLang[language];
  getWeather(language);
  getQuotes(language);
  changeLangSettings(language);
}

/* settings */

const settingsBtn = document.querySelector(".settings-btn");
const settingsPanel = document.querySelector(".settings-panel");

settingsBtn.addEventListener("click", viewSettings);

function viewSettings() {
  settingsPanel.classList.toggle("active");
}

const checkLang = document.querySelector("#checkbox-lang");
const checkTime = document.querySelector("#checkbox-time");
const checkDate = document.querySelector("#checkbox-date");
const checkGreet = document.querySelector("#checkbox-greet");
const greetingContainer = document.querySelector(".greeting-container");
const checkQuote = document.querySelector("#checkbox-quote");
const checkWeather = document.querySelector("#checkbox-weather");
const weatherContainer = document.querySelector(".weather");
const checAudio = document.querySelector("#checkbox-audio");
const playerContainer = document.querySelector(".player");
const todoContainer = document.querySelector(".container");
const checTodo = document.querySelector("#checkbox-todo");

checkLang.addEventListener("change", (e) => {
  if (e.target.checked) {
    changeLanguageOnEn();
  } else {
    changeLanguageOnRu();
  }
});

checkTime.addEventListener("change", (e) => {
  if (e.target.checked) {
    time.style.visibility = "visible";
  } else {
    time.style.visibility = "hidden";
  }
});

checkDate.addEventListener("change", (e) => {
  if (e.target.checked) {
    dateMomentum.style.visibility = "visible";
  } else {
    dateMomentum.style.visibility = "hidden";
  }
});
checkGreet.addEventListener("change", (e) => {
  if (e.target.checked) {
    greetingContainer.style.visibility = "visible";
  } else {
    greetingContainer.style.visibility = "hidden";
  }
});
checkQuote.addEventListener("change", (e) => {
  if (e.target.checked) {
    quoteText.style.visibility = "visible";
    quoteAuthor.style.visibility = "visible";
    changeQuote.style.visibility = "visible";
  } else {
    quoteText.style.visibility = "hidden";
    quoteAuthor.style.visibility = "hidden";
    changeQuote.style.visibility = "hidden";
  }
});
checkWeather.addEventListener("change", (e) => {
  if (e.target.checked) {
    weatherContainer.style.visibility = "visible";
    getWeather(language);
  } else {
    weatherContainer.style.visibility = "hidden";
  }
});
checAudio.addEventListener("change", (e) => {
  if (e.target.checked) {
    playerContainer.style.visibility = "visible";
  } else {
    playerContainer.style.visibility = "hidden";
  }
});

checTodo.addEventListener("change", (e) => {
  if (e.target.checked) {
    todoContainer.style.visibility = "visible";
    todoBtn.style.visibility = "visible";
  } else {
    todoContainer.style.visibility = "hidden";
    todoBtn.style.visibility = "hidden";
  }
});

/* TODO */
const addBtn = document.querySelector("#addBtn");
const removeBtn = document.querySelector("#removeBtn");
const todoInput = document.querySelector("#addInput");
const todoList = document.querySelector("#lists");
const todoListIcon = document.querySelector("#listIcon");

addBtn.addEventListener("click", addItem);
todoList.addEventListener("click", deleteItem);

function addItem() {
  let createList = document.createElement("li");
  let createTextList = document.createElement("p");
  createTextList.textContent = todoInput.value;
  todoList.appendChild(createList);
  createList.appendChild(createTextList);

  let icoDelete = document.createElement("div");
  icoDelete.classList.add("listIcon");
  let closeIcon = document.createElement("Button");

  closeIcon.classList.add("rBTN");
  closeIcon.innerText = "X";
  icoDelete.appendChild(closeIcon);
  createList.appendChild(icoDelete);

  data.value = "";
}

function deleteItem(e) {
  if (e.target.classList[0]) {
    e.target.parentElement.classList.add("falling");
    e.target.parentElement.addEventListener("transitionend", function () {
      //remove item
      this.remove();
    });
  }
}
removeBtn.addEventListener("click", () => {
  const rBox = document.querySelector("#listHolder");
  rBox.classList.toggle("rBox");
});

todoBtn.addEventListener("click", viewTodo);

function viewTodo() {
  todoContainer.classList.toggle("activeTodo");
}
