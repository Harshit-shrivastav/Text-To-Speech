async function convertTextToSpeech() {
    const text = document.getElementById('text-input').value;
    const language = document.getElementById('language').value;

    if (!text) {
        alert('Please enter some text.');
        return;
    }

    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
    });

    if (response.ok) {
        const audioBlob = await response.blob();
        const audioURL = URL.createObjectURL(audioBlob);

        const audioSection = document.getElementById('audio-result');
        audioSection.innerHTML = `<audio controls src="${audioURL}"></audio>`;
    } else {
        alert('Failed to convert text to speech.');
    }
}
