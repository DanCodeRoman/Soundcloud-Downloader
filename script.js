// Replace with your valid SoundCloud client ID from your SoundCloud Developer account
const CLIENT_ID = "JGeUlG7kXbAKAKq3ykUdXoVIxnDgEuJz";

// Function to resolve a SoundCloud URL (playlist or track) using the SoundCloud API v2 endpoint
async function resolveSoundCloudUrl(url) {
  // Use the SoundCloud API v2 endpoint for resolving URLs
  const resolveEndpoint = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(url)}&client_id=${CLIENT_ID}`;
  
  // Make the API request
  const response = await fetch(resolveEndpoint);
  
  // If the response is not OK, log detailed error info and throw an error
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Status:", response.status);
    console.error("Error details:", errorText);
    throw new Error("Could not resolve URL.");
  }
  
  // Return the JSON-parsed response data
  return response.json();
}

// Listen for the form submission to resolve the playlist URL
document.getElementById("playlistForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission action
  
  const playlistUrl = document.getElementById("playlistUrl").value;
  const resultsDiv = document.getElementById("results");
  
  // Show a loading message while processing
  resultsDiv.innerHTML = "<p>Loading...</p>";
  
  try {
    // Resolve the provided SoundCloud URL
    const data = await resolveSoundCloudUrl(playlistUrl);
    
    // Check if the response is a playlist with tracks
    if (data.kind !== "playlist" || !data.tracks) {
      resultsDiv.innerHTML = "<p>URL did not resolve to a valid playlist.</p>";
      return;
    }
    
    // Build the HTML content with playlist title and track list
    let html = `<h2>${data.title}</h2>`;
    html += "<ul>";
    
    data.tracks.forEach(track => {
      html += `<li class="track">
                 <span class="track-title">${track.title}</span><br>`;
      
      // Check if the track is downloadable and a download URL is provided
      if (track.downloadable && track.download_url) {
        const downloadLink = `${track.download_url}?client_id=${CLIENT_ID}`;
        html += `<a class="download-link" href="${downloadLink}" target="_blank">Download</a>`;
      } else {
        html += `<span>Not available for download</span>`;
      }
      
      html += `</li>`;
    });
    html += "</ul>";
    
    // Display the track list in the results area
    resultsDiv.innerHTML = html;
    
  } catch (err) {
    // Display any errors that occurred during the process
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
