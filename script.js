const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // 🔴 replace with your YouTube API key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w"; // your channel ID
const maxResults = 20;

/* ===============================
   Convert ISO duration → seconds
================================= */
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

/* ===============================
   Create Video Card UI
================================= */
function createCard(videoId, title, thumb) {
  const link = `https://www.youtube.com/watch?v=${videoId}`;

  return `
    <a href="${link}" target="_blank">
      <img src="${thumb}" alt="${title}">
      <p>${title}</p>
    </a>
  `;
}

/* ===============================
   Fetch Videos from YouTube API
================================= */
async function fetchVideos(containerId, filterFn) {
  try {
    const container = document.getElementById(containerId);
    container.innerHTML = "Loading...";

    // STEP 1: Get video list
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&order=date&maxResults=${maxResults}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.items) {
      container.innerHTML = "No videos found";
      return;
    }

    const videoIds = searchData.items
      .map(item => item.id.videoId)
      .join(",");

    // STEP 2: Get details (duration + snippet)
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails`;

    const videoRes = await fetch(videoUrl);
    const videoData = await videoRes.json();

    container.innerHTML = "";

    let html = "";

    videoData.items.forEach(item => {
      const videoId = item.id;
      const title = item.snippet.title;
      const thumb = item.snippet.thumbnails.medium.url;
      const duration = parseDuration(item.contentDetails.duration);

      // filter logic (videos / shorts / live)
      if (filterFn && !filterFn(duration, title)) return;

      html += createCard(videoId, title, thumb);
    });

    container.innerHTML = html || "<p>No content available</p>";

  } catch (err) {
    console.error("Error fetching videos:", err);
  }
}

/* ===============================
   Load Sections
================================= */

// 🎬 Long Videos (> 180s)
fetchVideos("videos", (duration) => duration > 180);

// ⚡ Shorts (<= 180s)
fetchVideos("shorts", (duration) => duration <= 180);

// 🔴 Live (title contains live)
fetchVideos("live", (duration, title) =>
  title.toLowerCase().includes("live")
);

/* ===============================
   Tabs Switching (UI only)
================================= */
const tabs = document.querySelectorAll(".tabs button");
const sections = document.querySelectorAll(".section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.getAttribute("data-target");

    sections.forEach(sec => {
      if (sec.id === target) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });
  });
});

/* ===============================
   Default view (show only videos)
================================= */
window.addEventListener("load", () => {
  document.getElementById("videos-section").style.display = "block";
  document.getElementById("shorts-section").style.display = "none";
  document.getElementById("live-section").style.display = "none";
  document.getElementById("posts-section").style.display = "none";
});

/* ===============================
   Posts placeholder
================================= */
document.getElementById("posts").innerHTML = `
  <p style="color:#00ff99;">
    Community posts are not available via YouTube API.
  </p>
`;
