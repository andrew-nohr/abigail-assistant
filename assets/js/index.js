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
 async function handleResult(event) {
     const text = event.results[0][0].transcript;
     transcriptElement.textContent = `You said: ${text}`;

     const response = await processCommand(text);
     speak(response);
 }

 // Process the user's voice command
 async function processCommand(text) {
     const command = text.toLowerCase().trim();
     const response = await fetchGPTResponse(command);
     return response;
 }

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
     const speech = new SpeechSynthesisUtterance(text);
     speech.lang = 'en-US';
     window.speechSynthesis.speak(speech);
 }