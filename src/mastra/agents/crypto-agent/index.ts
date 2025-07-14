// src/mastra/agents/crypto-agent/index.ts

import { Agent } from "@mastra/core/agent";
import { cryptoTool } from "./crypto-tools";
import { model } from "../../config";

const name = "Crypto Agent";

const instructions = `
You are a crypto market assistant.

Your goal is to help users get real-time data about cryptocurrencies like Bitcoin, Ethereum, Solana, etc.

When responding:
- Ask for the symbol (like BTC, ETH, SOL) if it's not provided
- Always include current price in USD, market cap, and 24h change
- Keep responses brief but clear
`;

export const cryptoAgent = new Agent({
	name,
	instructions,
	model,
	tools: { cryptoTool },
});
