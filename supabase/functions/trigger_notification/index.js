var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// Follow this setup guide to deploy your first function:\n// https://supabase.com/docs/guides/functions/quickstart\n//\n// supabase start --local\n// supabase functions deploy trigger_notification --no-verify-jwt\nimport { serve } from 'https://deno.land/std@0.177.0/http/server.ts'\nimport { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'\n\nconsole.log('Hello from Functions!')\n\nserve(async (req) => {\n  const { url, method, headers } = req\n  console.log("], ["typescript\n// Follow this setup guide to deploy your first function:\n// https://supabase.com/docs/guides/functions/quickstart\n//\n// supabase start --local\n// supabase functions deploy trigger_notification --no-verify-jwt\nimport { serve } from 'https://deno.land/std@0.177.0/http/server.ts'\nimport { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'\n\nconsole.log('Hello from Functions!')\n\nserve(async (req) => {\n  const { url, method, headers } = req\n  console.log("]));
Request;
received: $;
{
    method;
}
$;
{
    url;
}
")\n\n  // Check for CORS preflight request\n  if (method === 'OPTIONS') {\n    return new Response(null, {\n      status: 204,\n      headers: {\n        'Access-Control-Allow-Origin': '*', // Or restrict to your frontend origin\n        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',\n        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow POST and OPTIONS\n      },\n    })\n  }\n\n  // Get the JWT from the Authorization header\n  const authHeader = headers.get('Authorization')\n  const jwt = authHeader?.replace('Bearer ', '')\n\n  // Create a Supabase client with the user's JWT\n  const supabase = createClient(\n    Deno.env.get('SUPABASE_URL') ?? '',\n    Deno.env.get('SUPABASE_ANON_KEY') ?? '',\n    {\n      global: { headers: { Authorization: ";
Bearer;
$;
{
    jwt;
}
" } },\n    }\n  )\n\n  // Get the user from the JWT\n  const { data: { user } } = await supabase.auth.getUser()\n\n  if (!user) {\n    console.warn('Request received without authenticated user.')\n    return new Response(JSON.stringify({ error: 'Authentication required' }), {\n      status: 401,\n      headers: { ...corsHeaders, 'Content-Type': 'application/json' },\n    })\n  }\n\n  console.log(";
Request;
authenticated;
for (user; ; )
    : $;
{
    user.id;
}
")\n\n  try {\n    const { type, payload } = await req.json()\n    console.log(";
Received;
message;
type: $;
{
    type;
}
")\n\n    // --- Handle different message types ---\n    let responseData: any = { message: 'Unknown message type' };\n    let status = 400; // Default to Bad Request\n\n    switch (type) {\n      case 'new_knowledge_record':\n        // Example: Process a new knowledge record event\n        console.log('Processing new_knowledge_record event:', payload);\n        // You could trigger a notification, analysis, or other workflow here.\n        // For MVP, just log and return success.\n        responseData = { message: ";
Processed;
new knowledge;
record;
event;
for (ID; ; )
    : $;
{
    payload.record_id;
}
" };\n        status = 200;\n        break;\n\n      case 'task_completed':\n        // Example: Process a task completed event\n        console.log('Processing task_completed event:', payload);\n        // You could send a notification, update a goal, or trigger a follow-up task/flow.\n        // For MVP, just log and return success.\n        responseData = { message: ";
Processed;
task;
completed;
event;
for (ID; ; )
    : $;
{
    payload.taskId;
}
" };\n        status = 200;\n        break;\n\n      case 'trigger_notification':\n        // Example: Trigger a notification based on payload\n        console.log('Processing trigger_notification event:', payload);\n        // This payload should contain notification details (message, type, etc.)\n        // You could insert into the 'notifications' table here or use a push service.\n        // For MVP, simulate sending.\n        responseData = { message: ";
Simulated;
sending;
notification: $;
{
    payload.message;
}
" };\n        status = 200;\n        break;\n\n      // Add cases for other event types you want this function to handle\n      // case 'ability_forged': ...\n      // case 'webhook_event_received': ...\n\n      default:\n        console.warn(";
Unhandled;
message;
type: $;
{
    type;
}
");\n        responseData = { error: ";
Unhandled;
message;
type: $;
{
    type;
}
" };\n        status = 400;\n        break;\n    }\n\n\n    return new Response(JSON.stringify(responseData), {\n      status: status,\n      headers: { ...corsHeaders, 'Content-Type': 'application/json' },\n    })\n\n  } catch (error) {\n    console.error('Error processing request:', error.message);\n    return new Response(JSON.stringify({ error: error.message }), {\n      status: 500,\n      headers: { ...corsHeaders, 'Content-Type': 'application/json' },\n    })\n  }\n})\n\n// Define CORS headers (should match the preflight response)\nconst corsHeaders = {\n  'Access-Control-Allow-Origin': '*', // Or restrict to your frontend origin\n  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',\n}\n"(__makeTemplateObject([""], [""]));
