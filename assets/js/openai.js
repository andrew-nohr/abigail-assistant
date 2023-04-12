const OPENAI_API_KEY = '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'; 

async function fetchGPT3Response(prompt) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-002', // You can use other GPT-3 models as well, e.g., 'text-curie-002' or 'text-babbage-002'
            prompt: prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.8,
        }),
    };

    const response = await fetch('/api/openai', requestOptions);
    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        return data.choices[0].text.trim();
    } else {
        return "I'm sorry, I couldn't understand your request. Please try again.";
    }
}
