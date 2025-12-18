import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class LLMService {
    private openai?: OpenAI;
    private anthropic?: Anthropic;
    private google?: GoogleGenerativeAI;

    constructor() { }

    private initOpenAI() {
        if (this.openai) return;
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
    }

    private initAnthropic() {
        if (this.anthropic) return;
        if (process.env.ANTHROPIC_API_KEY) {
            this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        }
    }

    private initGoogle() {
        if (this.google) return;
        if (process.env.GOOGLE_API_KEY) {
            this.google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        }
    }

    async getResponse(provider: string, modelName: string, prompt: string): Promise<string> {
        const defaultModels: Record<string, string> = {
            openai: 'gpt-4o',
            google: 'gemini-2.5-flash',
            anthropic: 'claude-sonnet-4-5',
            deepseek: 'deepseek-chat',
        };

        const model = modelName === 'auto' || !modelName ? defaultModels[provider] || 'gpt-4o' : modelName;

        try {
            switch (provider) {
                case 'openai':
                    return await this.callOpenAI(model, prompt);
                case 'google':
                    return await this.callGoogle(model, prompt);
                case 'anthropic':
                    return await this.callAnthropic(model, prompt);
                case 'deepseek':
                    return await this.callDeepseek(model, prompt);
                default:
                    return `Error: Unknown provider ${provider}`;
            }
        } catch (error: any) {
            console.error(`Error calling ${model}:`, error);
            return `Error calling ${model}: ${error.message}`;
        }
    }

    private async callOpenAI(model: string, prompt: string): Promise<string> {
        this.initOpenAI();
        if (!this.openai) throw new Error('OpenAI API key not configured');
        const response = await this.openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content || '';
    }

    private async callGoogle(modelName: string, prompt: string): Promise<string> {
        this.initGoogle();
        if (!this.google) throw new Error('Google API key not configured');
        const model = this.google.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
    }

    private async callAnthropic(modelName: string, prompt: string): Promise<string> {
        this.initAnthropic();
        if (!this.anthropic) throw new Error('Anthropic API key not configured');
        const message = await this.anthropic.messages.create({
            model: modelName,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
            return content.text;
        }
        return '';
    }

    private async callDeepseek(model: string, prompt: string): Promise<string> {
        const deepseek = new OpenAI({
            apiKey: process.env.DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com',
        });
        const response = await deepseek.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content || '';
    }
}

export const llmService = new LLMService();
