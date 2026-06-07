const apiKey = "AIzaSyDfs-O2fgdYCB7RCq4v1U6g70Zii_O41d4";   // replace with your key
const channelId = "UC4h6XMpRUahzM4HtEcuLl4w"; // replace with your channel ID
const maxResults = 6;

fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}`)
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("videos");
    data.items.forEach(item => {
      const videoId = item.id.videoId;
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
  });
