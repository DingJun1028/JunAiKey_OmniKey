```typescript
// src/pages/Users.tsx
// Users Page
// Displays a list of users in the system.
// --- New: Add UI for listing users and their profile info ---\
// --- New: Add Realtime Updates for Users and Profiles ---\

import React, { useEffect, useState } from 'react';
import { SecurityService } from '../core/security/SecurityService';
import { User } from '../interfaces';
import { User as UserIcon, ChevronDown, ChevronUp, Zap, CalendarDays, Clock, Mail, Info, Loader2 } from 'lucide-react'; // Import icons\
\
// Access core modules from the global window object (for MVP simplicity)\
// In a real app, use React Context or dependency injection\
declare const window: any;\
const securityService: SecurityService = window.systemContext?.securityService; // The Security Service (\u5b89\u5168\u670d\u52d9) pillar\
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)\
const systemContext: any = window.systemContext; // Access the full context for currentUser\
\
\
const Users: React.FC = () => {\
  const [users, setUsers] = useState<User[]>([]);\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState<string | null>(null);\
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({}); // State to track expanded users\
\
\
  const fetchUsers = async () => {\
       const userId = systemContext?.currentUser?.id;\
       if (!securityService || !userId) {\
            setError(\"SecurityService module not initialized or user not logged in.\");\
            setLoading(false);\
            return;\
        }\
      setLoading(true);\
      setError(null);\
      try {\
          // Fetch all users from SecurityService (requires appropriate permissions)\
          // NOTE: In a real app, this should be restricted to admin users.\
          // For MVP, SecurityService.listUsers() is accessible if authenticated.\
          const allUsers = await securityService.listUsers(); // Pass user ID implicitly via context\
          setUsers(allUsers);\
      } catch (err: any) {\
          console.error('Error fetching users:', err);\
          setError(`Failed to load users: ${err.message}`);\
      } finally {\
          setLoading(false);\
      }\
  };\
\
  useEffect(() => {\
    // Fetch data when the component mounts or when the user changes\
    if (systemContext?.currentUser?.id) {\
        fetchUsers(); // Fetch all users on initial load\
    }\
\
    // --- New: Subscribe to realtime updates for auth.users and profiles ---\\\
    let unsubscribeUserUpdates: (() => void) | undefined;\\\
    let unsubscribeProfileUpdates: (() => void) | undefined;\\\
\
    if (securityService?.supabase) { // Check if SecurityService and its Supabase client are available\\\
        const supabase = securityService.supabase;\\\
        const userId = systemContext?.currentUser?.id; // Get current user ID\\\
\
        // Subscribe to auth.users updates (basic user info like email, last_sign_in_at)\\\
        // Note: RLS on auth.users is complex. Subscribing to all changes might not be feasible.\\\
        // Rely on RLS and subscribe to changes where user_id matches current user, or if you have admin RLS.\\\
        // For MVP, let's simulate subscribing to changes relevant to the current user or all if admin.\\\
        // A more robust approach might involve a dedicated 'user_updates' channel or function.\\\
\
        // For simplicity in MVP, let's just refetch the list on any potential user/profile change event.\\\
        // A better approach would be to merge changes into the state.\\\
\
        // Subscribe to profile updates (name, avatar, rune_capacity)\\\
        // RLS on profiles should filter by user_id.\\\
        unsubscribeProfileUpdates = supabase\\\
             .channel('profiles') // Subscribe to all changes on the table (RLS will filter)\\\
             .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async (payload) => { // No filter here, rely on RLS\\\
                 console.log('Users page received profile realtime change:', payload);\\\
                 // Refetch the entire user list to get the latest profile data\\\
                 fetchUsers();\\\
             })\\\
             .subscribe((status, err) => {\\\
                  console.log('[Users Page] Profile subscription status:', status);\\\
                  if (status === 'CHANNEL_ERROR') {\\\
                      console.error('[Users Page] Profile subscription error:', err);\\\
                  }\\\
             });\\\
\\n         // Note: Subscribing to auth.users changes directly is often not recommended client-side\\\n         // due to RLS complexities and potential data exposure. Relying on profile updates\\\n         // and the onAuthStateChange listener in App.tsx/main.tsx is usually sufficient.\\\n         // If needed, you could subscribe to auth.users changes filtered by auth.uid() if RLS allows.\\\n\\n    }\\\n    // --- End New ---\\\n\\n\\\n    return () => {\\\n        // Unsubscribe on component unmount\\\n        unsubscribeUserUpdates?.();\\\n        unsubscribeProfileUpdates?.();\\\n    };\\\n\n  }, [systemContext?.currentUser?.id, securityService]); // Re-run effect when user ID or service changes\n\n\n\n    const toggleExpandUser = (userId: string) => {\n        setExpandedUsers(prevState => ({\n            ...prevState,\n            [userId]: !prevState[userId]\n        }));\n    };\n\n\n\n   // Ensure user is logged in before rendering content\n  if (!systemContext?.currentUser) {\n       // This case should ideally be handled by ProtectedRoute, but as a fallback:\n       return (\n            <div className=\"container mx-auto p-4 flex justify-center\">\n               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\n                   <p>Please log in to view users.</p>\n               </div>\n            </div>\n       );\n  }\n\n\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\n        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">User Management (\u5b89\u5168\u670d\u52d9)</h2>\n        <p className=\"text-neutral-300 mb-8\">View and manage users in your Jun.Ai.Key system.</p>\n\n        {/* User List */}\n        <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\n            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">System Users</h3>\n            {loading ? (\n              <p className=\"text-neutral-400\">Loading users...</p>\n            ) : error ? (\n                 <p className=\"text-red-400\">Error: {error}</p>\n            ) : users.length === 0 ? (\n              <p className=\"text-neutral-400\">No users found in the system.</p>\n            ) : (\n              <ul className=\"space-y-4\">\
                {users.map((user) => (\
                  <li key={user.id} className=\"bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500\">\
                    <div className=\"flex justify-between items-center mb-2\">\
                        <div className=\"flex items-center gap-3\">\
                            <UserIcon size={20} className=\"text-blue-400\"/>\
                            <h4 className=\"font-semibold text-blue-200\">{user.name || user.email}</h4>\
                        </div>\
                         <button onClick={() => toggleExpandUser(user.id)} className=\"text-neutral-400 hover:text-white transition\">\
                            {expandedUsers[user.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                         </button>\
                    </div>\
                    <p className=\"text-neutral-300 text-sm mb-2\">Email: {user.email}</p>\
                    <p className=\"text-neutral-300 text-sm mb-2\">Role: {user.role}</p>\
                    {user.rune_capacity !== undefined && (\
                         <p className=\"text-neutral-300 text-sm mb-2 flex items-center gap-1\">\
                             <Zap size={16} className=\"text-purple-400\"/>\
                             Rune Capacity: <span className=\"font-mono text-purple-300\">{user.rune_capacity}</span> units\
                         </p>\
                    )}\
                    <small className=\"text-neutral-400 text-xs block mt-1\">\
                        ID: {user.id}\
                         {user.created_at && ` | Created: ${new Date(user.created_at).toLocaleString()}`}\
                         {user.last_sign_in_at && ` | Last Sign In: ${new Date(user.last_sign_in_at).toLocaleString()}`}\
                    </small>\
\
                    {/* User Details (Collapsible) */}\
                    {expandedUsers[user.id] && ((\
                        <div className=\"mt-4 border-t border-neutral-600 pt-4\">\
                            <h5 className=\"text-neutral-300 text-sm font-semibold mb-2\">Details:</h5>\
                            <div className=\"bg-neutral-800 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-600\">\
                                {/* Display full user object for debugging/details */}\
                                <pre>{JSON.stringify(user, null, 2)}</pre>\
                            </div>\
\
                            {/* TODO: Add more specific details like linked accounts, permissions, etc. */}\
\
                        </div>\
                    ))}\
\
                    {/* User Actions (Placeholders) */}\
                    <div className=\"mt-4 flex flex-wrap gap-2\"> {/* Use flex-wrap for smaller screens */}\
                         {/* TODO: Add buttons for View Details, Edit Profile, Reset Password, Delete User, Manage Roles */}\
                         {/* These actions should be restricted based on the current user's permissions (e.g., only admin can delete/manage roles) */}\
                         {/* Example: Edit Button */}\
                         {/* {systemContext?.currentUser?.role === 'admin' && (\
                             <button className=\"px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed\" disabled>Edit (TODO)</button>\
                         )} */}\
                         {/* Example: Delete Button */}\
                         {/* {systemContext?.currentUser?.role === 'admin' && (\
                             <button className=\"px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\" disabled>Delete (TODO)</button>\
                         )} */}\
                         {/* Example: Manage Roles Button */}\
                         {/* {systemContext?.currentUser?.role === 'admin' && (\
                             <button className=\"px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed\" disabled>Manage Roles (TODO)</button>\
                         )} */}\
                    </div>\
                  </li>\
                ))}\
              </ul>\
            )}\
        </div>\
\
      </div>\
    </div>\
  );\
};\
\
export default Users;\
```