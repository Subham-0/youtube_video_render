async function getVideoDetails() {
    const videoUrl = document.getElementById('videoUrl').value;

 // Show loading message
 const loadingMessage = document.getElementById('loadingMessage');
 loadingMessage.style.display = 'block';

 // Clear previous results
 document.getElementById('result').innerHTML = '';

    // Extract the video ID from the URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        document.getElementById('result').innerText = 'Invalid YouTube URL';
        loadingMessage.style.display = 'none';
        return;
    }

     // Use the current origin as the base URL
     const baseUrl = window.location.origin;
     loadingMessage.style.display = 'block';
    try{
        const response = await fetch(`${baseUrl}/video/details?videoId=${videoId}`);
        const data = await response.json();
    
    // Display video and audio data
    displayData(data);

    document.getElementById('result').style.display = 'block';
} catch (error) {
    console.error('Error fetching video details:', error);
    document.getElementById('result').innerText = 'Failed to load video details. Please try again later.';
}
finally {
    // Hide loading message
    loadingMessage.style.display = 'none';
}
}

// Function to display video and audio data
function displayData(data) {
    const { videos, audios } = data;

    let resultHtml = "<h2>Video and Audio Details</h2>";

    // Video Section
    if (videos && videos.items && videos.items.length > 0) {
        const firstVideo = videos.items[0]; 
        const downloadVideoLink = firstVideo.url;

        resultHtml += `
        <h3>Video:</h3>
        <p class="media-details">
            <span>${firstVideo.sizeText}</span>
            <a href="#" onclick="downloadFile('${downloadVideoLink}', 'video'); return false;">Download Video</a>
        </p>
    `;
    } else {
        resultHtml += "<p>No video data available.</p>";
    }

    // Audio Section
    if (audios && audios.items && audios.items.length > 0) {
        const firstAudio = audios.items[0]; 
        const downloadAudioLink = firstAudio.url; 

        resultHtml += `
        <h3>Audio:</h3>
        <p class="media-details">
            <span>${firstAudio.sizeText}</span>
            <a href="#" onclick="downloadFile('${downloadAudioLink}', 'audio'); return false;">Download Audio</a>
        </p>
    `;
    } else {
        resultHtml += "<p>No audio data available.</p>";
    }

    document.getElementById('result').innerHTML = resultHtml;
}

// Function to redirect to the download page
function redirectToDownloadPage(videoData) {
    const data = encodeURIComponent(JSON.stringify(videoData)); // Encode data for URL
    window.location.href = `download.html?data=${data}`; // Redirect to download page
}


// Function to extract video ID from YouTube URL
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null; // Return the video ID or null if not found
}

async function downloadFile(url, type) {
    try {
        const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error('Failed to download file');
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Set correct filename and extension
        a.href = downloadUrl;
        a.download = type === 'audio' ? 'audio.mp3' : 'video.mp4';  
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
}

