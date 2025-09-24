// import React from 'react'

const GenCard = async (pageContent : string): Promise<any[]> => {
    const respone = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
            // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-chat-v3.1:free",
            "messages": [
                {
                    "role": "user",
                    "content": pageContent,
                }
            ]
        })
    });

    const data = await respone.json();
    console.log(data);

    return []
}

export default GenCard