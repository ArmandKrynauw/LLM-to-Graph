import { graphV1 as graph, type GraphNode } from "./graph";
import { toolbox } from "./toolbox";

type FunctionNames = "addNodes" | "removeNodes" | "addEdges" | "removeEdges";

type FunctionDescription = {
    name: FunctionNames;
    description: string;
    parameters: object;
};

// ========== Function Descriptions ==========

export const functions = [
    {
        name: "addNodes",
        description: "Add a new nodes to the provided graph",
        parameters: {
            type: "object",
            properties: {
                signatures: {
                    type: "array",
                    items: {
                        "type": "string"
                    },
                    description: "An array of node signatures representing each node to be added. e.g math.sum, math.divide",
                },
            },
            required: ["signatures"],
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

async function addNodes(signatures: string[]) {
    const addedNodes = [];

    for (const signature of signatures)  {
        if (!(signature in toolbox)) {
            throw Error(`Node with signature '${signature}' does not exist`);
        }

        const nodeId = `${graph.length}`

        const inputs = toolbox[signature].inputs;
        const outputs = toolbox[signature].outputs;
        let count = 0;

        graph.push({
            id: nodeId,
            signature,
            inputs: inputs.map((input) => ({
                id: `${nodeId}.${count++}`,
                type: input
            })),
            outputs: outputs.map((output) => ({
                id: `${nodeId}.${count++}`,
                type: output
            })),
            edges: []
        });

        addedNodes.push(signature);
    }

    return `The following nodes was added successfully: ${addedNodes.join(", ")}`;
}

async function removeNodes(nodes: string[]) {
    for (const id of nodes)  {
        const index = graph.findIndex((node) => node.id === id);
        if (index < 0) {
            throw Error(`Node id is not valid`);
        }
        graph.splice(index, 1);
    }
    return `Nodes removed successfully`;
}

async function addEdges(edges) {
    // TODO 
    return `Edges added successfully`
}

async function removeEdges(edges) {
    // TODO 
    return `Edges removed successfully`
}

// ========== Helper Function Definitions ==========


// ========== Generic helper to run any function ==========

export async function runFunction(name: string, args: any) {
    switch (name) {
        case "addNodes":
            return await addNodes(args.signatures);
        case "removeNodes":
            return await removeNodes(args.nodes);
        default:
            return null;
    }
}
