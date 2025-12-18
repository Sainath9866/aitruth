import { llmService } from '../lib/services/llmService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function test() {
    console.log('--- Testing LLM Providers ---');

    const providers = ['openai', 'deepseek', 'google', 'anthropic', 'meta'];
    const prompt = 'Hello, say "test successful" if you can hear me.';

    for (const provider of providers) {
        console.log(`\nTesting ${provider}...`);
        try {
            const response = await llmService.getResponse(provider, 'auto', prompt);
            console.log(`Response from ${provider}:`, response);
        } catch (error: any) {
            console.error(`Error testing ${provider}:`, error.message);
        }
    }
}

test();
