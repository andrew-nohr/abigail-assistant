import { fetchGPT3Response } from './openai.mjs';

 
 // Initialize the Web Speech API for voice recognition
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 const recognition = new SpeechRecognition();
 recognition.lang = 'en-US';
 recognition.interimResults = false;
 recognition.maxAlternatives = 1;

 // Get the HTML elements and add event listeners for the buttons
 const startButton = document.getElementById('start');
 const stopButton = document.getElementById('stop');
 const transcriptElement = document.getElementById('transcript');

 startButton.addEventListener('click', () => recognition.start());
 stopButton.addEventListener('click', () => recognition.stop());

 // Add event listeners for speech recognition events
 recognition.addEventListener('result', handleResult);
 recognition.addEventListener('end', () => console.log('Speech recognition has stopped'));

 // Handle the result of voice recognition
 /* Update the handleResult function in your abigail.js file */

async function handleResult(event) {
    const text = event.results[0][0].transcript;
    const transcriptElement = document.getElementById('transcript');
    transcriptElement.textContent = `You said: ${text}`;

    const response = await processCommand(text);
    speak(response);

    // Create a card element and add it to the cards-container
    createCard(text, response);
}


 // Process the user's voice command
 async function processCommand(text) {
    try {
        const response = await fetchGPT3Response(text);
        return response;
    } catch (error) {
        console.error('Error processing command:', error);
        return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
}
async function recordSpeech() {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.addEventListener('speechstart', () => {
        console.log('Speech has been detected.');
    });

    recognition.addEventListener('result', async (event) => {
        console.log('Result has been detected.');

        const transcript = event.results[0][0].transcript;

        try {
            const response = await processCommand(transcript);
            speak(response);
            addResponseToResults(transcript, response);
        } catch (error) {
            console.error('Error processing command:', error);
            speak("I'm sorry, I encountered an error while processing your request. Please try again.");
        }
    });

    recognition.addEventListener('speechend', () => {
        recognition.stop();
    });

    recognition.addEventListener('error', (event) => {
        console.error('Error:', event.error);
    });
}

const listenButton = document.getElementById('listenButton');
listenButton.addEventListener('click', () => {
    recordSpeech().catch(err => console.error('Error in recordSpeech:', err));
});


 // Connect to the OpenAI GPT API for real-time information searching
 async function fetchGPTResponse(prompt) {
     const apiKey = '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';
     const headers = {
         'Content-Type':
'application/json',
         'Authorization': `Bearer ${apiKey}`
     };
     const data = {
         'model': 'text-davinci-002',
         'prompt': prompt,
         'max_tokens': 100,
         'temperature': 0.8
     };

     try {
         const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', data, { headers });
         return response.data.choices[0].text;
     } catch (error) {
         console.error('Error fetching GPT response:', error);
         return 'Sorry Mr. Nohr, I am unable to do that at this time.';
     }
 }

 // Speak the AI's response using the Web Speech API
 function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Function to set the voice for the utterance
    function setVoice() {
        // Get the list of available voices
        const voices = speechSynthesis.getVoices();

        // Filter voices based on language and name properties
        const femaleVoices = voices.filter(voice => voice.lang.includes('en') && (voice.name.includes('Google UK English Female') || voice.name.includes('Microsoft Zira')));

        // Choose the first female voice, if available
        if (femaleVoices.length > 0) {
            utterance.voice = femaleVoices[0];
        } else {
            // Choose the first English voice if no suitable female voice is found
            const englishVoices = voices.filter(voice => voice.lang.includes('en'));
            if (englishVoices.length > 0) {
                utterance.voice = englishVoices[0];
            }
        }

        utterance.rate = 1.1; // Increase speech rate to 1.5x
        utterance.pitch = 1.175;
        speechSynthesis.speak(utterance);
    }

    if (speechSynthesis.getVoices().length === 0) {
        // If voices are not loaded yet, wait for the voiceschanged event
        speechSynthesis.addEventListener('voiceschanged', setVoice);
    } else {
        // If voices are already loaded, call setVoice directly
        setVoice();
    }
}


