export type CreateResponseArgs = {
  model: string;
  input: Array<{ role: string; content: string }>;
};

export type CreateResponseResult = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

export default class OpenAI {
  private readonly apiKey: string;

  public readonly responses = {
    create: async ({ model, input }: CreateResponseArgs): Promise<CreateResponseResult> => {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ model, input }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} ${errorText}`.trim());
      }

      return response.json();
    },
  };

  constructor(options: { apiKey?: string }) {
    if (!options?.apiKey) {
      throw new Error("Missing OpenAI API key");
    }

    this.apiKey = options.apiKey;
  }

  static extractText(result: CreateResponseResult | null | undefined) {
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
