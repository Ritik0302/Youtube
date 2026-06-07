const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // 🔴 replace with your YouTube API key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w";

// uploads playlist (FULL VIDEOS FIX)
const playlistId = "UU" + channelId.substring(2);

async function fetchVideos(pageToken = "") {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}&pageToken=${pageToken}`;

  const res = await fetch(url);
  return await res.json();
}

async function loadAllVideos() {
  let nextPage = "";
  let allItems = [];

  // 🔥 PAGINATION FIX (loads ALL videos)
  for (let i = 0; i < 5; i++) {
    const data = await fetchVideos(nextPage);
    if (!data.items) break;

    allItems = allItems.concat(data.items);
    nextPage = data.nextPageToken;

    if (!nextPage) break;
  }

  const videos = [];
  const shorts = [];
  const live = [];

  allItems.forEach(item => {
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

    if (lower.includes("shorts") || lower.includes("#shorts")) shorts.push(card);
    else if (lower.includes("live")) live.push(card);
    else videos.push(card);
  });

  document.getElementById("videos").innerHTML = videos.join("");
  document.getElementById("shorts").innerHTML = shorts.join("");
  document.getElementById("live").innerHTML = live.join("");
}

/* TABS */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;

    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(tab).style.display = "grid";
  };
});

/* INIT */
loadAllVideos();

/* POSTS */
document.getElementById("posts").innerHTML =
  "<p style='color:#00ff88'>No posts available</p>";
