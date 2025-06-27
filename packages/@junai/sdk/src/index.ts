```typescript
// packages/@junai/sdk/src/index.ts
// Jun.Ai.Key SDK Entry Point

import { SupabaseClient } from '@supabase/supabase-js';
import { ApiProxy } from './apiProxy'; // Assuming ApiProxy is part of the SDK or used internally
import { KnowledgeClient } from './knowledge';
import { TaskClient } from './tasks';
import { GoalClient } from './goals';
import { RuneClient } from './runes';
import { AuthClient } from './auth'; // Import AuthClient
// Import other client modules
import { GlossaryClient } from './glossary';
import { FileClient } from './files';
import { RepositoryClient } from './repositories';
import { CalendarClient } from './calendar';
import { TemplateClient } from './templates';
import { KnowledgeGraphClient } from './knowledgeGraph';
import { AnalyticsClient } from './analytics'; // Import AnalyticsClient
import { EvolutionClient } from './evolution'; // Import EvolutionClient
import { SecurityClient } from './security'; // Import SecurityClient
import { NotificationClient } from './notifications'; // Import NotificationClient


export interface JunAiKeyConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  // Add other configuration options (e.g., custom API endpoint for your deployed gateway)
  junaiApiEndpoint?: string; // Optional: Endpoint for your custom API Gateway
}

export class JunAiKeySDK {
  private supabaseClient: SupabaseClient;
  private apiProxy: ApiProxy; // SDK's internal API proxy

  // Expose client modules
  public auth: AuthClient; // Expose AuthClient
  public knowledge: KnowledgeClient;
  public tasks: TaskClient;
  public runes: RuneClient; // Client for interacting with runes (public and user-owned)
  public goals: GoalClient;
  public glossary: GlossaryClient;
  public files: FileClient;
  public repositories: RepositoryClient;
  public calendar: CalendarClient;
  public templates: TemplateClient;
  public knowledgeGraph: KnowledgeGraphClient;
  public analytics: AnalyticsClient; // Expose AnalyticsClient
  public evolution: EvolutionClient; // Expose EvolutionClient
  public security: SecurityClient; // Expose SecurityClient
  public notifications: NotificationClient; // Expose NotificationClient


  constructor(config: JunAiKeyConfig) {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required for the SDK.');
    }

    this.supabaseClient = new SupabaseClient(config.supabaseUrl, config.supabaseAnonKey);

    // The SDK's ApiProxy might call directly to Supabase or to your custom API Gateway
    // For simplicity, let's assume it calls directly to Supabase for DB operations
    // and potentially to a custom endpoint for other actions (like triggering AI analysis)
    this.apiProxy = new ApiProxy(this.supabaseClient, config.junaiApiEndpoint); // Pass Supabase client and optional custom endpoint

    // Initialize client modules, passing necessary dependencies
    this.auth = new AuthClient(this.supabaseClient); // Initialize AuthClient
    this.knowledge = new KnowledgeClient(this.apiProxy);
    this.tasks = new TaskClient(this.apiProxy);
    this.runes = new RuneClient(this.apiProxy); // Rune client uses apiProxy
    this.goals = new GoalClient(this.apiProxy);
    this.glossary = new GlossaryClient(this.apiProxy);
    this.files = new FileClient(this.apiProxy);
    this.repositories = new RepositoryClient(this.apiProxy);
    this.calendar = new CalendarClient(this.apiProxy);
    this.templates = new TemplateClient(this.apiProxy);
    this.knowledgeGraph = new KnowledgeGraphClient(this.apiProxy);
    this.analytics = new AnalyticsClient(this.apiProxy); // Initialize AnalyticsClient
    this.evolution = new EvolutionClient(this.apiProxy); // Initialize EvolutionClient
    this.security = new SecurityClient(this.apiProxy); // Initialize SecurityClient
    this.notifications = new NotificationClient(this.apiProxy); // Initialize NotificationClient
  }

  // Expose the underlying Supabase client if needed (optional)
  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }

  // Add other top-level SDK methods if needed
}

// Example Usage:
// const junai = new JunAiKeySDK({
//   supabaseUrl: 'YOUR_SUPABASE_URL',
//   supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
//   junaiApiEndpoint: 'YOUR_DEPLOYED_API_GATEWAY_URL' // Optional
// });
//
// async function example() {
//   // Authenticate user
//   const { user, session } = await junai.auth.signInWithPassword('email', 'password');
//
//   // Create a knowledge record
//   if (user) {
//     const newRecord = await junai.knowledge.create({
//       question: 'What is Jun.Ai.Key?',
//       answer: 'Jun.Ai.Key is a personal AI operating system.',
//       userId: user.id // Pass user ID for RLS
//     });
//     console.log('Created record:', newRecord);
//   }
//
//   // Trigger an action via the API Gateway (if junaiApiEndpoint is configured)
//   // This assumes your API Gateway has an /analyze endpoint that processes input
//   if (junai.apiProxy.getApiEndpoint()) {
//      const analysisResult = await junai.apiProxy.callApi('/api/v1/analyze', 'POST', { text: 'Create a task to buy milk' });
//      console.log('Analysis result:', analysisResult);
//   }
// }
//
// example();
```