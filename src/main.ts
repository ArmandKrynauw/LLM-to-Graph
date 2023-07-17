import { Configuration, OpenAIApi } from "openai";
import { functions, runFunction } from "./functions";
import { graphV1 as graph, graphSchemaV1 as graphSchema } from "./graph";
import { toolbox } from "./toolbox";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";
dotenv.config();

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// See example prompts below - at the moment only prompts with a single action
// can be evaluated and executed successfully. An agent to breakdown a complex
// prompt into multiple subtasks have not been added yet.

// ✅ Insert a add node with some subtraction ones and a negate node
// ✅ I want to add two numbers
// ✅ Remove all the nodes
// ✅ Remove the first node and the subtraction node
// ✅ Remove the first node and the subtraction node
// ❌ Remove then first node and replace it with a negate node

async function main() {
    try {
        if (process.argv.length < 3) {
            console.log("> Specify prompt as a command line argument");
        }
        const response = await runGraphConversation(process.argv[2], true);
        console.log(response.content);
        writeFileSync("data.json", JSON.stringify(graph, null, 2));
        console.log("Check the updated graph exported to data.json");
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

async function runGraphConversation(prompt: string, verbose = false) {
    if (verbose)
        console.log("Prompt: ", prompt);

    const guidePrompt = readFileSync(join(__dirname, "../src/guidePrompt.txt"));

    const messages = [
        {
            role: "system" as const,
            content: guidePrompt.toString(),
        },
        {
            role: "system" as const,
            content: `You are provided with descriptions of valid nodes which can be added to the graph. You are only allowed to work with these specified nodes and nothing else. Here is the JSON formatted descriptions of the nodes: ${JSON.stringify(
                toolbox
            )}`,
        },
        {
            role: "system" as const,
            content: `Here is the JSON schema of the graph: ${JSON.stringify(graphSchema)}`
        },
        {
            role: "system" as const,
            content: `Here is the current graph in JSON format: ${JSON.stringify(graph)}`
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

    if (verbose)
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
