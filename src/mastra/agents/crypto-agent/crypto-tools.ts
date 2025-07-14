// src/mastra/agents/crypto-agent/crypto-tool.ts

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

interface CoinGeckoCoin {
	id: string;
	symbol: string;
	name: string;
}

let coinListCache: CoinGeckoCoin[] = [];

export const cryptoTool = createTool({
	id: "get-crypto-price",
	description: "Get current crypto price by symbol (e.g., BTC, ETH, SOL)",
	inputSchema: z.object({
		symbol: z.string().describe("Cryptocurrency symbol like BTC, ETH, SOL"),
	}),
	outputSchema: z.object({
		symbol: z.string(),
		name: z.string(),
		price: z.number(),
		marketCap: z.number(),
		change24h: z.number(),
	}),
	execute: async ({ context }) => {
		const symbol = context.symbol.toLowerCase();
		return await getCryptoData(symbol);
	},
});

async function getCryptoData(symbol: string) {
	// Only fetch if cache is empty
	if (coinListCache.length === 0) {
		const res = await axios.get<CoinGeckoCoin[]>("https://api.coingecko.com/api/v3/coins/list");
		coinListCache = res.data;
	}

	// Find matching symbol
	const coin = coinListCache.find(c => c.symbol.toLowerCase() === symbol);
	if (!coin) throw new Error(`Cryptocurrency symbol '${symbol}' not found.`);

	// Fetch market data
	const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true`);
	const market = res.data.market_data;

	if (!market?.current_price?.usd) {
		throw new Error(`Market data not available for ${coin.name}`);
	}

	return {
		symbol: symbol.toUpperCase(),
		name: res.data.name,
		price: market.current_price.usd,
		marketCap: market.market_cap.usd || 0,
		change24h: market.price_change_percentage_24h || 0,
	};
}
