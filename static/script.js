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
    const speed = document.getElementById('speed').value;

    if (!text) {
        alert('Please enter some text.');
        return;
    }

    // Show progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.display = 'block';

    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language, speed }),
    });

    if (response.ok) {
        const audioBlob = await response.blob();
        const audioURL = URL.createObjectURL(audioBlob);

        // Hide progress bar
        progressBar.style.display = 'none';

        const audioSection = document.getElementById('audio-result');
        audioSection.innerHTML = `<audio controls src="${audioURL}" playbackRate="${speed}"></audio>`;
    } else {
        alert('Error in converting text to speech.');
        progressBar.style.display = 'none';
    }
}
