import { tavily } from "@tavily/core";
import { llmClassify } from "./gemini.ai.js";

export function ruleBasedCheck(prompt) {
    const text = prompt.toLowerCase().trim();
    
    // Strong indicators for web search (high confidence)
    const strongWebTriggers = [
        // Direct search commands
        /^(search for|find|look up|google|show me|get me)/,
        /^(find information about|search about|look for)/,
        
        // Current/recent information requests
        /\b(latest|recent|current|today|this week|this month|2024|2025)\b.*\b(news|updates|information|data)\b/,
        /\b(breaking|recent|latest|current)\b.*\b(news|events|developments)\b/,
        
        // Real-time data requests
        /\b(stock|price|weather|temperature|exchange rate|market)\b/,
        /\b(live|real.?time|current)\b.*\b(status|data|information)\b/,
        
        // Specific factual queries
        /\b(when did|when was|when will)\b.*\b(happen|occur|release|launch)\b/,
        /\b(how much|what.?s the price|cost of)\b/,
        
        // News and updates
        /\b(news about|updates on|headlines)\b/,
        /\b(what.?s happening|what happened)\b.*\b(in|with|to)\b/,
    ];

    // Strong indicators for general chat (high confidence)
    const strongChatTriggers = [
        // Personal/subjective requests
        /^(help me|can you help|assist me|guide me)/,
        /^(explain|tell me about|describe|what is)\b(?!.*\b(latest|current|recent|news)\b)/,
        /^(how to|how do|how can|tutorial|guide)/,
        
        // Creative/analytical tasks
        /^(write|create|generate|make|build|design)/,
        /^(analyze|compare|evaluate|review|summarize)/,
        /^(translate|convert|calculate|solve)/,
        
        // Opinion/advice requests
        /\b(opinion|advice|recommend|suggest|think|believe)\b/,
        /\b(should i|what do you think|your thoughts)\b/,
        
        // Conversational patterns
        /^(hi|hello|hey|good morning|good evening)/,
        /^(thank you|thanks|please|sorry)/,
    ];

    // Ambiguous patterns that need LLM classification
    const ambiguousPatterns = [
        // Could be current info or general knowledge
        /^(what is|who is|where is|which is)\b/,
        /^(tell me|show me)\b(?!.*\b(search|find|look)\b)/,
        
        // Company/product info (could be recent or general)
        /\b(company|product|service|app|website)\b.*\b(features|about|details)\b/,
        
        // Event queries (could be historical or current)
        /\b(event|conference|meeting|announcement)\b/,
        
        // Comparison requests (might need current data)
        /\b(vs|versus|compare|difference between)\b/,
    ];

    // Check strong web search indicators
    if (strongWebTriggers.some(pattern => pattern.test(text))) {
        return "web_search";
    }

    // Check strong chat indicators
    if (strongChatTriggers.some(pattern => pattern.test(text))) {
        return "general_chat";
    }

    // Check for ambiguous patterns
    if (ambiguousPatterns.some(pattern => pattern.test(text))) {
        return "ambiguous";
    }

    // Additional heuristics
    const webSearchHeuristics = {
        // Time-sensitive keywords
        timeKeywords: ['today', 'yesterday', 'this week', 'this month', 'recently', 'now', 'currently'],
        // Current events keywords
        currentEvents: ['news', 'update', 'announcement', 'release', 'launch', 'event'],
        // Data/stats keywords
        dataKeywords: ['statistics', 'data', 'report', 'study', 'survey', 'research'],
        // Market/financial keywords
        financialKeywords: ['stock', 'price', 'market', 'economy', 'GDP', 'inflation', 'rate']
    };

    const chatHeuristics = {
        // Learning/educational keywords
        learningKeywords: ['learn', 'understand', 'concept', 'theory', 'principle', 'basics'],
        // Creative keywords
        creativeKeywords: ['story', 'poem', 'creative', 'imagine', 'brainstorm', 'idea'],
        // Problem-solving keywords
        problemSolving: ['help', 'solve', 'fix', 'debug', 'troubleshoot', 'issue']
    };

    // Calculate heuristic scores
    let webScore = 0;
    let chatScore = 0;

    // Count web search indicators
    Object.values(webSearchHeuristics).flat().forEach(keyword => {
        if (text.includes(keyword)) webScore++;
    });

    // Count chat indicators
    Object.values(chatHeuristics).flat().forEach(keyword => {
        if (text.includes(keyword)) chatScore++;
    });

    // Additional scoring based on question structure
    if (/\b(when|where|which|who)\b.*\b(is|are|was|were|will)\b/.test(text)) {
        webScore += 0.5; // Questions about specific facts lean toward web search
    }

    if (/\b(how|why)\b.*\b(to|do|does|can|should)\b/.test(text)) {
        chatScore += 0.5; // How-to questions lean toward general chat
    }

    // Decision based on scores
    if (webScore > chatScore && webScore >= 1) {
        return "web_search";
    } else if (chatScore > webScore && chatScore >= 1) {
        return "general_chat";
    }

    // Default to ambiguous if unclear
    return "ambiguous";
}

export async function classifyPrompt(prompt) {
    const ruleResult = ruleBasedCheck(prompt);

    if (ruleResult === "ambiguous") {
        // fallback to LLM for smarter classification
        return await llmClassify(prompt);
    }

    return ruleResult;
}

export async function generateWebResponse(prompt){
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const response = await tvly.search(prompt, {
        includeAnswer: "basic",
        includeImages: true,
        includeImageDescriptions: true,
        includeFavicon: true,
        includeRawContent: "markdown"
    });
    return response;
}