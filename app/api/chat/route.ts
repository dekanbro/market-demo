import OpenAI from 'openai';
import { getDaoById } from '@/app/lib/dao-service';
import { executeFunctionCall } from './functions';
import { agentRegistry } from './agent-registry'

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, itemId: daoId } = await req.json();
  
  // Fetch DAO data using the existing GraphQL query
  const dao = await getDaoById(daoId);

  if (!dao) {
    return new Response('DAO not found', { status: 404 });
  }

  // Get agent configuration based on DAO type
  // const agentConfig = agentRegistry[dao.type as keyof typeof agentRegistry] || agentRegistry.default;
  const agentConfig = agentRegistry.default;


  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { 
        role: "system", 
        content: agentConfig.systemPrompt(dao)
      }, 
      ...messages
    ],
    tools: agentConfig.tools,
    tool_choice: "auto",
  });

  const stream = new ReadableStream({
    async start(controller) {
      let currentToolCall: any = null;
      let processedCalls = new Set();

      for await (const chunk of response) {
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
                controller.enqueue(new TextEncoder().encode(
                  `\n<tool-call>\n\`\`\`${currentToolCall.id}\n${result}\n\`\`\`\n</tool-call>\n`
                ));
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

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
