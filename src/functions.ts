type FunctionNames = "getCurrentWeather";

type FunctionDescription = {
    name: FunctionNames;
    description: string;
    parameters: object;
};

// ========== Function Descriptions ==========

export const functions = [
    {
        name: "getCurrentWeather",
        description: "Get the current weather in a given location",
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The city e.g. HongKong, SanFrancisco",
                },
                unit: { type: "string", enum: ["celsius", "fahrenheit"] },
            },
            required: ["location"],
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
            return await getCurrentWeather(args["location"], args["unit"]);
        default:
            return null;
    }
}
