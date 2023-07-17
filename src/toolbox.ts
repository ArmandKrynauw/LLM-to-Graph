export type Toolbox = Record<string, ToolboxNode>;
export type ToolboxNode = {
	signature: string
	description: string
	inputs: string[]
	outputs: string[]
};

export const toolbox: Toolbox = {
    "math.sum": {
        signature: "math.sum",
        description: "Calculates the sum of two numbers",
        inputs: ["number", "number"],
        outputs: ["number"],
    },
    "math.difference": {
        signature: "math.difference",
        description:
            "Calculates the difference between the first and second number",
        inputs: ["number", "number"],
        outputs: ["number"],
    },
    "math.multiply": {
        signature: "math.multiply",
        description: "Multiplies two numbers",
        inputs: ["number", "number"],
        outputs: ["number"],
    },
    "math.divide": {
        signature: "math.divide",
        description:
            "Divides the first number by the second number",
        inputs: ["number", "number"],
        outputs: ["number"],
    },
    "math.negate": {
        signature: "math.negate",
        description:
            "Negates a single number",
        inputs: ["number", "number"],
        outputs: ["number"],
    },
}; 