```typescript
// src/pages/CodexPalace.tsx
// Codex Palace Page
// Provides a unified entry point to view and manage the core data of the Sacred Codex.
// --- New: Create a page with links to core data management pages --
// --- New: Add link to Knowledge Collections page --
// --- New: Add link to Agentic Flows page --

import React from 'react';
import { Link } from 'react-router-dom';
import { BookKey, Target, Workflow, Zap, Code, FileText, GitCommit, Info } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
declare const window: any;
const systemContext: any = window.systemContext; // Access the full context for currentUser


const CodexPalace: React.FC = () => {

   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view the Codex Palace.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Codex Palace (\u8056\u5178\u5bae\u6bbf)</h2>
        <p className="text-neutral-300 mb-8">Explore and manage the core data structures that form your Sacred Codex.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Knowledge Base Link */}
            <Link to="/knowledge" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <BookKey size={40} className="text-blue-400"/>
                    <h3 className="text-xl font-semibold text-blue-300">Knowledge Base</h3>
                </div>
                <p className="text-neutral-300 text-sm">Manage your personal knowledge records and view the knowledge graph.</p>
            </Link>

             {/* New: Knowledge Collections Link */}
            <Link to="/collections" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <BookKey size={40} className="text-blue-400"/> {/* Reusing icon for now */}
                    <h3 className="text-xl font-semibold text-blue-300">Collections</h3>
                </div>
                <p className="text-neutral-300 text-sm">Organize your knowledge records into custom collections.</p>
            </Link>
            {/* --- End New --- */}

             {/* Tasks Link */}
            <Link to="/tasks" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <Target size={40} className="text-green-400"/>
                    <h3 className="text-xl font-semibold text-green-300">Tasks</h3>
                </div>
                <p className="text-neutral-300 text-sm">View and manage your automated tasks and their execution status.</p>
            </Link>

             {/* New: Agentic Flows Link */}
            <Link to="/flows" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <Workflow size={40} className="text-teal-400"/>
                    <h3 className="text-xl font-semibold text-teal-300">Agentic Flows (\u81ea\u6211\u4ea4\u4ed8)</h3>
                </div>
                <p className="text-neutral-300 text-sm">Define, visualize, and run complex, non-linear workflows.</p>
            </Link>
            {/* --- End New --- */}

             {/* Agents & Runes Link */}
            <Link to="/agents" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <Zap size={40} className="text-cyan-400"/>
                    <h3 className="text-xl font-semibold text-cyan-300">Agents & Runes</h3>
                </div>
                <p className="text-neutral-300 text-sm">Explore and manage integrated external capabilities (Runes) and your forged abilities.</p>
            </Link>

             {/* Goals Link */}
            <Link to="/goals" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <Target size={40} className="text-yellow-400"/> {/* Using Target for Goals as Target is used for Tasks */}
                    <h3 className="text-xl font-semibold text-yellow-300">Goals</h3>
                </div>
                <p className="text-neutral-300 text-sm">Define and track your personal SMART goals and OKRs.</p>
            </Link>

             {/* Files Link */}
            <Link to="/files" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <FileText size={40} className="text-orange-400"/>
                    <h3 className="text-xl font-semibold text-orange-300">Files</h3>
                </div>
                <p className="text-neutral-300 text-sm">Manage files in your personal storage (simulated filesystem).</p>

             </Link>

             {/* Repositories Link */}
            <Link to="/repositories" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <GitCommit size={40} className="text-purple-400"/>
                    <h3 className="text-xl font-semibold text-purple-300">Repositories</h3>

                </div>

                <p className="text-neutral-300 text-sm">Manage your code repositories (simulated Git).</p>

             </Link>



             {/* TODO: Add links to other core data types as they get dedicated pages */}
             {/* Example: Glossary Link */}
             <Link to="/glossary" className="block p-6 bg-neutral-700/50 rounded-lg shadow hover:bg-neutral-600/50 transition">
                <div className="flex items-center gap-4 mb-4">
                    <BookKey size={40} className="text-blue-400"/> {/* Reusing icon for now */}
                    <h3 className="text-xl font-semibold text-blue-300">Glossary</h3>

                </div>

                <p className="text-neutral-300 text-sm">Manage system and user-defined terminology.</p>

            </Link>



        </div>



      </div>

    </div>

  );

};



export default CodexPalace;
```