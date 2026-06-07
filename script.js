const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // replace with your key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w"; // replace with your channel ID
const maxResults = 20;

// Helper: convert ISO 8601 duration (PT3M20S) → seconds
function parseDuration(duration) {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match[1] ? parseInt(match[1]) : 0;
  const seconds = match[2] ? parseInt(match[2]) : 0;
  return minutes * 60 + seconds;
}

function fetchVideos(containerId, filterFn) {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&order=date&maxResults=${maxResults}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.items) return;
      const videoIds = data.items.map(item => item.id.videoId).join(",");

      // Fetch durations
      return fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,snippet`);
    })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);
      data.items.forEach(item => {
        const videoId = item.id;
        const title = item.snippet.title;
        const thumb = item.snippet.thumbnails.medium.url;
        const link = `https://www.youtube.com/watch?v=${videoId}`;
        const durationSec = parseDuration(item.contentDetails.duration);

        // Apply filter
        if (filterFn && !filterFn(durationSec, title)) return;

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

// Long videos (>180s)
fetchVideos("videos", (duration, title) => duration > 180);

// Shorts (<=180s)
fetchVideos("shorts", (duration, title) => duration <= 180);

// Live (title contains "live")
fetchVideos("live", (duration, title) => title.toLowerCase().includes("live"));

// Posts placeholder
document.getElementById("posts").innerHTML = `
  <p style="color:#00ff99;">Community posts are not available via API yet. Add manual links here.</p>
`;
