import { Configuration, OpenAIApi } from "openai";
import { functions, runFunction } from "./functions";
import dotenv from "dotenv";
dotenv.config();

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

async function main() {
    try {
        const response = await runConversation(
            "what is the weather in pretoria, just give me the current weather?"
        );
        console.log(response);
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

// ========== Example Conversation ==========

async function runConversation(prompt: string) {
    console.log("Prompt: ", prompt);
    const messages = [
        {
            role: "system" as const,
            content:
                "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
        },
        { role: "user" as const, content: prompt },
    ];

    const initialResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613", // Fine tuned model for function calling
        messages,
        functions,
        function_call: "auto",
    });

    const initialResponseMessage = initialResponse.data.choices[0].message;
    console.log(initialResponseMessage);

    if (initialResponseMessage.function_call) {
        const { name, arguments: args } = initialResponseMessage.function_call;
        const functionResponse = await runFunction(name, JSON.parse(args));

        const finalResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                ...messages,
                initialResponseMessage,
                {
                    role: "function",
                    name: initialResponseMessage.function_call.name,
                    content: JSON.stringify(functionResponse),
                },
            ],
        });

        const finalResponseMessage = finalResponse.data.choices[0].message;
        return finalResponseMessage;
    } else {
        return initialResponseMessage;
    }
}

main();
