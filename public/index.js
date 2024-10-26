async function getVideoDetails() {
    const videoUrl = document.getElementById('videoUrl').value;

    // Extract the video ID from the URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        document.getElementById('result').innerText = 'Invalid YouTube URL';
        return;
    }
    try{
   

    const response = await fetch(`http://localhost:3000/video/details?videoId=${videoId}`);
    
    
    const data = await response.json();
    
    
    // Display video and audio data
    displayData(data);
} catch (error) {
    console.error('Error fetching video details:', error);
    document.getElementById('result').innerText = 'Failed to load video details. Please try again later.';
}
}

// Function to display video and audio data
function displayData(data) {
    const { videos, audios } = data;

    let resultHtml = "<h2>Video and Audio Details</h2>";

    // Check if videos are available
    if (videos && videos.items && videos.items.length > 0) {
        const firstVideo = videos.items[0]; // Get the first video
        const downloadVideoLink = firstVideo.url;

        resultHtml += `<h3>First Video:</h3>`;
        resultHtml += `<p>${firstVideo.quality} - <a href="${downloadVideoLink}" target="_blank">Download Video</a></p>`;
        
        // Automatically download the first video
        //window.location.href = downloadVideoLink; // Start download immediately
    } else {
        resultHtml += "<p>No video data available.</p>";
    }

    // Check if audios are available
    if (audios && audios.items && audios.items.length > 0) {
        const firstAudio = audios.items[0]; // Get the first audio
        const downloadAudioLink = firstAudio.url; // Ensure this is correct based on your audio data structure

        resultHtml += `<h3>First Audio:</h3>`;
        resultHtml += `<p><a href="${downloadAudioLink}" target="_blank">Download Audio</a></p>`;
        
        // Automatically download the first audio
        // window.open(downloadAudioLink, '_blank'); // Start download in a new tab
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
