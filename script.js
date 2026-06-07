const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // 🔴 replace with your YouTube API key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w";

// Uploads playlist (IMPORTANT FIX)
const uploadsPlaylist = "UU" + channelId.substring(2);

/* GET VIDEOS */
async function loadVideos() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=50&key=${apiKey}`
  );

  const data = await res.json();

  const videos = [];
  const shorts = [];
  const live = [];

  data.items.forEach(item => {
    const title = item.snippet.title;
    const thumb = item.snippet.thumbnails.medium.url;
    const id = item.snippet.resourceId.videoId;
    const url = `https://youtube.com/watch?v=${id}`;

    const lower = title.toLowerCase();

    const card = `
      <a class="card" href="${url}" target="_blank">
        <img src="${thumb}">
        <p>${title}</p>
      </a>
    `;

    if (lower.includes("short")) shorts.push(card);
    else if (lower.includes("live")) live.push(card);
    else videos.push(card);
  });

  document.getElementById("videos").innerHTML = `<div class="grid">${videos.join("")}</div>`;
  document.getElementById("shorts").innerHTML = `<div class="grid">${shorts.join("")}</div>`;
  document.getElementById("live").innerHTML = `<div class="grid">${live.join("")}</div>`;
}

/* TABS */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;

    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(tab).style.display = "block";
  };
});

/* INIT */
loadVideos();

/* POSTS */
document.getElementById("posts").innerHTML =
  "<p style='color:#00ff7b'>No posts available</p>";
