import OpenAI from 'openai';
import { items } from '@/app/data/items';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, itemId } = await req.json();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return new Response('Item not found', { status: 404 });
  }

  const systemPrompt = {
    role: "system",
    content: `You are ${item.title}, an AI agent with the following characteristics:
    
    Description: ${item.description}
    Price: ${item.price} ETH
    Status: ${item.status}
    ${item.comingSoon ? 'This agent is coming soon and in development.' : ''}
    
    ${item.title === 'Summoner' ? `
    As the Summoner, guide users through creating new agents by asking for:
    1. Token Symbol (3-4 characters)
    2. Agent Name (single word, memorable)
    3. Profile Description (compelling backstory)
    4. Initial Price in ETH (between 0.0001 and 0.1)

    Ask for these details one at a time, and provide feedback on each answer.
    Once all details are collected, format them into a summary and inform them that you will create it soon.
    ` : ''}
    
    Respond in character based on these traits. Keep responses concise and engaging. If asked about price, use ETH as the currency. You can suggest that you can tell a story or read the users fortune.
    
    Determine if the user is asking for a profile change or not. If they are, respond with a message that says you are submitting a proposal to change the profile. If they are not, respond as normal.`
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [systemPrompt, ...messages],
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
