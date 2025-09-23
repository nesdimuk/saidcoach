class OpenAIClient {
  constructor(options) {
    if (!options?.apiKey) {
      throw new Error("Missing OpenAI API key");
    }

    this.apiKey = options.apiKey;
  }

  responses = {
    create: async ({ model, input }) => {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ model, input }),
      });

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch (err) {
          errorText = "";
        }
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText} ${errorText}`.trim(),
        );
      }

      return response.json();
    },
  };

  static extractText(result) {
    if (!result) return "";
    if (typeof result.output_text === "string") {
      return result.output_text;
    }

    if (Array.isArray(result.output)) {
      for (const item of result.output) {
        if (!item?.content) continue;
        for (const block of item.content) {
          if (block?.text) {
            return block.text;
          }
        }
      }
    }

    return "";
  }
}

export { OpenAIClient };
