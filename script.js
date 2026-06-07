const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // replace with your key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w"; // replace with your channel ID
const maxResults = 20;

function fetchSection(type, containerId, filterFn = null) {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=${type}&order=date&maxResults=${maxResults}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);
      if (!data.items) return;

      data.items.forEach(item => {
        const videoId = item.id.videoId;
        if (!videoId) return;
        const thumb = item.snippet.thumbnails.medium.url;
        const title = item.snippet.title;
        const link = `https://www.youtube.com/watch?v=${videoId}`;

        if (filterFn && !filterFn(title)) return;

        container.innerHTML += `
          <a href="${link}" target="_blank">
            <img src="${thumb}" alt="${title}" />
            <p>${title}</p>
          </a>
        `;
      });
    })
    .catch(err => console.error("Error:", err));
}

// Fetch sections
fetchSection("video", "videos");
fetchSection("video", "shorts", title => title.toLowerCase().includes("short"));
fetchSection("video", "live", title => title.toLowerCase().includes("live"));

// Posts placeholder
document.getElementById("posts").innerHTML = `
  <p style="color:#00ff99;">Community posts are not available via API yet. You can manually link your posts here.</p>
`;

// Tab switching logic
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
