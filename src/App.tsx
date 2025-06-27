```typescript
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import KnowledgeBase from './pages/KnowledgeBase';
import Scripts from './pages/Scripts';
import Agents from './pages/Agents';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import CodexPalace from './pages/CodexPalace'; // Import CodexPalace
import SecurityAudit from './pages/SecurityAudit'; // Import SecurityAudit
import Files from './pages/Files'; // Import Files
import Repositories from './pages/Repositories'; // Import Repositories
import Glossary from './pages/Glossary'; // Import Glossary
import KnowledgeCollections from './pages/KnowledgeCollections'; // Import KnowledgeCollections
import CollectionDetail from './pages/CollectionDetail'; // Import CollectionDetail
import AgenticFlows from './pages/AgenticFlows'; // Import AgenticFlows
import AgenticFlowDetail from './pages/AgenticFlowDetail'; // Import AgenticFlowDetail
import AgenticFlowEditor from './pages/AgenticFlowEditor'; // Import AgenticFlowEditor
import Calendar from './pages/Calendar'; // Import Calendar
import Templates from './pages/Templates'; // Import Templates
import Marketplace from './pages/Marketplace'; // Import Marketplace
import Journal from './pages/Journal'; // Import Journal
import Insights from './pages/Insights'; // Import Insights
import Sync from './pages/Sync'; // Import Sync
import Users from './pages/Users'; // Import Users


import Navbar from './components/Navbar'; // Import Navbar
import { SystemContext, User } from './interfaces'; // Import User type

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const systemContext: SystemContext = window.systemContext; // Access the system context

// ProtectedRoute component to guard routes that require authentication
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(systemContext?.currentUser);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Subscribe to auth state changes
    let unsubscribe: (() => void) | undefined;
    if (systemContext?.securityService) {
      unsubscribe = systemContext.securityService.onAuthStateChange((user: User | null) => {
        setCurrentUser(user);
        setLoading(false); // Set loading to false after initial check
      });
    } else {
        // If securityService is not available, assume not logged in and stop loading
        setLoading(false);
    }

    // Initial check if securityService was already initialized and user is available
    if (systemContext?.securityService && systemContext.currentUser !== undefined) {
         setCurrentUser(systemContext.currentUser);
         setLoading(false);
    }


    return () => {
      // Unsubscribe on component unmount
      unsubscribe?.();
    };
  }, [systemContext?.securityService]); // Re-run effect if securityService changes

  if (loading) {
      // Optionally render a loading spinner or message while checking auth state
      return <div className="flex justify-center items-center h-screen text-neutral-400">Loading...</div>;
  }


  // If user is not logged in, redirect to the auth page
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in, render the children (the protected route component)
  return children;
};


function App() {
  // State to track the current user (derived from systemContext)
  // This state is updated by the ProtectedRoute component's listener
  const [currentUser, setCurrentUser] = useState<User | null>(systemContext?.currentUser);

  useEffect(() => {
      // Subscribe to auth state changes from the global systemContext
      // This ensures the App component re-renders when the user logs in or out
      let unsubscribe: (() => void) | undefined;
      if (systemContext?.securityService) {
          unsubscribe = systemContext.securityService.onAuthStateChange((user: User | null) => {
              setCurrentUser(user);
          });
      }

      return () => {
          // Unsubscribe on component unmount
          unsubscribe?.();
      };
  }, [systemContext?.securityService]); // Re-run effect if securityService changes


  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-neutral-100"> {/* Basic dark mode background */}
        {/* Render Navbar only if user is logged in */}
        {currentUser && <Navbar />}

        <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/knowledge"
              element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              }
            />
             <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <KnowledgeCollections />
                </ProtectedRoute>
              }
            />
             <Route
              path="/collections/:collectionId"
              element={
                <ProtectedRoute>
                  <CollectionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scripts"
              element={
                <ProtectedRoute>
                  <Scripts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents"
              element={
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
             <Route
              path="/codexpalace"
              element={
                <ProtectedRoute>
                  <CodexPalace />
                </ProtectedRoute>
              }
            />
             <Route
              path="/securityaudit"
              element={
                <ProtectedRoute>
                  <SecurityAudit />
                </ProtectedRoute>
              }
            />
             <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <Files />
                </ProtectedRoute>
              }
            />
             <Route
              path="/repositories"
              element={
                <ProtectedRoute>
                  <Repositories />
                </ProtectedRoute>
              }
            />
             <Route
              path="/glossary"
              element={
                <ProtectedRoute>
                  <Glossary />
                </ProtectedRoute>
              }
            />
             <Route
              path="/flows"
              element={
                <ProtectedRoute>
                  <AgenticFlows />
                </ProtectedRoute>
              }
            />
             <Route
              path="/flows/:flowId"
              element={
                <ProtectedRoute>
                  <AgenticFlowDetail />
                </ProtectedRoute>
              }
            />
             <Route
              path="/flows/:flowId/edit"
              element={
                <ProtectedRoute>
                  <AgenticFlowEditor />
                </ProtectedRoute>
              }
            />
             <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
             <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
             <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
             <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
             <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              }
            />
             <Route
              path="/sync"
              element={
                <ProtectedRoute>
                  <Sync />
                </ProtectedRoute>
              }
            />
             <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />


            {/* Redirect any other path to the dashboard if logged in, or auth if not */}
            <Route
              path="*"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```