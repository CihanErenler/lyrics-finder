const search = document.querySelector(".search");
const btn = document.querySelector(".search-btn");
const input = document.querySelector(".result");
const more = document.querySelector("#more");
const result = document.querySelector(".result");

const url = "https://api.lyrics.ovh";

btn.addEventListener("click", () => {
  const value = search.value.trim();
  if (!value) {
    showAlert();
  } else {
    searchSongs(value);
    search.value = "";
  }
});

document.body.addEventListener("keydown", (e) => {
  const value = search.value.trim();
  if (e.key === "Enter") {
    if (!value) {
      showAlert();
    } else {
      searchSongs(value);
      search.value = "";
    }
  }
});

result.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("show-lyrics")) {
    const artistName = target.getAttribute("data-artist");
    const songName = target.getAttribute("data-song");
    getLyrics(artistName, songName);
  }
});

// Search Songs
const searchSongs = async (value) => {
  result.innerHTML = "<h1>Loading...</h1>";
  more.innerHTML = "";
  const data = await fetch(`${url}/suggest/${value}`);
  const songs = await data.json();

  console.log(songs);
  displaySongs(songs);
};

// Display Songs
const displaySongs = (songs) => {
  result.innerHTML = `
        <h2>Results</h2>
        <ul>
            ${songs.data
              .map(
                (song) => `
                <li class="list-item">
                <div class="cover">
                <img src=${song.artist.picture_small}
                </div>
                <a class="artist" href="${song.artist.link}" target="_blank">${song.artist.name}</a> - 
                ${song.title} </div>
                <button class="btn show-lyrics" data-artist="${song.artist.name}" data-song="${song.title}">Lyrics</button>
                </li>
            `
              )
              .join("")}
        </ul>
    `;

  if (songs.next || songs.prev) {
    more.innerHTML = `
        ${
          songs.prev
            ? `<button class="btn prev" onclick="getMoreSongs('${songs.prev}')">Prev</button>`
            : ""
        }
        ${
          songs.next
            ? `<button class="btn next" onclick="getMoreSongs('${songs.next}')" >Next</button>`
            : ""
        }
        `;
  } else {
    more.innerHTML = "";
  }
};

// Get More songs
async function getMoreSongs(url) {
  const data = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const songs = await data.json();

  displaySongs(songs);
}

// Get lyrics
async function getLyrics(artistName, songName) {
  result.innerHTML = "<h1>Loading...</h1>";
  more.innerHTML = "";

  const data = await fetch(`${url}/v1/${artistName}/${songName}`);
  const jsonData = await data.json();

  const lyrics = jsonData.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `
  <h1>${artistName} - ${songName}</h1>
  <p>
  ${lyrics}
  </p>
  `;

  more.innerHTML = "";
}

// Show Alert
const showAlert = () => {
  const warning = document.createElement("div");
  warning.id = "warning";
  warning.className = "fadein";
  warning.appendChild(
    document.createTextNode("Please enter artist or song     name")
  );
  document.body.appendChild(warning);

  setTimeout(() => {
    warning.classList.add("fadeout");
    warning.classList.remove("fadein");
  }, 3000);

  setTimeout(() => {
    document.getElementById("warning").remove();
  }, 3600);
};
