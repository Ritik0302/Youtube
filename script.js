const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // replace with your key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w"; // replace with your channel ID
const maxResults = 50;                // maximum allowed
let nextPageToken = "";

function fetchVideos(pageToken = "") {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("videos");
      if (!data.items) return;

      data.items.forEach(item => {
        const videoId = item.id.videoId;
        if (!videoId) return; // skip non-video results

        const thumbnail = item.snippet.thumbnails.medium.url;
        const title = item.snippet.title;
        const link = `https://www.youtube.com/watch?v=${videoId}`;

        container.innerHTML += `
          <a href="${link}" target="_blank">
            <img src="${thumbnail}" alt="${title}" />
            <p>${title}</p>
          </a>
        `;
      });

      // Agar aur videos hain toh next page fetch karo
      if (data.nextPageToken) {
        fetchVideos(data.nextPageToken);
      }
    })
    .catch(error => console.error("Error fetching videos:", error));
}

// Start fetching
fetchVideos();
