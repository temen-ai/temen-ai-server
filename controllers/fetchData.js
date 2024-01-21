import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "";

const fetchData = async (prompt) => {
    try {
        const response = await axios.post(API_URL, {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: prompt
            }],
            max_tokens: 5
        }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
        
    } catch (e) {
        console.log('Error fetching data:', e);
    }
};

export default fetchData;