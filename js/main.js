// ======================== SELECTORS ======================= //
const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector(".btn-search");
const artistsList = document.querySelector(".artists-list");
const albumsList = document.querySelector(".albums-list");
const tracksList = document.querySelector(".tracks-list");
const btnTracks = document.querySelector(".btn-tracks");
const btnAlbums = document.querySelector(".btn-albums");
const btnArtist = document.querySelector(".btn-artist");
const btnsTab = document.querySelectorAll(".btn-tab");
const outputInfo = document.querySelector(".output-display");
const outputBanner = document.querySelector(".output-banner");
const paginationContainer = document.querySelector(".pagination-container");

// ======================== EVENTS ======================= //
// INIT
window.addEventListener("DOMContentLoaded", () => {
  getTopTracks();
  init();
});

// SEARCH MUSIC
searchForm.addEventListener("click", searchMusic);

// BTN TABS EVENTS
btnArtist.addEventListener("click", btnGetArtist);
btnAlbums.addEventListener("click", btnGetAlbums);
btnTracks.addEventListener("click", btnGetTopTracks);
outputInfo.addEventListener("click", changeOutputInfo);

// ======================== FUNCTIONS ======================= //
// INIT FUNCTION
async function getTopTracks() {
  let key = "a653d5dd777c6301a068bfc9deb51338";
  let baseURL = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${key}&format=json`;

  const request = await fetch(baseURL);
  const response = await request.json();
  const data = await response.tracks.track;
  displayTopTracks(data);
  return data;
}

// DISPLAY TRACKS
function displayTopTracks(tracks) {
  let tracksServices = document.querySelector(".tracks-services");
  let tracksElement = tracks.map((track) => {
    return `
    <article class="track">
      <img src="${track.image[0]["#text"]}" alt="">
      <i class="far fa-heart" id="btn-heart"></i>
      <a href="${track.url}" class="info-track">
          <h4 class="track__title">
            ${track.name}
          </h4>
          <h3 class="name-artist">${track.artist.name}</h3>
          <p class="desc-track"><b>${track.listeners}</b> listeners</p>
      </a>
    </article>
    `;
  });
  tracksElement = tracksElement.join("");
  tracksServices.innerHTML = tracksElement;

  // DISPLAY NONE OUTPUT BANNER
  outputBanner.style.display = "none";

  // TOOGLE BTN-HEART
  let btnsHeart = document.querySelectorAll("#btn-heart");
  toggleHeart(btnsHeart);

  paginate(tracks);
}

// SEARCH MUSIC
function searchMusic(e) {
  e.preventDefault();
  let searchField = document.querySelector("#name");
  searchField.value && getArtist(searchField.value);
  // RESET FORM
  // searchField.value = "";
  searchForm.reset();
}

// SEND API REQUEST AFTER SEARCH
async function getArtist(searchValue) {
  let key = "a653d5dd777c6301a068bfc9deb51338";
  let baseURL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchValue}&api_key=${key}&limit=10&format=json`;

  const request = await fetch(baseURL);
  const response = await request.json();
  const data = await response.results;
  displayArtists(data);
}

// DISPLAY ARTISTS
function displayArtists(artists) {
  console.log(artists);
  let artistElement = artists.artistmatches.artist;
  artistElement = artistElement.map((artist, index) => {
    return `
      <article class="artist">
        <img src="img/lastfm-cover${index + 1}.jpg" alt="Poster">
        <div class="artist-info">
          <a href="${artist.url}">
            <h5 class="name__title">
              ${artist.name}
            </h5>
          </a>
          <p class="listeners">
            ${artist.listeners} listeners
          </p>
          <i class="far fa-heart" id="btn-heart"></i> 
        </div>
      </article>`;
  });
  artistElement = artistElement.join("");
  artistsList.innerHTML = artistElement;

  // ADDING SEARCH VALUE TO SEARCH RESULT
  // let searchResult = document.querySelector(".search-result");
  // let totalResult = artists["opensearch:totalResults"];
  // searchResult.textContent = totalResult;

  let searchValue = document.querySelector(".search-value");
  let totalValue = artists["opensearch:Query"].searchTerms;
  searchValue.textContent = totalValue;

  // ADDING SEARCH VALUES AND BTN-TAB TO THE SCREEN
  let outputHeading = document.querySelector(".output-heading");
  outputHeading.classList.add("open-heading");

  let tabsBox = document.querySelector(".btn-tabs");
  tabsBox.classList.add("open-tabs");

  // CLOSE TRACK CONTAINER
  let outputServices = document.querySelector(".output-services");
  outputServices.classList.add("open-services");

  // OPEN ARTISTS LIST
  artistsList.classList.remove("open-artists-list");
  // CLOSE TRACKS LIST
  tracksList.classList.remove("open-tracks-list");
  // CLOSE ALBUMS LIST
  albumsList.classList.remove("open-albums-list");

  // DISPLAY BLOCK
  outputBanner.style.display = "block";

  // TOOGLE BTN-HEART
  let btnsHeart = document.querySelectorAll("#btn-heart");
  toggleHeart(btnsHeart);

  // SET BACK TO DEFAULT BTN-TABS
  btnTabReset();
}

// SEND API AFTER CLICK BTN-ARTIST
async function btnGetArtist() {
  let searchValue = document.querySelector(".search-value").textContent;
  console.log(searchValue);
  let key = "a653d5dd777c6301a068bfc9deb51338";
  let baseURL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchValue}&api_key=${key}&limit=10&format=json`;

  const request = await fetch(baseURL);
  const response = await request.json();
  const data = await response.results;
  displayGetArtist(data);
}

// DISPLAY ARTIST AFTER CLICK BTN-ARTIST
function displayGetArtist(artists) {
  let artistElement = artists.artistmatches.artist;
  artistElement = artistElement.map((artist, index) => {
    return `
      <article class="artist">
        <img src="img/lastfm-cover${index + 1}.jpg" alt="Poster">
        <div class="artist-info">
          <a href="${artist.url}">
            <p class="name__title">
              ${artist.name}
            </p>
          </a>
          <p class="listeners">
            ${artist.listeners} listeners
          </p>
          <i class="far fa-heart" id="btn-heart"></i> 
        </div>
      </article>`;
  });
  artistElement = artistElement.join("");
  artistsList.innerHTML = artistElement;

  // OPEN ARTISTS LIST
  artistsList.classList.remove("open-artists-list");
  // CLOSE TRACKS LIST
  tracksList.classList.remove("open-tracks-list");
  // CLOSE ALBUMS LIST
  albumsList.classList.remove("open-albums-list");

  // TOOGLE BTN-HEART
  let btnsHeart = document.querySelectorAll("#btn-heart");
  toggleHeart(btnsHeart);
}

// SEND API AFTER CLICK BTN-ALBUMS
async function btnGetAlbums() {
  let searchValue = document.querySelector(".search-value").textContent;
  let key = "a653d5dd777c6301a068bfc9deb51338";
  let baseURL = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${searchValue}&api_key=${key}&limit=10&format=json`;
  const request = await fetch(baseURL);
  const response = await request.json();
  const data = await response.topalbums;
  displayGetAlbums(data);
}

// DISPLAY ARTIST AFTER CLICK BTN-ALBUMS
function displayGetAlbums(albums) {
  let albumsElement = albums.album;
  albumsElement = albumsElement.map((album) => {
    return `
    <article class="album">
      <img src="${album.image[2]["#text"]}" alt="">
      <i class="far fa-heart" id="btn-heart"></i>
      <div class="info-album">
          <a href="${album.url}">
            <h4 class="name-album">${album.name}</h4>
          </a>
      </div>
    </article>`;
  });
  albumsElement = albumsElement.join("");
  albumsList.innerHTML = albumsElement;

  // CLOSE ARTISTS LIST
  artistsList.classList.add("open-artists-list");
  // CLOSE TRACKS LIST
  tracksList.classList.remove("open-tracks-list");
  // OPEN ALBUMS LIST
  albumsList.classList.add("open-albums-list");

  // TOOGLE BTN-HEART
  let btnsHeart = document.querySelectorAll("#btn-heart");
  toggleHeart(btnsHeart);
}

// SEND API AFTER CLICK BTN-TRACKS
async function btnGetTopTracks() {
  let searchValue = document.querySelector(".search-value").textContent;
  let key = "a653d5dd777c6301a068bfc9deb51338";
  let baseURL = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${searchValue}&api_key=${key}&limit=10&format=json`;

  const request = await fetch(baseURL);
  const response = await request.json();
  const data = await response.toptracks;
  displayGetTracks(data);
}

// DISPLAY ARTIST AFTER CLICK BTN-TRACKS
function displayGetTracks(tracks) {
  let tracksElement = tracks.track;
  tracksElement = tracksElement.map((track, index) => {
    return `
    <article class="artist-track">
      <p class="num">${index + 1}.</p>
      <img src="${track.image[0]["#text"]}" alt="">
      <i class="far fa-heart" id="btn-heart"></i>
      <div class="info-track">
          <a href="${track.url}">
            <h4 class="name-track">${track.name}</h4>
          </a>
          <p class="desc-track"><b>${track.listeners}</b> listeners</p>
      </div>
    </article>
    `;
  });
  tracksElement = tracksElement.join("");
  tracksList.innerHTML = tracksElement;

  // CLOSE ARTISTS LIST
  artistsList.classList.add("open-artists-list");
  // OPEN TRACKS LIST
  tracksList.classList.add("open-tracks-list");
  // CLOSE ALBUMS LIST
  albumsList.classList.remove("open-albums-list");

  // TOOGLE BTN-HEART
  let btnsHeart = document.querySelectorAll("#btn-heart");
  toggleHeart(btnsHeart);
}

// CHANGE THE ACTIVE CLASS BY CLICKING ON BTN-TAB
function changeOutputInfo(e) {
  let id = e.target.dataset.id;
  if (id) {
    btnsTab.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
  }
}

// SET BACK TO DEFAULT BTN-TABS
function btnTabReset() {
  btnArtist.classList.add("active");
  btnAlbums.classList.remove("active");
  btnTracks.classList.remove("active");
}

// TOGGLE HEART-LIKE BUTTON
function toggleHeart(btnsHeart) {
  btnsHeart.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("far")) {
        btn.classList.remove("far");
        btn.classList.add("fas");
      } else {
        btn.classList.add("far");
        btn.classList.remove("fas");
      }
    });
  });
}

// PAGINATE
let index = 0;
let pages = [];
function paginate(data) {
  // console.log(data);
  const itemPerPage = 10;
  const numberOfPages = Math.ceil(data.length / itemPerPage);
  // console.log(numberOfPages);
  const newTracks = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemPerPage;
    return data.slice(start, start + itemPerPage);
  });
  return newTracks;
}

function setupUI() {
  displayTopTracks(pages[index]);
  displayButtons(pages, index);
}

async function init() {
  const tracks = await getTopTracks();
  console.log(tracks);
  pages = paginate(tracks);
  setupUI();
}

// DISPLAY BUTTONS
function displayButtons(pages, activeIndex) {
  let btns = pages.map((_, pageIndex) => {
    return `
      <button class="btn-page ${
        activeIndex === pageIndex ? "active-page" : "null"
      }" data-index="${pageIndex}">
        ${pageIndex + 1}
      </button>`;
  });
  btns.push(`<button class="btn-next">&raquo;</button>`);
  btns.unshift(`<button class="btn-prev">&laquo;</button>`);
  btns = btns.join("");
  paginationContainer.innerHTML = btns;
}

// PAGINATION
paginationContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("pagination-container")) return;
  if (e.target.classList.contains("btn-page")) {
    index = parseInt(e.target.dataset.index);
  }
  if (e.target.classList.contains("btn-next")) {
    index++;
    if (index > pages.length - 1) {
      index = 0;
    }
  }

  if (e.target.classList.contains("btn-prev")) {
    index--;
    if (index < 0) {
      index = pages.length - 1;
    }
  }
  setupUI();
});

let counters = 0;
counters.forEach((counter) => {
  console.log(counter);
});
