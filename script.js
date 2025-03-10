// Replace with your SoundCloud client ID
const CLIENT_ID = "2t9loNQH90kzJcsFCODdigxfp325aq4z";

// Function to resolve a SoundCloud URL (track or playlist)
async function resolveSoundCloudUrl(url) {
  const resolveEndpoint = `https://api.soundcloud.com/resolve?url=${encodeURIComponent(url)}&client_id=${CLIENT_ID}`;
  const response = await fetch(resolveEndpoint);
  if (!response.ok) {
    throw new Error("Could not resolve URL.");
  }
  return response.json();
}

// Function to handle the form submission
document.getElementById("playlistForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const playlistUrl = document.getElementById("playlistUrl").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const data = await resolveSoundCloudUrl(playlistUrl);
    
    // Check if the resolved object is a playlist
    if (data.kind !== "playlist" || !data.tracks) {
      resultsDiv.innerHTML = "<p>URL did not resolve to a valid playlist.</p>";
      return;
    }
    
    let html = `<h2>${data.title}</h2>`;
    html += "<ul>";
    
    data.tracks.forEach(track => {
      html += `<li class="track">
                 <span class="track-title">${track.title}</span><br>`;
      // If track is downloadable and has a download URL
      if (track.downloadable && track.download_url) {
        // Append the client ID to the download URL
        const downloadLink = `${track.download_url}?client_id=${CLIENT_ID}`;
        html += `<a class="download-link" href="${downloadLink}" target="_blank">Download</a>`;
      } else {
        html += `<span>Not available for download</span>`;
      }
      html += `</li>`;
    });
    html += "</ul>";
    
    resultsDiv.innerHTML = html;
  } catch (err) {
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
