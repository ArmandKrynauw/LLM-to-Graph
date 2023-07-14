type FunctionNames = "getCurrentWeather" | "addNodes" | "removeNodes" | "addEdges" | "removeEdges";

type FunctionDescription = {
    name: FunctionNames;
    description: string;
    parameters: object;
};

// ========== Function Descriptions ==========

export const functions = [
    // {
    //     name: "getCurrentWeather",
    //     description: "Get the current weather in a given location",
    //     parameters: {
    //         type: "object",
    //         properties: {
    //             location: {
    //                 type: "string",
    //                 description: "The city as a single word with no spaces e.g. HongKong, SanFrancisco",
    //             },
    //             unit: { type: "string", enum: ["celsius", "fahrenheit"] },
    //         },
    //         required: ["location"],
    //     },
    // },
    {
        name: "addNodes",
        description: "Add a new nodes to the provided graph",
        parameters: {
            type: "object",
            properties: {
                nodes: {
                    type: "array",
                    items: {
                        "type": "string"
                    },
                    description: "An array of node signatures which has to be added for every node. e.g math.sum, math.divide",
                },
            },
            required: ["nodes"],
        },
    },
    {
        name: "removeNodes",
        description: "Remove nodes from the provided graphs",
        parameters: {
            type: "object",
            properties: {
                nodes: {
                    type: "array",
                    items: {
                        "type": "string"
                    },
                    description: "An array of node IDs representing each node to be removed. e.g '0', '6'",
                },
            },
            required: ["nodes"],
        },
    },
    {
        name: "addEdges",
        description: "Add an edge between an output and input",
        parameters: {
            type: "object",
            properties: {
                edges: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            from: {
                                type: "string",
                                description: "Id of the output connected to the edge. e.g '0.1', '2.4'",
                            },
                            to: {
                                type: "string",
                                description: "Id of the input connected to the edge. e.g '1.3', '5.2'",
                            },
                        },
                    },
                    description: "An array objects representing the new edges to be added",
                },
            },
            required: ["edges"],
        },
    },
    {
        name: "removeEdges",
        description: "Remove an edge between an output and input",
        parameters: {
            type: "object",
            properties: {
                edges: {
                    type: "array",
                    items: {
                        type: "string",
                        description: "Id of the edge to be removed. e.g '0.0.1', '2.2.4'" 
                    },
                    description: "An array ids representing the edges which have to be removed. e.g '1.1.3', '5.5.2'",
                },
            },
            required: ["edges"],
        },
    },
] satisfies FunctionDescription[];

// ========== Function Definitions ==========

async function getCurrentWeather(location: string, unit = "celsius") {
    try {
        const response = await fetch(
            `https://goweather.herokuapp.com/weather/${location}`
        );
        const data = await response.json();
        console.log("Data", data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

// ========== Generic helper to run any function ==========

export async function runFunction(name: string, args: any) {
    switch (name) {
        case "getCurrentWeather":
            return await getCurrentWeather(args.location, args.unit);
        default:
            return null;
    }
}
