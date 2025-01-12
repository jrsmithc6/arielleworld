// script.js
document.addEventListener('DOMContentLoaded', function () {
    const videoList = document.getElementById('videoList');
    const videoPlayer = document.getElementById('videoPlayer');

    const bucketName = 'streamable-content';
    
    // Fetch the list of video objects from the S3 bucket
    fetch(`http://${bucketName}.s3.amazonaws.com/?list-type=2`)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const contents = xmlDoc.getElementsByTagName('Contents');
            for (let i = 0; i < contents.length; i++) {
                const key = contents[i].getElementsByTagName('Key')[0].textContent;
                const videoUrl = `http://${bucketName}.s3.amazonaws.com/${key}`;
                const videoName = key.split('/').pop(); // Extract video name from key
                const listItem = document.createElement('li');
                const videoLink = document.createElement('a');
                videoLink.href = '#';
                videoLink.textContent = videoName;
                videoLink.addEventListener('click', () => {
                    videoPlayer.src = videoUrl;
                    videoPlayer.load();
                    videoPlayer.play();
                });
                listItem.appendChild(videoLink);
                videoList.appendChild(listItem);
            }
        })
        .catch(error => {
            console.error('Error fetching video list:', error);
        });
});
