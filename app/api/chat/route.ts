import OpenAI from 'openai';
import { items } from '@/app/data/items';

import { functionTools, executeFunctionCall } from './functions';

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
    AgentId: ${item.id}
    Description: ${item.description}

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
    
    Respond in character based on these traits. Keep responses concise and engaging. If asked about your price, use the getAgentPrice function.
    If users suggest improvements or changes to your profile, use the submitProposal function to record their suggestion.`
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [systemPrompt, ...messages],
    tools: functionTools,
    tool_choice: "auto",
  });

  const stream = new ReadableStream({
    async start(controller) {
      let currentToolCall: any = null;

      for await (const chunk of response) {
        if (chunk.choices[0]?.delta?.tool_calls) {
          const toolCallDelta = chunk.choices[0].delta.tool_calls[0];
          
          // Initialize or update the current tool call
          if (!currentToolCall) {
            currentToolCall = {
              function: {
                name: toolCallDelta.function?.name || '',
                arguments: toolCallDelta.function?.arguments || ''
              }
            };
          } else {
            if (toolCallDelta.function?.name) {
              currentToolCall.function.name = toolCallDelta.function.name;
            }
            if (toolCallDelta.function?.arguments) {
              currentToolCall.function.arguments += toolCallDelta.function.arguments;
            }
          }

          // If we have a complete tool call, execute it
          if (currentToolCall.function.name && currentToolCall.function.arguments) {
            try {
              const args = JSON.parse(currentToolCall.function.arguments);
              const result = await executeFunctionCall(
                currentToolCall.function.name,
                args
              );
              controller.enqueue(new TextEncoder().encode(JSON.stringify(result)));
              currentToolCall = null;
            } catch (error) {
              if (error instanceof SyntaxError) {
                continue;
              }
              console.error('Error executing function:', error);
            }
          }
        } else if (chunk.choices[0]?.delta?.content) {
          controller.enqueue(new TextEncoder().encode(chunk.choices[0].delta.content));
        }
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
