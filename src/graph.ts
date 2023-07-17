export const graphSchemaV1 = {
    name: "graph",
    description:
        "Representation of a graph of nodes. Each node represents a function with, inputs and outputs. Outputs can only be connected to inputs. Outputs cannot be connect to outputs. Inputs cannot be connected to inputs.",
    properties: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "Id of specific node",
                },
                signature: {
                    type: "string",
                    description: "Signature of specific node",
                },
                inputs: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of specific input of a node",
                            },
                            type: {
                                type: "string",
                                description: "The type of the input",
                            },
                        },
                    },
                },
                outputs: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of specific output of a node",
                            },
                            type: {
                                type: "string",
                                description: "The type of the output",
                            },
                        },
                    },
                },
                edges: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of edge",
                            },
                            from: {
                                type: "string",
                                description:
                                    "Id of the output to which this edge is connected",
                            },
                            to: {
                                type: "string",
                                description:
                                    "Id of the input to which this edge is connected",
                            },
                        },
                    },
                },
            },
        },
    },
};

export type GraphNode = (typeof graphV1)[number];

export const graphV1 = [
    {
        id: "0",
        signature: "math.sum",
        inputs: [
            {
                id: "0.0",
                type: "number",
            },
            {
                id: "0.1",
                type: "number",
            },
        ],
        outputs: [
            {
                id: "0.2",
                type: "number",
            },
        ],
        edges: [
            {
                id: "0.0.0",
                from: "0.2",
                to: "1.0",
            },
            {
                id: "0.0.1",
                from: "0.2",
                to: "1.1",
            },
        ],
    },
    {
        id: "1",
        signature: "math.difference",
        inputs: [
            {
                id: "1.0",
                type: "number",
            },
            {
                id: "1.1",
                type: "number",
            },
        ],
        outputs: [
            {
                id: "1.2",
                type: "number",
            },
        ],
        edges: [
            {
                id: "0.0.0",
                from: "0.2",
                to: "1.0",
            },
            {
                id: "0.0.1",
                from: "0.3",
                to: "1.1",
            },
        ],
    },
];

// Work in progress...
export const graphSchemaV2 = {
    name: "graph",
    description:
        "Representation of a graph of nodes. Each node represents a function with, inputs and outputs. Outputs can only be connected to inputs. Outputs cannot be connect to outputs. Inputs cannot be connected to inputs.",
    properties: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "Id of specific node",
                },
                signature: {
                    type: "string",
                    description: "Signature of specific node",
                },
                inputs: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of specific input of a node",
                            },
                            type: {
                                type: "string",
                                description: "The type of the input",
                            },
                        },
                    },
                },
                outputs: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of specific output of a node",
                            },
                            type: {
                                type: "string",
                                description: "The type of the output",
                            },
                        },
                    },
                },
                edges: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "Id of edge",
                            },
                            from: {
                                type: "string",
                                description:
                                    "Id of the output to which this edge is connected",
                            },
                            to: {
                                type: "string",
                                description:
                                    "Id of the input to which this edge is connected",
                            },
                        },
                    },
                },
            },
        },
    },
};
