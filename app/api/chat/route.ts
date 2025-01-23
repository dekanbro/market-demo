import OpenAI from 'openai';
import { getDaoById } from '@/app/lib/dao-service';
import { executeFunctionCall } from './agent-registry';
import { agentRegistry } from './agent-registry';
import { AGENT_IDS } from '@/app/lib/constants'

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, itemId, walletAddress } = await req.json();

 console.log("wallet address from route", walletAddress);

  let systemPrompt: string;
  let tools = [];

  // Use itemId to determine which agent we're talking to
  if (itemId === AGENT_IDS.HELP || itemId === AGENT_IDS.SUMMONER) {
    const agentConfig = agentRegistry[itemId];
    systemPrompt = await agentConfig.systemPrompt();
    tools = agentConfig.tools;
  } else {
    const dao = await getDaoById(itemId);
    if (!dao) {
      return new Response(JSON.stringify({ error: 'DAO not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const agentConfig = agentRegistry[dao.type] || agentRegistry['default'];
    systemPrompt = await agentConfig.systemPrompt(dao);
    tools = agentConfig.tools;
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Connected Wallet/Member Address: ${walletAddress}` },
      ...messages,
    ],
    stream: true,
    tools,
  });

  const streamResult = new ReadableStream({
    async start(controller) {
      let currentToolCall: any = null;
      let processedCalls = new Set();

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.tool_calls) {
          const toolCallDelta = chunk.choices[0].delta.tool_calls[0];
          
          if (!currentToolCall) {
            currentToolCall = {
              id: Date.now(),
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

          if (currentToolCall.function.name && currentToolCall.function.arguments) {
            const callId = `${currentToolCall.function.name}-${currentToolCall.function.arguments}`;
            if (!processedCalls.has(callId)) {
              try {
                const args = JSON.parse(currentToolCall.function.arguments);
                const result = await executeFunctionCall(
                  currentToolCall.function.name,
                  args
                );
                controller.enqueue(new TextEncoder().encode(result));
                processedCalls.add(callId);
              } catch (error) {
                if (error instanceof SyntaxError) {
                  continue;
                }
                console.error('Error executing function:', error);
              }
            }
            currentToolCall = null;
          }
        } else if (chunk.choices[0]?.delta?.content) {
          controller.enqueue(new TextEncoder().encode(chunk.choices[0].delta.content));
        }
      }
      controller.close();
    },
  });

  return new Response(streamResult, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
