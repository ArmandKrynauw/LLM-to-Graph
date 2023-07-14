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
        // const response = await runConversation("What is weather today");
        // const response = await runGraphConversation("Add couple of addition nodes and 1 subtraction one");
        const response = await runGraphConversation("Add an two edges connect the add not to the subtraction node");
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

const toolbox = [
    {
        signature: "math.sum",
        description: "Calculates the sum of two floating point values",
    },
    {
        signature: "math.difference",
        description:
            "Calculates the difference between two floating point values",
    },
    {
        signature: "math.multiply",
        description: "Multiplies two floating point values together",
    },
    {
        signature: "math.divide",
        description:
            "Divides one floating point number by another floating point number",
    },
];

const graphSchema = {
	name: "graph",
	description: "Representation of a graph of nodes. Each node represents a function with, inputs and outputs. Outputs can only be connected to inputs. Outputs cannot be connect to outputs. Inputs cannot be connected to inputs.",
	properties: {
		type: "array",
		items: {
			type: "object",
			properties: {
				id: {
					type: "string",
					description: "Id of specific node"
				},
				signature: {
					type: "string",
					description: "Signature of specific node"
				},
				inputs: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "Id of specific input of a node"
							},
							type: {
								type: "string",
								description: "The type of the input"
							},
						}
					}
				},
				outputs: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "Id of specific output of a node"
							},
							type: {
								type: "string",
								description: "The type of the output"
							},
						}
					}
				},
				edges: {
					type: "array",
					items: {
						type: "object",
						properties: {
                            id: {
								type: "string",
								description: "Id of edge"
                            },
							from: {
								type: "string",
								description: "Id of the output to which this edge is connected"
							},
							to: {
								type: "string",
								description: "Id of the input to which this edge is connected"
							},
						}
					}
				}
			}
		}
    }
};

const graph = [
    {
        id: "0",
        signature: "math.sum",
        inputs: [
            {
                id: "0.0",
                type: "number"
            },
            {
                id: "0.1",
                type: "number",
            }
        ],
        outputs: [
            {
                id: "0.2",
                type: "number"
            },
        ],
        edges : [
            // {
            //     id: "0.0.0",
            //     from: "0.3",
            //     to: "1.0",
            // },
            // {
            //     id: "0.0.1",
            //     from: "0.3",
            //     to: "1.1",
            // }
        ]
    },
    {
        id: "1",
        signature: "math.difference",
        inputs: [
            {
                id: "1.0",
                type: "number"
            },
            {
                id: "1.1",
                type: "number",
            }
        ],
        outputs: [
            {
                id: "1.2",
                type: "number"
            },
        ],
        edges : [
            // {
            //     id: "0.0.0",
            //     from: "0.3",
            //     to: "1.0",
            // },
            // {
            //     id: "0.0.1",
            //     from: "0.3",
            //     to: "1.1",
            // }
        ]
    },
];

async function runGraphConversation(prompt: string) {
    console.log("Prompt: ", prompt);
    const messages = [
        {
            role: "system" as const,
            content: `When I ask you for help or to perform a task you will act as an AI assistance for node-based AI photo editing application. Your main role is to help the user manipulate a node based graph. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.`,
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
    console.log(initialResponseMessage);

    // if (initialResponseMessage.function_call) {
    //     const { name, arguments: args } = initialResponseMessage.function_call;
    //     const functionResponse = await runFunction(name, JSON.parse(args));

    //     const finalResponse = await openai.createChatCompletion({
    //         model: "gpt-3.5-turbo-16k",
    //         messages: [
    //             ...messages,
    //             initialResponseMessage,
    //             {
    //                 role: "function",
    //                 name: initialResponseMessage.function_call.name,
    //                 content: JSON.stringify(functionResponse),
    //             },
    //         ],
    //     });

    //     const finalResponseMessage = finalResponse.data.choices[0].message;
    //     return finalResponseMessage;
    // } else {
    //     return initialResponseMessage;
    // }
}

main();
