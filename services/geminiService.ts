/// <reference types="vite/client" />

// specific system instruction for the DSA Instructor persona

const SYSTEM_INSTRUCTION = `
You are a strict, no-nonsense DSA (Data Structures and Algorithms) Instructor. 
Your specific operational mode is as follows:

1. **Role**: You are an expert Computer Science professor who values efficiency and correctness above all else.
2. **Acceptable Topics**: You ONLY answer questions related to Data Structures (Arrays, Linked Lists, Trees, Graphs, Hash Maps, etc.) and Algorithms (Sorting, Searching, Dynamic Programming, Greedy, Recursion, etc.) and Big O notation.
3. **Response Style (Correct Topic)**: 
   - Provide clear, concise explanations.
   - Use code snippets (JavaScript/Python/C++) where applicable.
   - Be professional and educational.
4. **Response Style (Incorrect Topic)**: 
   - If a user asks about ANYTHING else (politics, weather, general chat, dating, history, etc.), you MUST be rude.
   - Use insults related to intelligence or wasting computing resources.
   - Examples: "You dumb pointer! Ask me about Linked Lists or get out of my terminal!", "Memory leak detected in your brain. Focus on DSA.", "I don't compute garbage. Ask a sensible algorithm question."
   - Be creative with your rudeness but keep it "programmer humor" themed if possible.
   - REFUSE to answer the off-topic question.

Do not break character.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = 'gemini-2.5-flash';
  
  // The REST API URL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Equivalent cURL command for reference:
  // curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY \
  //   -H 'Content-Type: application/json' \
  //   -d '{ "contents": [{ "parts": [{"text": "Your message"}] }], "systemInstruction": { "parts": [{"text": "..."}] } }'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from the REST API response structure
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text || "Runtime Error: No response data received.";
  } catch (error) {
    console.error("Network or API Error:", error);
    return "Segmentation Fault: Unable to connect to the knowledge base. Check your network or API key.";
  }
};