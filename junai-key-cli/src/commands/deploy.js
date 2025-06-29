var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\nimport { Command } from 'commander';\nimport * as fs from 'fs/promises';\nimport * as path from 'path';\nimport { exec } from 'child_process';\nimport { promisify } from 'util';\nimport * as dotenv from 'dotenv';\n\nconst execPromise = promisify(exec);\n\n// Load environment variables from .env file\ndotenv.config();\n\nexport function deployCommand(program: Command) {\n  program\n    .command('deploy')\n    .description('Deploys Jun.Ai.Key components (Supabase DB, Edge Functions)')\n    .option('--project-ref <ref>', 'Supabase project reference ID (required)')\n    .option('--access-token <token>', 'Supabase personal access token (required)')\n    .action(async (options) => {\n      console.log('\uD83D\uDE80 Starting Jun.Ai.Key deployment...');\n\n      const projectRef = options.projectRef || process.env.SUPABASE_PROJECT_ID;\n      const accessToken = options.accessToken || process.env.SUPABASE_ACCESS_TOKEN;\n\n      if (!projectRef || !accessToken) {\n        console.error('Error: Supabase project reference ID and access token are required.');\n        console.error('Provide them via --project-ref and --access-token options or SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN environment variables.');\n        process.exit(1);\n      }\n\n      try {\n        // Assume the CLI is run from the project root where supabase/ and .env are located\n\n        // 1. Link Supabase Project\n        console.log('\uD83D\uDD17 Linking Supabase project...');\n        await execPromise("], ["typescript\nimport { Command } from 'commander';\nimport * as fs from 'fs/promises';\nimport * as path from 'path';\nimport { exec } from 'child_process';\nimport { promisify } from 'util';\nimport * as dotenv from 'dotenv';\n\nconst execPromise = promisify(exec);\n\n// Load environment variables from .env file\ndotenv.config();\n\nexport function deployCommand(program: Command) {\n  program\n    .command('deploy')\n    .description('Deploys Jun.Ai.Key components (Supabase DB, Edge Functions)')\n    .option('--project-ref <ref>', 'Supabase project reference ID (required)')\n    .option('--access-token <token>', 'Supabase personal access token (required)')\n    .action(async (options) => {\n      console.log('\uD83D\uDE80 Starting Jun.Ai.Key deployment...');\n\n      const projectRef = options.projectRef || process.env.SUPABASE_PROJECT_ID;\n      const accessToken = options.accessToken || process.env.SUPABASE_ACCESS_TOKEN;\n\n      if (!projectRef || !accessToken) {\n        console.error('Error: Supabase project reference ID and access token are required.');\n        console.error('Provide them via --project-ref and --access-token options or SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN environment variables.');\n        process.exit(1);\n      }\n\n      try {\n        // Assume the CLI is run from the project root where supabase/ and .env are located\n\n        // 1. Link Supabase Project\n        console.log('\uD83D\uDD17 Linking Supabase project...');\n        await execPromise("]));
supabase;
link--;
project - ref;
$;
{
    projectRef;
}
", { env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken } });\n        console.log('\u2705 Supabase project linked.');\n\n        // 2. Deploy Supabase Migrations\n        console.log('\uD83D\uDDC2 Deploying Supabase database schema...');\n        await execPromise('supabase db push');\n        console.log('\u2705 Database schema deployed.');\n\n        // 3. Deploy Supabase Edge Functions\n        console.log('\uD83D\uDE80 Deploying Supabase Edge Functions...');\n        // Assumes functions are in supabase/functions\n        // Pass necessary secrets as environment variables during deploy\n        const edgeFunctionEnvVars = [\n            ";
SUPABASE_URL = $;
{
    process.env.SUPABASE_URL;
}
",\n            ";
SUPABASE_ANON_KEY = $;
{
    process.env.SUPABASE_ANON_KEY;
}
",\n            ";
SUPABASE_SERVICE_ROLE_KEY = $;
{
    process.env.SUPABASE_SERVICE_ROLE_KEY;
}
",\n            ";
LITELLM_API_ENDPOINT = $;
{
    process.env.LITELLM_API_ENDPOINT;
}
",\n            ";
LITELLM_MODEL = $;
{
    process.env.LITELLM_MODEL;
}
",\n            ";
BOOST_SPACE_WEBHOOK_URL = $;
{
    process.env.BOOST_SPACE_WEBHOOK_URL;
}
",\n            ";
BOOST_SPACE_API_KEY = $;
{
    process.env.BOOST_SPACE_API_KEY;
}
",\n            ";
OPENAI_API_KEY = $;
{
    process.env.OPENAI_API_KEY;
}
",\n            ";
NOTION_API_KEY = $;
{
    process.env.NOTION_API_KEY;
}
",\n            // Add other secrets needed by Edge Functions\n        ].filter(v => v.endsWith('=') === false).join(' '); // Filter out empty vars\n\n        await execPromise(";
supabase;
functions;
deploy--;
project - ref;
$;
{
    projectRef;
}
--no - verify - jwt;
$;
{
    edgeFunctionEnvVars;
}
", { env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken } });\n        console.log('\u2705 Edge Functions deployed.');\n\n        console.log('\uD83C\uDF89 Jun.Ai.Key deployment completed successfully!');\n\n      } catch (error: any) {\n        console.error('\u274C Deployment failed:', error.message);\n        if (error.stdout) console.error('Stdout:', error.stdout);\n        if (error.stderr) console.error('Stderr:', error.stderr);\n        process.exit(1);\n      }\n    });\n}\n"(__makeTemplateObject([""], [""]));
