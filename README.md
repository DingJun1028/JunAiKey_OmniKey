```markdown
# Jun.Ai.Key: The OmniKey (\u842c\u80fd\u5143\u9375)

## Jun.Ai.Key MVP Enhanced Framework v420

Welcome to the Jun.Ai.Key project, an exploration into building a personal AI operating system based on the concepts of the Sacred Codex and the Six Styles of Infinite Evolution. This MVP (Minimum Viable Product) serves as a foundational framework demonstrating core principles and initial functionalities within a simulated environment (WebContainer).

**Brand Spirit:** \u4ee5\u7d42\u70ba\u59cb\uff0c\u59cb\u7d42\u5982\u4e00 (Beginning with the end in mind, the beginning and end are one)

## Core Concepts

*   **Sacred Codex (\u8056\u5178):** The user's personal, interconnected data universe. Includes:
    *   **Long-term Memory (\u6c38\u4e45\u8a18\u61b6):** Knowledge Base (Q&A), Knowledge Collections, Journal, Glossary.
    *   **Self-Navigation (\u81ea\u6211\u5c0e\u822a):** Tasks, Agentic Flows (Dynamic DAG Workflows).
    *   **Authority Forging (\u6b0a\u80fd\u935b\u9020):** User Actions, Automated Abilities (Scripts).
    *   **Rune Engrafting (\u7b26\u6587\u5d4c\u5165):** Integrated external capabilities (Runes).
    *   **Wisdom Precipitation (\u667a\u6167\u6c89\u6fb1):** Insights, Knowledge Graph, AI Analysis.
    *   **Security Service (\u5b89\u5168\u670d\u52d9):** Authentication, Authorization, Secure Storage, Audit Logs, Integrity Check, Monitoring, Backup/Restore, Mirroring.
*   **Six Styles of Infinite Evolution (\u7120\u9650\u9032\u5316\u5faa\u74b0\u7684\u516d\u5f0f\u5967\u7fa9):** The core loop of the system.
    1.  **Observe (\u89c0\u5bdf):** Collect data (user actions, system events).
    2.  **Precipitate (\u6c89\u6fb1):** Store and structure data (Knowledge Base, Logs).
    3.  **Learn (\u5b78\u7fd2):** Identify patterns and generate insights (Evolution Engine).
    4.  **Decide (\u6c7a\u7b56):** Determine intent and plan actions (Wisdom Secret Art, Decision Agent).
    5.  **Act (\u884c\u52d5):** Execute actions (Self-Navigation Engine, Abilities, Runes).
    6.  **Trigger (\u89f8\u767c):** Initiate actions based on events or schedules (Self-Navigation Engine, Authority Forging Engine, Webhooks).
*   **Agent System Architecture (\u4ee3\u7406\u7cfb\u7d71\u67b6\u69cb):** Modular agents communicating via a Message Bus.
    *   Input Agent, Decision Agent, Knowledge Agent, AI Agent, Sync Agent, Device Agent, Utility Agent, UI Agent, Authority Forging Agent, Self-Navigation Agent, Rune Engrafting Agent, Notification Agent, Evolution Agent, Goal Management Agent, Analytics Agent, Webhook Agent, Suggestion Agent, Calendar Agent, Template Agent.
*   **Runes (\u7b26\u6587):** Standardized interfaces to external services and devices (API Adapters, Script Plugins, Device Adapters, etc.).

## Current MVP Features (v420)

This MVP focuses on establishing the core architecture and demonstrating basic CRUD (Create, Read, Update, Delete) and interaction patterns for key data types within a simulated environment.

*   **Authentication:** User login/signup via Email/Password (Supabase Auth).
*   **Dashboard:** Overview of system status and recent activity, including sync status and simulated Git sync.
*   **Chat:** Natural language interaction with the AI Assistant (simulated LLM via LiteLLM), displaying conversation history, AI decisions, and suggested actions. Includes basic multimodal input handling (image, file).
*   **Knowledge Base:** View, create, edit, and delete Knowledge Records. Basic keyword and semantic search (simulated embeddings). View Knowledge Graph visualization. Manage Knowledge Relations.
*   **Tasks:** View, create, edit (description only), and delete automated Tasks. Manually start, pause, resume, and cancel task execution (simulated step execution). Link/unlink tasks to Key Results.
*   **Goals:** View, create, edit, and delete Goals (SMART/OKR) and Key Results. Manually update KR progress. Display linked tasks for KRs.
*   **Agents:** View Public Runes and your Installed Runes. Install/Uninstall Runes (simulated capacity check). Edit user-owned Rune Configurations. Execute Rune methods (simulated). View your Forged Abilities (Scripts). Manually forge, edit, delete, and run Abilities (simulated script execution).
*   **Files:** Browse, view, create, edit, and delete files and directories in a simulated filesystem (WebContainer fs).
*   **Repositories:** View simulated Git repositories. Perform simulated Git operations (clone, commit, push, pull, status, add, log, checkout, branch, sync). Includes simulated integration with Working Copy via URL Schemes.
*   **Security Audit:** View recent Security Events and Personal Usage Logs (User Actions). Copy log/action details. AI Analysis of log/action entries (simulated).
*   **Knowledge Collections:** View, create, and manage collections of Knowledge Records. Add/Remove records from collections.
*   **Calendar:** View, create, edit, and delete Calendar Events.
*   **Templates:** View, create, edit, and delete reusable Templates for various data types.
*   **Marketplace:** View simulated course product pages generated from knowledge.
*   **Journal:** View, create, edit, and delete journal entries.
*   **Insights:** View evolutionary insights and trigger actions (automate, review task, apply suggestion). Manually trigger evolution cycle.
*   **Sync:** View synchronization status for different data types and trigger sync operations.
*   **Users:** View a list of users in the system (simulated admin view).
*   **Settings:** Manage API Keys (simulated secure storage), Sync Configuration (simulated), Integrations (simulated linking/unlinking, including Working Copy key storage), User Data Reset (simulated destructive action), Codex Backup (simulated), Codex Guardian (Data Integrity Check - simulated), Defense Aura (Security Monitoring Scan - simulated), Codex Restricted Zone (Secure Storage - simulated).

## Getting Started

This project is designed to run in a WebContainer environment (like StackBlitz) or a Node.js environment.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd jun-ai-key
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the project root based on the `.env.example` file. Fill in the required Supabase credentials and any API keys for external services you want to integrate (note: some features are simulated even if keys are provided).
    ```bash
    cp .env.example .env
    # Edit .env and add your keys
    ```
4.  **Run Supabase Migrations (if using a real Supabase project):**
    If you have a Supabase project set up, you can apply the database schema defined in `supabase/migrations`.
    ```bash
    npm install -g supabase-cli
    supabase login # Log in to Supabase CLI
    supabase link --project-ref <your-project-id> # Link to your project
    supabase db push # Apply migrations
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server. The application will be accessible in your browser, typically at `http://localhost:3000` or the WebContainer preview URL.

## Simulated Features

Please note that many external integrations and advanced functionalities are **simulated** in this MVP framework. This includes:

*   LLM interactions (via LiteLLM placeholder).
*   External API calls (handled by ApiProxy simulation).
*   Device interactions (clipboard, file system, URL schemes via simulated Runes).
*   Real-time sync across devices (Supabase Realtime is used for UI updates, but the underlying sync logic is simplified).
*   Complex Git operations (delegated to simulated RepositoryService or Working Copy Rune).
*   Advanced AI analysis and generation (simulated by returning placeholder data).
*   Secure storage encryption/decryption (simulated).
*   Background processes and scheduled triggers.

The purpose of these simulations is to demonstrate the intended architecture and interaction patterns between core modules and agents, allowing the UI and core logic to be developed independently of fully functional external integrations.

## Project Structure

*   `src/`: Source code for the web application and core system modules.
    *   `agents/`: Agent System Architecture components (MessageBus, Router, BaseAgent, specific agents).
    *   `core/`: Core system pillars and services (Memory, Authority, Self-Navigation, Rune Engrafting, Wisdom, Security, Logging, Caching, Files, Repository, Goal Management, Evolution, Calendar, Templates).
    *   `modules/`: Auxiliary modules (Events, Notifications, Sync, Analytics).
    *   `pages/`: React components for different application pages.
    *   `components/`: Reusable React components (e.g., ActionEditor, KnowledgeGraphViewer).
    *   `proxies/`: External service proxies (e.g., ApiProxy).
    *   `runes/`: Implementations for specific Runes.
    *   `interfaces.ts`: TypeScript interfaces for data structures.
    *   `junai.ts`: The main AI Assistant interface (orchestrator).
    *   `main.tsx`: Application entry point, initializes system context and agents.
*   `supabase/`: Supabase database migrations and Edge Functions.
*   `.env.example`: Example environment variables file.
*   `.github/workflows/`: GitHub Actions workflows (e.g., for auto-deploy).

## Contributing

Contributions are welcome! Please follow the project's design principles and coding standards.

## License

[Specify your project's license here]
```