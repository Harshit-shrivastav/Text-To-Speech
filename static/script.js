document.getElementById('theme-toggle').addEventListener('change', () => {
    if (document.body.dataset.theme === 'dark') {
        document.body.dataset.theme = '';
    } else {
        document.body.dataset.theme = 'dark';
    }
});

async function convertTextToSpeech() {
    const text = document.getElementById('text-input').value;
    const language = document.getElementById('language').value;
    let speed = document.getElementById('speed').value;

    if (!text) {
        alert('Please enter some text.');
        return;
    }

    // Convert speed to percentage format for edge-tts (e.g., "-50%")
    speed = `${speed}%`;

    const progressBar = document.querySelector('.progress-bar');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    
    progressBar.style.display = 'block';
    progressBarFill.style.width = '0%';

    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                language,
                speed  // Send the formatted speed value
            })
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        document.getElementById('audio-result').innerHTML = `
            <audio controls>
                <source src="${audioUrl}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        progressBarFill.style.width = '100%';

        // Hide the progress bar when the generation completes
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 500);
    } catch (error) {
        alert('Error generating audio.');
        progressBar.style.display = 'none';
    }
}
