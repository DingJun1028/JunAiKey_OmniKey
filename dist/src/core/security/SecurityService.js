"use strict";
`` `typescript
// src/core/security/SecurityService.ts
// \u5b89\u5168\u670d\u52d9 (Security Service) - \u6838\u5fc3\u6a21\u7d44
// Handles authentication, authorization (RBAC/ABAC), and data security.
// --- New: Implement Data Integrity Check (Codex Guardian) ---\
// --- New: Implement Secure Storage for Sensitive Data (Codex Restricted Zone) ---\
// --- New: Implement Security Monitoring (Defense Aura) ---\
// --- New: Implement Security Event Auditing (Reliving the Past) ---\
// --- New: Implement Emergency Response (Apocalypse Codex) ---\
// --- Modified: Implement Secure Storage/Retrieval using Supabase (Simulated Encryption) ---\
// --- New: Implement User Listing (Admin/Security Feature) ---\
// --- New: Implement Integration Linking/Unlinking (Simulated) ---\
// --- New: Implement Sync Config Management (Simulated) ---\
// --- New: Implement User Data Reset ---\
// --- New: Implement Data Backup (Codex Backup) ---\
// --- New: Implement Data Mirroring (Mirror Codex) ---\


import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User, SystemContext, CloudSyncConfig, BoostSpaceSyncConfig, SensitiveDataEntry, SystemEvent, UserAction } from '../../interfaces'; // Import CloudSyncConfig, BoostSpaceSyncConfig, SensitiveDataEntry, SystemEvent, UserAction

// Define the type for the auth state change listener callback
type AuthStateChangeCallback = (user: User | null) => void;

export class SecurityService {
    private supabase: SupabaseClient;
    private context: SystemContext;
    private authStateChangeListeners: AuthStateChangeCallback[] = [];

    // --- New: In-memory placeholder for linked integrations ---\
    // In a real app, this would be fetched from a secure DB table (e.g., user_integrations)\
    // and potentially store encrypted credentials or OAuth tokens.\
    private simulatedLinkedIntegrations: Record<string, { status: 'linked' | 'unlinked' | 'error', details?: any }> = {};\
    // --- End New ---\

    // --- New: In-memory placeholder for user sync configurations ---\
    // In a real app, this would be fetched from user settings in the DB (e.g., profiles or user_settings table)\
    private simulatedSyncConfigs: Record<string, CloudSyncConfig> = {};\
    // --- End New ---\

    // --- New: In-memory placeholder for sensitive data (Simulated Secure Storage) ---\
    // In a real app, this would be stored encrypted in a DB table with strict RLS.\
    // For MVP, we simulate encryption and use an in-memory map.\
    private simulatedSensitiveData: Map<string, Map<string, SensitiveDataEntry>> = new Map(); // Map: userId -> Map: key -> SensitiveDataEntry\
    // --- End New ---\


    // --- New: Realtime Subscription ---\
    // Store subscriptions per table to manage them.\
    private realtimeSubscriptions: Map<string, any> = new Map();\
    // --- End New ---\


    constructor(context: SystemContext) {
        this.context = context;
        // Ensure Supabase URL and Key are available
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Supabase URL and ANON Key must be set in environment variables.");
            // In a real app, you might throw an error or handle this more gracefully
             throw new Error("Supabase credentials not loaded. Check .env file and environment variables.");
        }

        this.supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
        console.log('SecurityService initialized with Supabase Auth.');

        // Set up Supabase Auth listener
        this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            console.log('[SecurityService] Auth state changed:', event, session);
            const user = session?.user ? this.mapSupabaseUserToUserInterface(session.user) : null;

            // Update the context's currentUser
            this.context.currentUser = user;

            // Notify all registered listeners
            this.authStateChangeListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('[SecurityService] Error in auth state change listener:', error);
                    this.context.loggingService?.logError('Error in auth state change listener', { error: error });
                }
            });

            this.context.loggingService?.logInfo(`;
Auth;
state;
changed: $;
{
    event;
}
`, { userId: user?.id });

            // --- New: Load user-specific linked integrations and sync config on login ---\
            if (user) {
                 this.loadLinkedIntegrations(user.id).catch(err => console.error('Failed to load linked integrations on login:', err));
                 this.loadSyncConfig(user.id).catch(err => console.error('Failed to load sync config on login:', err)); // Load sync config
                 // --- Modified: Load user-specific sensitive data on login ---\
                 this.loadSensitiveData(user.id).catch(err => console.error('Failed to load sensitive data on login:', err));
                 // --- End Modified ---\

                 // --- New: Start security monitoring for the logged-in user ---\
                 this.startSecurityMonitoring(user.id).catch(err => console.error('Failed to start security monitoring on login:', err));\
                 // --- End New ---\

            } else {
                this.stopSecurityMonitoring(); // Stop monitoring on logout
                // Clear user-specific state on logout
                this.simulatedLinkedIntegrations = {};
                // TODO: Clear simulatedSyncConfigs for the logged-out user if managing multiple users in memory
                // For MVP, we assume a single user session, so clearing all is fine.
                this.simulatedSyncConfigs = {};
                // --- Modified: Clear user-specific sensitive data from memory on logout ---\
                // This is now handled by loadSensitiveData on logout (it fetches 0 records)\
                // Or you could explicitly clear the in-memory map if not using DB persistence for MVP\
                this.simulatedSensitiveData.clear(); // If using in-memory map\
                // --- End Modified ---\
                // TODO: Publish events for state changes if needed by UI
            }
            // --- End New ---\
        });

        // Immediately check the current session state on initialization
        this.checkCurrentSession();
    }

    /**
     * Maps a Supabase User object to the internal User interface.\
     * Includes data from the 'profiles' table if available.\
     * @param supabaseUser The user object from Supabase Auth.\
     * @param profileData Optional profile data from the 'profiles' table.\
     * @returns The mapped User object.\
     */\
    private mapSupabaseUserToUserInterface(supabaseUser: any, profileData?: any): User {
        return {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profileData?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email, // Use profile name, then metadata name, then email
            avatarUrl: profileData?.avatar_url || supabaseUser.user_metadata?.avatar_url,
            role: supabaseUser.role || 'authenticated', // Default role
            rune_capacity: profileData?.rune_capacity, // Include rune capacity from profile
            // Add other profile fields here
            created_at: supabaseUser.created_at, // Include creation timestamp from auth.users
            last_sign_in_at: supabaseUser.last_sign_in_at, // Include last sign in timestamp
        } as User; // Cast to User interface
    }

    /**
     * Checks the current Supabase session and updates the context.\
     */\
    private async checkCurrentSession(): Promise<void> {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) {
                console.error('[SecurityService] Error getting session:', error.message);
                this.context.loggingService?.logError('Error getting Supabase session', { error: error.message });
                this.context.currentUser = null;
            } else {
                // Fetch profile data for the current user if session exists
                let profileData = null;
                if (session?.user) {
                    try {
                        const { data: profile, error: profileError } = await this.supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();
                        if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore 'not found' error
                        profileData = profile;
                    } catch (profileFetchError: any) {
                        console.error('[SecurityService] Error fetching user profile:', profileFetchError.message);
                        this.context.loggingService?.logError('Error fetching user profile', { userId: session.user.id, error: profileFetchError.message });
                    }
                }
                this.context.currentUser = session?.user ? this.mapSupabaseUserToUserInterface(session.user, profileData) : null;
                console.log('[SecurityService] Initial session check complete. User:', this.context.currentUser?.id);
                this.context.loggingService?.logInfo('Initial session check complete', { userId: this.context.currentUser?.id });

                // --- New: Load user-specific linked integrations and sync config on initial session check ---\
                if (this.context.currentUser) {
                     this.loadLinkedIntegrations(this.context.currentUser.id).catch(err => console.error('Failed to load linked integrations on initial session check:', err));
                     this.loadSyncConfig(this.context.currentUser.id).catch(err => console.error('Failed to load sync config on initial session check:', err)); // Load sync config
                     // --- Modified: Load user-specific sensitive data on initial session check ---\
                     this.loadSensitiveData(this.context.currentUser.id).catch(err => console.error('Failed to load sensitive data on initial session check:', err));
                     // --- End Modified ---\

                     // --- New: Start security monitoring for the logged-in user ---\
                     this.startSecurityMonitoring(this.context.currentUser.id).catch(err => console.error('Failed to start security monitoring on initial session check:', err));\
                     // --- End New ---\
                }
                // --- End New ---\
            }
        } catch (error: any) {
             console.error('[SecurityService] Unexpected error during session check:', error.message);
             this.context.loggingService?.logError('Unexpected error during session check', { error: error.message });
             this.context.currentUser = null;
        }
    }


    /**
     * Handles user login with email and password using Supabase Auth.\
     * @param email User email.\
     * @param password User password.\
     * @returns Promise<User | null> The authenticated user or null on failure.\
     */\
    async login(email: string, password: string): Promise<User | null> {
        console.log(`[SecurityService];
Attempting;
login;
for ($; { email }; )
    ;
`);
        this.context.loggingService?.logInfo(`;
Login;
attempt;
for ($; { email } `);

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('[SecurityService] Login failed:', error.message);
                this.context.loggingService?.logError(`; Login)
    failed;
for ($; { email } `, { error: error.message });

                // --- New: Record login failure event ---\
                this.recordSecurityEvent('auth_login_failed', { email, error: error.message }, null, 'warning'); // No user_id on failure\
                // --- End New ---\

                // Supabase login method handles errors internally and returns null on failure
                throw error; // Re-throw the error for the caller to handle (e.g., display error message)
            }

            // Supabase auth listener will handle updating currentUser on successful login
            console.log('[SecurityService] Login request successful (waiting for auth state change).');

            // --- New: Record login success event ---\
            if (data.user) {
                 this.recordSecurityEvent('auth_login_success', { email, userId: data.user.id }, data.user.id, 'info');
            }
            // --- End New ---\

            // Return the user data from the response, but the source of truth is the listener updating context.currentUser
            // Note: Profile data is fetched by the auth state listener after session is set.
            return data.user ? this.mapSupabaseUserToUserInterface(data.user) : null;

        } catch (error: any) {
            console.error('[SecurityService] Error during login:', error.message);
            this.context.loggingService?.logError(`; Error)
    during;
login;
for ($; { email } `, { error: error.message });
            // If an error occurred before the Supabase error object was available (e.g., network error)
            // record a generic login failure event.
            this.recordSecurityEvent('auth_login_failed', { email, error: error.message }, null, 'warning');
            throw error;
        }
    }

    /**
     * Handles user login with Google using Supabase Auth (Placeholder).\
     * @returns Promise<void> (OAuth typically involves redirects, so no direct user return)\
     */\
    async loginWithGoogle(): Promise<void> {
        console.log('[SecurityService] Initiating login with Google...');
        this.context.loggingService?.logInfo('Initiating login with Google');

        // --- New: Record Google login initiation event ---\
        const userId = this.context.currentUser?.id; // Get user ID if already logged in (less likely for login)\
        this.recordSecurityEvent('auth_google_login_initiated', { userId }, userId, 'info');
        // --- End New ---\


        try {
            // TODO: Implement actual Supabase Auth signInWithOAuth({ provider: 'google' })
            // This will likely cause a redirect.
            // const { data, error } = await this.supabase.auth.signInWithOAuth({
            //     provider: 'google',
            //     // options: { redirectTo: 'YOUR_REDIRECT_URL' } // Optional: specify redirect URL
            // });
            // if (error) {
            //     console.error('[SecurityService] Google login initiation failed:', error.message);
            //     this.context.loggingService?.logError('Google login initiation failed', { error: error.message });
            //     // Record failure event
            //     this.recordSecurityEvent('auth_google_login_failed', { error: error.message }, userId, 'warning');
            //     throw error;
            // }
            // console.log('[SecurityService] Google login initiation successful (redirecting...).');
            // Record success initiation event (actual success is on auth state change)
            // this.recordSecurityEvent('auth_google_login_initiation_success', { userId }, userId, 'info');


            // Simulate initiation for MVP
             console.log('[SecurityService] Simulated Google login initiation.');
             this.context.loggingService?.logInfo('Simulated Google login initiation');
             alert("Simulating Google Login. In a real app, this would redirect you to Google.");


        } catch (error: any) {
            console.error('[SecurityService] Error initiating Google login:', error.message);
            this.context.loggingService?.logError('Error initiating Google login', { error: error.message });
            // Record initiation failure event
            this.recordSecurityEvent('auth_google_login_failed', { error: error.message }, userId, 'warning');
            throw error;
        }
    }

     /**
     * Handles user login with GitHub using Supabase Auth (Placeholder).\
     * @returns Promise<void> (OAuth typically involves redirects, so no direct user return)\
     */\
    async loginWithGitHub(): Promise<void> {
        console.log('[SecurityService] Initiating login with GitHub...');
        this.context.loggingService?.logInfo('Initiating login with GitHub');

        // --- New: Record GitHub login initiation event ---\
        const userId = this.context.currentUser?.id; // Get user ID if already logged in\
        this.recordSecurityEvent('auth_github_login_initiated', { userId }, userId, 'info');
        // --- End New ---\

        try {
            // TODO: Implement actual Supabase Auth signInWithOAuth({ provider: 'github' })
            // This will likely cause a redirect.
            // const { data, error } = await this.supabase.auth.signInWithOAuth({
            //     provider: 'github',
            //     // options: { redirectTo: 'YOUR_REDIRECT_URL' } // Optional: specify redirect URL
            // });
            // if (error) {
            //     console.error('[SecurityService] GitHub login initiation failed:', error.message);
            //     this.context.loggingService?.logError('GitHub login initiation failed', { error: error.message });
            //     // Record failure event
            //     this.recordSecurityEvent('auth_github_login_failed', { error: error.message }, userId, 'warning');
            //     throw error;
            // }
            // console.log('[SecurityService] GitHub login initiation successful (redirecting...).');
            // Record success initiation event (actual success is on auth state change)
            // this.recordSecurityEvent('auth_github_login_initiation_success', { userId }, userId, 'info');


            // Simulate initiation for MVP
             console.log('[SecurityService] Simulated GitHub login initiation.');
             this.context.loggingService?.logInfo('Simulated GitHub login initiation');
             alert("Simulating GitHub Login. In a real app, this would redirect you to GitHub.");


        } catch (error: any) {
            console.error('[SecurityService] Error initiating GitHub login:', error.message);
            this.context.loggingService?.logError('Error initiating GitHub login', { error: error.message });
            // Record initiation failure event
            this.recordSecurityEvent('auth_github_login_failed', { error: error.message }, userId, 'warning');
            throw error;
        }
    }


    /**
     * Handles user signup with email and password using Supabase Auth.\
     * @param email User email.\
     * @param password User password.\
     * @returns Promise<User | null> The signed-up user or null on failure.\
     */\
    async signup(email: string, password: string): Promise<User | null> {
        console.log(`[SecurityService]; Attempting)
    signup;
for ($; { email }; )
    ;
`);
        this.context.loggingService?.logInfo(`;
Signup;
attempt;
for ($; { email } `);

        try {
            const { data, error } = await this.supabase.auth.signUp({ email, password });

            if (error) {
                console.error('[SecurityService] Signup failed:', error.message);
                this.context.loggingService?.logError(`; Signup)
    failed;
for ($; { email } `, { error: error.message });

                // --- New: Record signup failure event ---\
                this.recordSecurityEvent('auth_signup_failed', { email, error: error.message }, null, 'warning'); // No user_id on failure\
                // --- End New ---\

                throw error; // Re-throw the error
            }

            // Supabase auth listener will handle updating currentUser on successful signup (if auto-login is enabled)
            // Note: Email confirmation might be required depending on Supabase settings.
            console.log('[SecurityService] Signup request successful (check email for confirmation).');

            // --- New: Record signup success event ---\
            if (data.user) {
                 this.recordSecurityEvent('auth_signup_success', { email, userId: data.user.id }, data.user.id, 'info');
            }
            // --- End New ---\

            // Return the user data from the response
            return data.user ? this.mapSupabaseUserToUserInterface(data.user) : null;

        } catch (error: any) {
            console.error('[SecurityService] Error during signup:', error.message);
            this.context.loggingService?.logError(`; Error)
    during;
signup;
for ($; { email } `, { error: error.message });
            // If an error occurred before the Supabase error object was available
            this.recordSecurityEvent('auth_signup_failed', { email, error: error.message }, null, 'warning');
            throw error;
        }
    }

    /**
     * Handles user logout using Supabase Auth.\
     * @returns Promise<void>\
     */\
    async logout(): Promise<void> {
        console.log('[SecurityService] Attempting logout...');
        this.context.loggingService?.logInfo('Logout attempt');

        const userId = this.context.currentUser?.id; // Get user ID before logging out

        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                console.error('[SecurityService] Logout failed:', error.message);
                this.context.loggingService?.logError('Logout failed', { userId, error: error.message });

                // --- New: Record logout failure event ---\
                this.recordSecurityEvent('auth_logout_failed', { userId, error: error.message }, userId, 'warning');
                // --- End New ---\

                throw error; // Re-throw the error
            }

            // Supabase auth listener will handle updating currentUser to null
            console.log('[SecurityService] Logout successful.');

            // --- New: Record logout success event ---\
            this.recordSecurityEvent('auth_logout_success', { userId }, userId, 'info');
            // --- End New ---\

        } catch (error: any) {
            console.error('[SecurityService] Error during logout:', error.message);
            this.context.loggingService?.logError('Error during logout', { userId, error: error.message });
            // If an error occurred before the Supabase error object was available
            this.recordSecurityEvent('auth_logout_failed', { userId, error: error.message }, userId, 'warning');
            throw error;
        }
    }

    /**
     * Adds a listener for authentication state changes.\
     * @param callback The callback function to execute when auth state changes.\
     * @returns A function to unsubscribe the listener.\
     */\
    onAuthStateChange(callback: AuthStateChangeCallback): () => void {
        this.authStateChangeListeners.push(callback);
        // Immediately call the callback with the current user state
        callback(this.context.currentUser);

        // Return an unsubscribe function
        return () => {
            this.authStateChangeListeners = this.authStateChangeListeners.filter(listener => listener !== callback);
        };
    }

    /**
     * Checks if the current user has a specific permission.\
     * This is a placeholder for a more robust RBAC/ABAC system.\
     * @param permission The permission string (e.g., 'read:knowledge', 'execute:rune:github-rune:listRepos'). Required.\
     * @param context Optional context for attribute-based access control (e.g., { resourceId: '...' }).\
     * @returns boolean True if the user has the permission, false otherwise.\
     */\
    hasPermission(permission: string, context?: any): boolean {
        // For MVP, assume authenticated users have all permissions.
        // In a real app, this would check user roles, permissions table, resource ownership, etc.
        const isAuthenticated = this.context.currentUser !== null;
        console.log(`[SecurityService]; Checking)
    permission: $;
{
    permission;
}
for (user; $; { this: .context.currentUser?.id }.Authenticated)
    : $;
{
    isAuthenticated;
}
`);
        this.context.loggingService?.logDebug(`;
Checking;
permission: $;
{
    permission;
}
`, { userId: this.context.currentUser?.id, permission, context, isAuthenticated });

        // --- New: Basic permission checks for MVP ---\
        // Allow public runes/abilities to be listed without auth\
        if (permission === 'list:runes' && context?.isPublicOnly) {
             return true; // Allow listing public runes without auth
        }
         if (permission === 'list:abilities' && context?.isPublicOnly) {
             return true; // Allow listing public abilities without auth
         }

        // Require authentication for most operations
        if (!isAuthenticated) {
             console.warn(`[SecurityService];
Permission;
denied: User;
not;
authenticated;
for ($; { permission }. `);
             this.context.loggingService?.logWarning(`; Permission)
    denied: Not;
authenticated `, { userId: this.context.currentUser?.id, permission, context });
             return false;
        }

        // TODO: Implement more granular checks based on roles, resource ownership (user_id match), etc.
        // Example: Check if the user owns the resource being accessed (e.g., task, goal, private knowledge record)
        // if (context?.resourceUserId && context.resourceUserId !== this.context.currentUser.id) {
        //      console.warn(`[SecurityService];
Permission;
denied: User;
$;
{
    this.context.currentUser.id;
}
does;
not;
own;
resource;
$;
{
    context.resourceId;
}
(owner, { context, resourceUserId }) => ;
for ($; { permission }. `);
        //      this.context.loggingService?.logWarning(`; Permission)
    denied: Resource;
ownership;
mismatch `, { userId: this.context.currentUser.id, permission, context });
        //      return false;
        // }

        // For MVP, if authenticated and no specific denial logic, grant permission.
        return true;
    }

    /**
     * Records a security-relevant system event.\
     * Part of the Reliving the Past (Audit) concept.\
     * @param type The type of security event (e.g., 'auth_login_success', 'auth_login_failed', 'data_access_denied', 'sensitive_data_accessed'). Required.\
     * @param details Optional details about the event.\
     * @param userId Optional user ID associated with the event.\
     * @param severity Optional severity ('info', 'warning', 'error'). Defaults to 'info'.\
     * @returns Promise<void>\
     */\
    async recordSecurityEvent(type: string, details?: any, userId?: string | null, severity: SystemEvent['severity'] = 'info'): Promise<void> {
        console.log(`[SecurityService];
Recording;
security;
event: $;
{
    type;
}
(Severity, { severity }) => ;
for (user; ; )
    : $;
{
    userId || 'N/A';
}
`);
        // Use LoggingService to persist the event
        // LoggingService is configured to save SystemEvents to the 'system_events' table.
        // We use a specific type 'security_event_recorded' to distinguish these in the logs.
        const eventPayload: Omit<SystemEvent, 'id' | 'timestamp'> = {
            type: 'security_event_recorded', // Use a consistent type for audit logs
            payload: { // Wrap original type and details in payload
                originalType: type,
                details: details,
            },
            user_id: userId || null, // Ensure null for unauthenticated events
            context: { // Add context about where the event was recorded
                service: 'SecurityService',
                // Add other context like IP address, device info if available
            },
            severity: severity,
        };

        try {
            // Call LoggingService to log the event
            // LoggingService handles timestamp and persistence.
            this.context.loggingService?.logInfo(`;
Security;
Event: $;
{
    type;
}
`, eventPayload, userId || undefined); // Use logInfo for persistence
            console.log('[SecurityService] Security event recorded.');
        } catch (error: any) {
            console.error('[SecurityService] Failed to record security event:', error.message);
            // Log the failure itself, but don't re-throw to avoid disrupting the original operation.
            this.context.loggingService?.logError('Failed to record security event', { originalEventType: type, userId, error: error.message });
        }
    }

    // --- New: Implement Data Integrity Check (Codex Guardian) ---\
    /**
     * Performs a data integrity check for a specific user.\
     * Part of the Codex Guardian concept.\
     * @param userId The user ID to check data for. Required.\
     * @returns Promise<any> The results of the integrity check.\
     */\
    async checkDataIntegrity(userId: string): Promise<any> {
        console.log(`[SecurityService];
Initiating;
data;
integrity;
check;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Initiating;
data;
integrity;
check;
for (user; $; { userId } `, { userId });

        if (!userId) {
            console.error('[SecurityService] Cannot initiate integrity check: User ID is required.');
            this.context.loggingService?.logError('Cannot initiate integrity check: User ID is required.');
            throw new Error('User ID is required to initiate integrity check.');
        }

        // --- Simulate Integrity Check Process ---\
        // This is a placeholder. A real check would involve:\
        // 1. Fetching data from various tables (Knowledge Records, Tasks, Flows, etc.).\
        // 2. Performing checks for inconsistencies (e.g., orphaned task steps, invalid node/edge references in flows, missing linked KRs).\
        // 3. Comparing data across synced locations if applicable (e.g., local vs cloud).\
        // 4. Verifying data structure against schemas.\
        // 5. Checking for unexpected data modifications (requires versioning or audit trails).\

        this.context.eventBus?.publish('data_integrity_check_started', { userId }, userId); // Publish event

        console.log(`[SecurityService])
    Simulating;
data;
integrity;
check;
for (user; ; )
    : $;
{
    userId;
}
`);
        // Simulate check time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate results (success, warning, or error)
        const checkStatus = Math.random() > 0.8 ? 'error' : Math.random() > 0.5 ? 'warning' : 'success';
        let resultMessage = `;
Data;
integrity;
check;
completed;
with (status)
    : $;
{
    checkStatus;
}
`;
        const issuesFound: any[] = [];

        if (checkStatus === 'warning') {
            resultMessage = 'Data integrity check found minor warnings.';
            issuesFound.push({ type: 'warning', message: 'Simulated minor inconsistency found in task steps.' });
        } else if (checkStatus === 'error') {
            resultMessage = 'Data integrity check found critical errors.';
            issuesFound.push({ type: 'error', message: 'Simulated critical error: Orphaned flow node detected.' });
            issuesFound.push({ type: 'warning', message: 'Simulated warning: Duplicate knowledge record found.' });
        }

        const checkResults = {
            status: checkStatus,
            message: resultMessage,
            timestamp: new Date().toISOString(),
            counts: { // Simulated counts
                totalRecords: 100,
                tasks: 20,
                flows: 5,
                issuesFound: issuesFound.length,
            },
            issues: issuesFound,
        };

        console.log(`[SecurityService];
Simulated;
data;
integrity;
check;
complete;
for (user; ; )
    : $;
{
    userId;
}
Status: $;
{
    checkStatus;
}
`);
        this.context.loggingService?.logInfo(`;
Simulated;
data;
integrity;
check;
complete;
for (user; $; { userId } `, { userId, status: checkStatus, issuesCount: issuesFound.length });

        // Record the integrity check event
        this.recordSecurityEvent('data_integrity_check_completed', { userId, status: checkStatus, issuesCount: issuesFound.length }, userId, checkStatus === 'error' ? 'error' : checkStatus === 'warning' ? 'warning' : 'info')
            .catch(err => console.error('Error recording integrity check event:', err));

        // Publish event with results
        this.context.eventBus?.publish('data_integrity_check_completed', { userId, results: checkResults }, userId); // Publish event

        return checkResults;
    }
    // --- End New ---\

    // --- New: Implement Secure Storage for Sensitive Data (Codex Restricted Zone) ---\
    /**
     * Stores sensitive data securely for a specific user.\
     * Part of the Codex Restricted Zone concept.\
     * In a real app, this would involve encryption before storing in a DB table with strict RLS.\
     * For MVP, simulates encryption and uses an in-memory map.\
     * @param userId The user ID. Required.\
     * @param key A unique key for this data (e.g., 'openai_api_key', 'github_pat'). Required.\
     * @param data The sensitive data to store (can be string, object, etc.). Required.\
     * @returns Promise<void>\
     */\
    async storeSensitiveData(userId: string, key: string, data: any): Promise<void> {
        console.log(`[SecurityService])
    Storing;
sensitive;
data;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
store;
sensitive;
data;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

        if (!userId || !key || data === undefined) {
            console.error('[SecurityService] Cannot store sensitive data: User ID, key, and data are required.');
            this.context.loggingService?.logError('Cannot store sensitive data: Missing required fields.', { userId, key });
            throw new Error('User ID, key, and data are required to store sensitive data.');
        }

        // --- Simulate Encryption and Storage ---\
        // In a real app, use a strong encryption library (e.g., Node.js crypto, Web Crypto API)\
        // and manage encryption keys securely (e.g., KMS, user password-derived key).\
        // Store the encrypted data in a database table with RLS.\

        const simulatedEncryptedData = `;
ENCRYPTED($, { key }, $, { JSON, : .stringify(data) }) `; // Simple simulation

        const sensitiveDataEntry: SensitiveDataEntry = {
            key: key,
            encrypted_data: simulatedEncryptedData,
            timestamp: new Date().toISOString(),
            // Add other metadata like encryption algorithm, key ID
        };

        // Store in in-memory map (for MVP)
        if (!this.simulatedSensitiveData.has(userId)) {
            this.simulatedSensitiveData.set(userId, new Map());
        }
        this.simulatedSensitiveData.get(userId)!.set(key, sensitiveDataEntry);

        console.log(`[SecurityService];
Sensitive;
data;
stored;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
        this.context.loggingService?.logInfo(`;
Sensitive;
data;
stored;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

        // Record the security event
        this.recordSecurityEvent('sensitive_data_stored', { userId, key }, userId, 'info')
            .catch(err => console.error('Error recording sensitive data stored event:', err));

        // TODO: Publish an event indicating sensitive data was stored/updated
        // This could trigger UI updates or other processes.
        // this.context.eventBus?.publish('sensitive_data_updated', { userId, key }, userId);
    }

    /**
     * Retrieves sensitive data for a specific user by key.\
     * Part of the Codex Restricted Zone concept.\
     * In a real app, this would involve retrieving encrypted data from DB and decrypting it.\
     * For MVP, simulates decryption and retrieves from in-memory map.\
     * @param userId The user ID. Required.\
     * @param key The key for the sensitive data. Required.\
     * @returns Promise<any | undefined> The sensitive data or undefined if not found.\
     */\
    async retrieveSensitiveData(userId: string, key: string): Promise<any | undefined> {
        console.log(`[SecurityService];
Retrieving;
sensitive;
data;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
retrieve;
sensitive;
data;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

        if (!userId || !key) {
            console.warn('[SecurityService] Cannot retrieve sensitive data: User ID and key are required.');
            this.context.loggingService?.logWarning('Cannot retrieve sensitive data: Missing required fields.', { userId, key });
            return undefined;
        }

        // --- Simulate Retrieval and Decryption ---\
        // In a real app, retrieve from DB and decrypt.\

        const sensitiveDataEntry = this.simulatedSensitiveData.get(userId)?.get(key);

        if (!sensitiveDataEntry) {
            console.warn(`[SecurityService];
Sensitive;
data;
not;
found;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
            this.context.loggingService?.logWarning(`;
Sensitive;
data;
not;
found;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });
            // Record the security event (data not found)
            this.recordSecurityEvent('sensitive_data_access_failed', { userId, key, reason: 'not_found' }, userId, 'warning')
                .catch(err => console.error('Error recording sensitive data access failed event:', err));
            return undefined;
        }

        // Simulate decryption
        const simulatedEncryptedData = sensitiveDataEntry.encrypted_data;
        if (!simulatedEncryptedData.startsWith(`;
ENCRYPTED($, { key }, `) || !simulatedEncryptedData.endsWith(')')) {
             console.error(`[SecurityService], Simulated, decryption, failed);
for (key; ; )
    : $;
{
    key;
}
Invalid;
format. `);
             this.context.loggingService?.logError(`;
Simulated;
decryption;
failed;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });
             // Record the security event (decryption failed)
             this.recordSecurityEvent('sensitive_data_access_failed', { userId, key, reason: 'decryption_failed' }, userId, 'error')
                 .catch(err => console.error('Error recording sensitive data access failed event:', err));
             throw new Error('Failed to decrypt sensitive data.'); // Throw error on decryption failure
        }
        const jsonString = simulatedEncryptedData.substring(`;
ENCRYPTED($, { key }, `.length, simulatedEncryptedData.length - 1);

        try {
            const data = JSON.parse(jsonString);
            console.log(`[SecurityService], Sensitive, data, retrieved, and, decrypted);
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
            this.context.loggingService?.logInfo(`;
Sensitive;
data;
retrieved;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

            // Record the security event (successful access)
            this.recordSecurityEvent('sensitive_data_accessed', { userId, key }, userId, 'info')
                .catch(err => console.error('Error recording sensitive data accessed event:', err));

            return data;
        } catch (parseError: any) {
             console.error(`[SecurityService];
Simulated;
decryption;
failed;
for (key; ; )
    : $;
{
    key;
}
Invalid;
JSON;
format;
after;
decryption. `);
             this.context.loggingService?.logError(`;
Simulated;
decryption;
failed;
for (key; ; )
    : $;
{
    key;
}
(JSON);
parse;
error;
`, { userId, key, error: parseError.message });
             // Record the security event (decryption failed due to format)
             this.recordSecurityEvent('sensitive_data_access_failed', { userId, key, reason: 'decryption_format_error' }, userId, 'error')
                 .catch(err => console.error('Error recording sensitive data access failed event:', err));
             throw new Error('Failed to parse sensitive data after decryption.'); // Throw error
        }
    }

    /**
     * Deletes sensitive data for a specific user by key.\
     * Part of the Codex Restricted Zone concept.\
     * In a real app, this would involve deleting the encrypted data from the DB.\
     * For MVP, simulates deletion from in-memory map.\
     * @param userId The user ID. Required.\
     * @param key The key for the sensitive data. Required.\
     * @returns Promise<boolean> True if deletion was successful, false otherwise.\
     */\
    async deleteSensitiveData(userId: string, key: string): Promise<boolean> {
        console.log(`[SecurityService];
Deleting;
sensitive;
data;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
delete sensitive;
data;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

        if (!userId || !key) {
            console.warn('[SecurityService] Cannot delete sensitive data: User ID and key are required.');
            this.context.loggingService?.logWarning('Cannot delete sensitive data: Missing required fields.', { userId, key });
            return false;
        }

        // --- Simulate Deletion ---\
        const userSensitiveData = this.simulatedSensitiveData.get(userId);
        if (userSensitiveData?.has(key)) {
            userSensitiveData.delete(key);
            console.log(`[SecurityService];
Sensitive;
data;
deleted;
for (user; ; )
    : $;
{
    userId;
}
key: $;
{
    key;
}
`);
            this.context.loggingService?.logInfo(`;
Sensitive;
data;
deleted;
for (key; ; )
    : $;
{
    key;
}
`, { userId, key });

            // Record the security event
            this.recordSecurityEvent('sensitive_data_deleted', { userId, key }, userId, 'info')
                .catch(err => console.error('Error recording sensitive data deleted event:', err));

            // If the user has no more sensitive data, remove their entry from the map
            if (userSensitiveData.size === 0) {
                 this.simulatedSensitiveData.delete(userId);
            }
            return true;
        } else {
            console.warn(`[SecurityService];
Sensitive;
data;
not;
found;
for (deletion; ; )
    for (user; ; )
        : $;
{
    userId;
}
key: $;
{
    key;
}
`);
            this.context.loggingService?.logWarning(`;
Sensitive;
data;
not;
found;
for (deletion; ; )
    for (key; ; )
        : $;
{
    key;
}
`, { userId, key });
            // Record the security event (data not found for deletion)
            this.recordSecurityEvent('sensitive_data_deletion_failed', { userId, key, reason: 'not_found' }, userId, 'warning')
                .catch(err => console.error('Error recording sensitive data deletion failed event:', err));
            return false;
        }
    }

    /**
     * Retrieves a list of keys for sensitive data stored for a user.\
     * Does NOT retrieve the data itself.\
     * Part of the Codex Restricted Zone concept.\
     * For MVP, lists keys from the in-memory map.\
     * @param userId The user ID. Required.\
     * @returns Promise<string[]> An array of keys.\
     */\
    async getSensitiveDataKeys(userId: string): Promise<string[]> {
        console.log(`[SecurityService];
Getting;
sensitive;
data;
keys;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
get;
sensitive;
data;
keys `, { userId });

        if (!userId) {
            console.warn('[SecurityService] Cannot get sensitive data keys: User ID is required.');
            this.context.loggingService?.logWarning('Cannot get sensitive data keys: User ID is required.');
            return [];
        }

        // --- Simulate Retrieval of Keys ---\
        const userSensitiveData = this.simulatedSensitiveData.get(userId);
        const keys = userSensitiveData ? Array.from(userSensitiveData.keys()) : [];

        console.log(`[SecurityService];
Retrieved;
$;
{
    keys.length;
}
sensitive;
data;
keys;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Retrieved;
$;
{
    keys.length;
}
sensitive;
data;
keys `, { userId, keysCount: keys.length });

        // Record the security event (listing keys)
        this.recordSecurityEvent('sensitive_data_keys_listed', { userId, keysCount: keys.length }, userId, 'info')
            .catch(err => console.error('Error recording sensitive data keys listed event:', err));

        return keys;
    }
    // --- End New ---\

    // --- New: Implement Security Monitoring (Defense Aura) ---\
    /**
     * Starts continuous or periodic security monitoring for a user.\
     * Part of the Defense Aura concept.\
     * For MVP, this is a placeholder.\
     * @param userId The user ID to monitor for. Required.\
     * @returns Promise<void>\
     */\
    async startSecurityMonitoring(userId: string): Promise<void> {
        console.log(`[SecurityService];
Starting;
security;
monitoring;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Starting;
security;
monitoring;
for (user; $; { userId } `, { userId });

        if (!userId) {
            console.warn('[SecurityService] Cannot start monitoring: User ID is required.');
            this.context.loggingService?.logWarning('Cannot start monitoring: User ID is required.');
            return;
        }

        // --- Simulate Starting Monitoring ---\
        // In a real app, this would involve setting up listeners for specific events (e.g., failed logins, data access attempts),\
        // scheduling periodic scans, or integrating with a security monitoring system.\

        console.log(`[SecurityService])
    Simulated;
security;
monitoring;
started;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.eventBus?.publish('security_monitoring_started', { userId }, userId); // Publish event

        // Record the security event
        this.recordSecurityEvent('security_monitoring_started', { userId }, userId, 'info')
            .catch(err => console.error('Error recording monitoring started event:', err));

        // TODO: Implement actual monitoring logic (e.g., subscribe to relevant events, perform periodic checks)
    }

    /**
     * Stops security monitoring for a user.\
     * Part of the Defense Aura concept.\
     * For MVP, this is a placeholder.\
     * @returns Promise<void>\
     */\
    async stopSecurityMonitoring(): Promise<void> {
        const userId = this.context.currentUser?.id; // Get user ID before stopping
        console.log(`[SecurityService];
Stopping;
security;
monitoring;
for (user; ; )
    : $;
{
    userId || 'N/A';
}
`);
        this.context.loggingService?.logInfo(`;
Stopping;
security;
monitoring;
for (user; $; { userId } || 'N/A')
    ;
`, { userId });

        // --- Simulate Stopping Monitoring ---\
        // In a real app, this would involve tearing down listeners or cancelling scheduled tasks.\

        console.log(`[SecurityService];
Simulated;
security;
monitoring;
stopped;
for (user; ; )
    : $;
{
    userId || 'N/A';
}
`);
        this.context.eventBus?.publish('security_monitoring_stopped', { userId }, userId || undefined); // Publish event

        // Record the security event
        this.recordSecurityEvent('security_monitoring_stopped', { userId }, userId, 'info')
            .catch(err => console.error('Error recording monitoring stopped event:', err));

        // TODO: Implement actual stopping logic
    }

    /**
     * Triggers a manual security scan for a user.\
     * Part of the Defense Aura concept.\
     * For MVP, this simulates the scan process and logs it.\
     * In a real app, this would involve analyzing recent logs and events for suspicious patterns.\
     * @param userId The user ID to scan for. Required.\
     * @returns Promise<any> The scan results.\
     */\
    async monitorSecurityEvents(userId: string): Promise<any> {
        console.log(`[SecurityService];
Initiating;
manual;
security;
scan;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Initiating;
manual;
security;
scan;
for (user; $; { userId } `, { userId });

        if (!userId) {
            console.error('[SecurityService] Cannot initiate security scan: User ID is required.');
            this.context.loggingService?.logError('Cannot initiate security scan: User ID is required.');
            throw new Error('User ID is required to initiate security scan.');
        }

        // --- Simulate Security Scan Process ---\
        // This is a placeholder. A real scan would involve:\
        // 1. Fetching recent security events and user actions (e.g., from LoggingService, AuthorityForgingEngine).\
        // 2. Analyzing patterns (e.g., multiple failed login attempts from different IPs, unusual data access patterns, unexpected rune executions).\
        // 3. Using AI/ML (via WisdomSecretArt or EvolutionEngine) to identify anomalies.\

        this.context.eventBus?.publish('security_scan_started', { userId }, userId); // Publish event

        console.log(`[SecurityService])
    Simulating;
security;
scan;
for (user; ; )
    : $;
{
    userId;
}
`);
        // Simulate scan time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate results (success, warning, or error)
        const scanStatus = Math.random() > 0.9 ? 'error' : Math.random() > 0.6 ? 'warning' : 'success';
        let resultMessage = `;
Security;
scan;
completed;
with (status)
    : $;
{
    scanStatus;
}
`;
        const issuesFound: any[] = [];

        if (scanStatus === 'warning') {
            resultMessage = 'Security scan found potential warnings.';
            issuesFound.push({ type: 'warning', message: 'Simulated: Multiple failed login attempts detected recently.' });
        } else if (scanStatus === 'error') {
            resultMessage = 'Security scan found critical issues.';
            issuesFound.push({ type: 'error', message: 'Simulated: Unusual data access pattern detected.' });
            issuesFound.push({ type: 'warning', message: 'Simulated: Unlinked integration with stored credentials.' });
        }

        const scanResults = {
            status: scanStatus,
            message: resultMessage,
            timestamp: new Date().toISOString(),
            issues: issuesFound,
        };

        console.log(`[SecurityService];
Simulated;
security;
scan;
complete;
for (user; ; )
    : $;
{
    userId;
}
Status: $;
{
    scanStatus;
}
`);
        this.context.loggingService?.logInfo(`;
Simulated;
security;
scan;
complete;
for (user; $; { userId } `, { userId, status: scanStatus, issuesCount: issuesFound.length });

        // Record the security event
        this.recordSecurityEvent('security_scan_completed', { userId, status: scanStatus, issuesCount: issuesFound.length }, userId, scanStatus === 'error' ? 'error' : scanStatus === 'warning' ? 'warning' : 'info')
            .catch(err => console.error('Error recording security scan completed event:', err));

        // Publish event with results
        this.context.eventBus?.publish('security_scan_completed', { userId, results: scanResults }, userId); // Publish event

        return scanResults;
    }
    // --- End New ---\

    // --- New: Implement Emergency Response (Apocalypse Codex) ---\
    /**
     * Triggers an emergency response action.\
     * Part of the Apocalypse Codex concept.\
     * For MVP, this is a placeholder.\
     * @param userId The user ID triggering the emergency. Required.\
     * @param type The type of emergency (e.g., 'data_breach', 'unauthorized_access'). Required.\
     * @param details Optional details about the emergency.\
     * @returns Promise<void>\
     */\
    async triggerEmergencyResponse(userId: string, type: string, details?: any): Promise<void> {
        console.log(`[SecurityService])
    Triggering;
emergency;
response;
for (user; ; )
    : $;
{
    userId;
}
type: $;
{
    type;
}
`);
        this.context.loggingService?.logError(`;
Triggering;
emergency;
response;
for (user; $; { userId } `, { userId, type, details });

        if (!userId || !type) {
            console.error('[SecurityService] Cannot trigger emergency response: User ID and type are required.');
            this.context.loggingService?.logError('Cannot trigger emergency response: Missing required fields.', { userId, type });
            throw new Error('User ID and type are required to trigger emergency response.');
        }

        // --- Simulate Emergency Response ---\
        // This is a placeholder. A real response would involve:\
        // 1. Alerting the user and potentially administrators.\
        // 2. Locking down sensitive data access.\
        // 3. Disabling integrations.\
        // 4. Initiating data backups or snapshots.\
        // 5. Logging all relevant context for post-incident analysis.\
        // 6. Potentially triggering external security workflows.\

        this.context.eventBus?.publish('system_emergency', { userId, type, details }, userId); // Publish event

        console.log(`[SecurityService])
    Simulating;
emergency;
response;
for (user; ; )
    : $;
{
    userId;
}
type: $;
{
    type;
}
`);
        // Simulate response actions
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initial actions

        console.log(`[SecurityService];
Simulated;
emergency;
response;
actions;
completed;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.eventBus?.publish('system_emergency_handled', { userId, type, details, status: 'simulated_handled' }, userId); // Publish event

        // Record the security event
        this.recordSecurityEvent('system_emergency_triggered', { userId, type, details }, userId, 'error')
            .catch(err => console.error('Error recording emergency triggered event:', err));

        // TODO: Implement actual emergency response logic
    }
    // --- End New ---\

    // --- New: Implement User Data Reset ---\
    /**
     * Resets all user data (Knowledge Base, Tasks, Goals, etc.).\
     * This is a destructive action.\
     * @param userId The user ID whose data to reset. Required.\
     * @returns Promise<void>\
     */\
    async resetUserData(userId: string): Promise<void> {
        console.log(`[SecurityService];
Initiating;
user;
data;
reset;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logWarning(`;
Initiating;
user;
data;
reset;
for (user; $; { userId } `, { userId });

        if (!userId) {
            console.error('[SecurityService] Cannot reset user data: User ID is required.');
            this.context.loggingService?.logError('Cannot reset user data: User ID is required.');
            throw new Error('User ID is required to reset user data.');
        }

        // --- Simulate Data Deletion ---\
        // In a real app, this would involve deleting all records associated with the user_id\
        // across all relevant tables (knowledge_records, tasks, goals, abilities, etc.).\
        // Supabase RLS with ON DELETE CASCADE foreign keys can simplify this if tables are linked to auth.users.\

        console.log(`[SecurityService])
    Simulating;
data;
deletion;
for (user; ; )
    : $;
{
    userId;
}
`);
        // Simulate deletion time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate clearing in-memory state (if any)
        this.simulatedLinkedIntegrations = {};
        this.simulatedSyncConfigs = {};
        this.simulatedSensitiveData.delete(userId); // Clear sensitive data for this user
        // Note: Other services' in-memory caches might need explicit clearing or rely on auth state change.

        console.log(`[SecurityService];
Simulated;
data;
deletion;
complete;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logWarning(`;
Simulated;
data;
deletion;
complete;
for (user; $; { userId } `, { userId });

        // Record the security event
        this.recordSecurityEvent('user_data_reset', { userId }, userId, 'warning')
            .catch(err => console.error('Error recording user data reset event:', err));

        // Publish event
        this.context.eventBus?.publish('user_data_reset', { userId }, userId); // Publish event

        // After resetting data, log the user out
        console.log('[SecurityService] Logging user out after data reset.');
        await this.logout(); // This will trigger the auth state change listener to clear UI state and navigate.
    }
    // --- End New ---\

    // --- New: Implement User Listing (Admin/Security Feature) ---\
    /**
     * Lists all users in the system.\
     * NOTE: This method should be restricted to admin users via RLS.\
     * @returns Promise<User[]> An array of User objects.\
     */\
    async listUsers(): Promise<User[]> {
        console.log('[SecurityService] Attempting to list all users...');
        // Check if the current user has permission to list users (e.g., is admin)
        // This check should ideally happen at the API/Edge Function level for security.
        // For MVP, we'll rely on RLS on the 'profiles' table.
        const userId = this.context.currentUser?.id;
        if (!userId) {
             console.warn('[SecurityService] Cannot list users: User not authenticated.');
             this.context.loggingService?.logWarning('Cannot list users: User not authenticated.');
             throw new Error('Authentication required to list users.');
        }
        // TODO: Add permission check: if (!this.hasPermission('list:users', { userId })) { throw new Error('Permission denied'); }

        try {
            // Fetch users from auth.users and join with profiles
            // RLS on profiles should ensure only authorized users (e.g., admins) can see other profiles.
            // If RLS only allows users to see their own profile, this will only return the current user.
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*, auth!inner(email, created_at, last_sign_in_at)'); // Select profile fields and join auth.users fields

            if (error) { throw error; }

            // Map the joined data to the User interface
            const users = data.map(profile => this.mapSupabaseUserToUserInterface(profile.auth, profile));

            console.log(`[SecurityService])
    Fetched;
$;
{
    users.length;
}
users. `);
            this.context.loggingService?.logInfo(`;
Fetched;
$;
{
    users.length;
}
users `, { userId });

            return users;

        } catch (error: any) {
            console.error('[SecurityService] Error fetching users:', error);
            this.context.loggingService?.logError('Failed to fetch users', { userId, error: error.message });
            throw error; // Re-throw the error
        }
    }
    // --- End New ---\

    // --- New: Implement Integration Linking/Unlinking (Simulated) ---\
    /**
     * Simulates linking an external integration for a user.\
     * In a real app, this would involve OAuth flows or securely storing API keys/credentials.\
     * @param userId The user ID. Required.\
     * @param integrationId The ID of the integration (e.g., 'github', 'google', 'boostspace'). Required.\
     * @param details Optional details about the linking (e.g., OAuth tokens, API key status).\
     * @returns Promise<void>\
     */\
    async linkIntegration(userId: string, integrationId: string, details?: any): Promise<void> {
        console.log(`[SecurityService];
Simulating;
linking;
integration: $;
{
    integrationId;
}
for (user; $; { userId })
    ;
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
link;
integration: $;
{
    integrationId;
}
`, { userId, integrationId });

        if (!userId || !integrationId) {
            console.warn('[SecurityService] Cannot link integration: User ID and integration ID are required.');
            this.context.loggingService?.logWarning('Cannot link integration: Missing required fields.', { userId, integrationId });
            throw new Error('User ID and integration ID are required.');
        }

        // --- Simulate Linking Process ---\
        // In a real app, this would involve:\
        // 1. Initiating OAuth flow (redirect user to provider).\
        // 2. Handling callback and exchanging auth code for tokens.\
        // 3. Securely storing tokens/credentials associated with the user.\
        // 4. Updating user's profile or a dedicated 'user_integrations' table.\

        // For MVP, simulate success/failure and update in-memory state.\
        const success = Math.random() > 0.1; // 90% chance of simulated success
        const status = success ? 'linked' : 'error';
        const error = success ? undefined : 'Simulated linking failed.';

        this.simulatedLinkedIntegrations[integrationId] = { status, details: { ...details, error } };

        console.log(`[SecurityService];
Simulated;
linking;
integration;
$;
{
    integrationId;
}
for (user; $; { userId }.Status)
    : $;
{
    status;
}
`);
        this.context.loggingService?.logInfo(`;
Simulated;
linking;
integration;
$;
{
    integrationId;
}
Status: $;
{
    status;
}
`, { userId, integrationId, status, error });

        // Record the security event
        this.recordSecurityEvent(status === 'linked' ? 'integration_linked' : 'integration_linking_failed', { userId, integrationId, status, error }, userId, status === 'linked' ? 'info' : 'warning')
            .catch(err => console.error('Error recording integration event:', err));

        // Publish event
        this.context.eventBus?.publish(status === 'linked' ? 'integration_linked' : 'integration_linking_failed', { userId, integrationId, status, error }, userId);

        if (!success) {
            throw new Error(error);
        }
    }

    /**
     * Simulates unlinking an external integration for a user.\
     * @param userId The user ID. Required.\
     * @param integrationId The ID of the integration. Required.\
     * @returns Promise<void>\
     */\
    async unlinkIntegration(userId: string, integrationId: string): Promise<void> {
        console.log(`[SecurityService];
Simulating;
unlinking;
integration: $;
{
    integrationId;
}
for (user; $; { userId })
    ;
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
unlink;
integration: $;
{
    integrationId;
}
`, { userId, integrationId });

        if (!userId || !integrationId) {
            console.warn('[SecurityService] Cannot unlink integration: User ID and integration ID are required.');
            this.context.loggingService?.logWarning('Cannot unlink integration: Missing required fields.', { userId, integrationId });
            throw new Error('User ID and integration ID are required.');
        }

        // --- Simulate Unlinking Process ---\
        // In a real app, this would involve:\
        // 1. Revoking tokens with the provider (if applicable).\
        // 2. Deleting stored credentials/tokens from secure storage/DB.\
        // 3. Updating user's profile or 'user_integrations' table.\

        // For MVP, simulate success/failure and update in-memory state.\
        const success = Math.random() > 0.1; // 90% chance of simulated success
        const status = success ? 'unlinked' : 'linked'; // If failed, status remains linked
        const error = success ? undefined : 'Simulated unlinking failed.';

        if (success) {
             delete this.simulatedLinkedIntegrations[integrationId]; // Remove from map on success
        } else {
             // On failure, update status to error if it was linked
             if (this.simulatedLinkedIntegrations[integrationId]?.status === 'linked') {
                  this.simulatedLinkedIntegrations[integrationId].status = 'error';
                  this.simulatedLinkedIntegrations[integrationId].details = { error };
             }
        }

        console.log(`[SecurityService];
Simulated;
unlinking;
integration;
$;
{
    integrationId;
}
for (user; $; { userId }.Success)
    : $;
{
    success;
}
`);
        this.context.loggingService?.logInfo(`;
Simulated;
unlinking;
integration;
$;
{
    integrationId;
}
Success: $;
{
    success;
}
`, { userId, integrationId, success, error });

        // Record the security event
        this.recordSecurityEvent(success ? 'integration_unlinked' : 'integration_unlinking_failed', { userId, integrationId, success, error }, userId, success ? 'info' : 'warning')
            .catch(err => console.error('Error recording integration event:', err));

        // Publish event
        this.context.eventBus?.publish(success ? 'integration_unlinked' : 'integration_unlinking_failed', { userId, integrationId, success, error }, userId);

        if (!success) {
            throw new Error(error);
        }
    }

    /**
     * Retrieves the list of linked integrations for a user.\
     * @param userId The user ID. Required.\
     * @returns Promise<Record<string, { status: 'linked' | 'unlinked' | 'error', details?: any }>> A map of integration IDs to their status.\
     */\
    async getLinkedIntegrations(userId: string): Promise<Record<string, { status: 'linked' | 'unlinked' | 'error', details?: any }>> {
        console.log(`[SecurityService];
Retrieving;
linked;
integrations;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
retrieve;
linked;
integrations `, { userId });

        if (!userId) {
            console.warn('[SecurityService] Cannot retrieve linked integrations: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve linked integrations: User ID is required.');
            return {};
        }

        // --- Simulate Retrieval ---\
        // In a real app, fetch from 'user_integrations' table filtered by user_id.\
        // For MVP, return the in-memory state.\

        // Simulate checking if Working Copy key is stored in sensitive data
        const workingCopyKeyStored = this.simulatedSensitiveData.get(userId)?.has('working_copy_key') || false;
        if (workingCopyKeyStored) {
             // If key is stored, mark Working Copy as linked
             this.simulatedLinkedIntegrations['workingcopy'] = { status: 'linked', details: { keyStored: true } };
        } else if (this.simulatedLinkedIntegrations['workingcopy']?.status === 'linked') {
             // If key was deleted from sensitive data, mark Working Copy as unlinked
             delete this.simulatedLinkedIntegrations['workingcopy'];
        }


        const linkedIntegrations = { ...this.simulatedLinkedIntegrations }; // Return a copy

        console.log(`[SecurityService];
Retrieved;
linked;
integrations;
for (user; ; )
    : $;
{
    userId;
}
Count: $;
{
    Object.keys(linkedIntegrations).length;
}
`);
        this.context.loggingService?.logInfo(`;
Retrieved;
linked;
integrations `, { userId, count: Object.keys(linkedIntegrations).length });

        return linkedIntegrations;
    }
    // --- End New ---\

    // --- New: Implement Sync Config Management (Simulated) ---\
    /**
     * Retrieves the cloud sync configuration for a user.\
     * @param userId The user ID. Required.\
     * @returns Promise<CloudSyncConfig | undefined> The sync config or undefined if not set.\
     */\
    async getSyncConfig(userId: string): Promise<CloudSyncConfig | undefined> {
        console.log(`[SecurityService];
Retrieving;
sync;
config;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
retrieve;
sync;
config `, { userId });

        if (!userId) {
            console.warn('[SecurityService] Cannot retrieve sync config: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve sync config: User ID is required.');
            return undefined;
        }

        // --- Simulate Retrieval ---\
        // In a real app, fetch from user settings table.\
        // For MVP, return from in-memory map.\
        const config = this.simulatedSyncConfigs[userId];

        console.log(`[SecurityService];
Retrieved;
sync;
config;
for (user; ; )
    : $;
{
    userId;
}
Found: $;
{
    !!config;
}
`);
        this.context.loggingService?.logInfo(`;
Retrieved;
sync;
config.Found;
$;
{
    !!config;
}
`, { userId });

        // Publish event
        this.context.eventBus?.publish('sync_config_loaded', { userId, config }, userId);

        return config;
    }

    /**
     * Updates the cloud sync configuration for a user.\
     * @param userId The user ID. Required.\
     * @param config The new sync configuration. Required.\
     * @returns Promise<CloudSyncConfig> The updated sync config.\
     */\
    async updateSyncConfig(userId: string, config: CloudSyncConfig): Promise<CloudSyncConfig> {
        console.log(`[SecurityService];
Updating;
sync;
config;
for (user; ; )
    : $;
{
    userId;
}
`, config);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
update;
sync;
config `, { userId, config });

        if (!userId || !config) {
            console.warn('[SecurityService] Cannot update sync config: User ID and config are required.');
            this.context.loggingService?.logWarning('Cannot update sync config: Missing required fields.', { userId, config });
            throw new Error('User ID and config are required.');
        }

        // --- Simulate Update ---\
        // In a real app, update user settings table.\
        // For MVP, update in-memory map.\
        this.simulatedSyncConfigs[userId] = config;

        console.log(`[SecurityService];
Sync;
config;
updated;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Sync;
config;
updated `, { userId, config });

        // Publish event
        this.context.eventBus?.publish('sync_config_updated', { userId, config }, userId);

        return config;
    }
    // --- End New ---\

    // TODO: Implement methods for managing user roles and permissions (RBAC/ABAC).
    // TODO: Implement secure storage for sensitive data (API keys, credentials) using encryption and RLS.
    // TODO: Implement security monitoring and alerting (Defense Aura).
    // TODO: Implement security event auditing (Reliving the Past).
    // TODO: Implement emergency response actions (Apocalypse Codex).
    // TODO: Implement data integrity checks (Codex Guardian).
    // TODO: Implement user data backup and restore (Codex Backup/Restore).
    // TODO: Implement user data mirroring (Mirror Codex).
    // TODO: This module is the core of the Security Service (\u5b89\u5168\u670d\u52d9) pillar.
}
` ``;
