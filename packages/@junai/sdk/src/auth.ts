```typescript
// packages/@junai/sdk/src/auth.ts
// Auth Client Module for SDK
// Provides methods for user authentication (login, signup, logout, get user).

import { SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '../../../src/interfaces'; // Import User interface from main project

/**
 * Maps a Supabase User object to the internal User interface.
 * Includes data from the 'profiles' table if available.
 * @param supabaseUser The user object from Supabase Auth.
 * @param profileData Optional profile data from the 'profiles' table.
 * @returns The mapped User object.
 */
function mapSupabaseUserToUserInterface(supabaseUser: SupabaseUser, profileData?: any): User {
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
        language_preference: profileData?.language_preference, // Include language preference
    } as User; // Cast to User interface
}


export class AuthClient {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  /**
   * Handles user login with email and password.
   * @param email User email.
   * @param password User password.
   * @returns Promise<{ user: User | null, session: Session | null }> The authenticated user and session, or null on failure.
   */
  async signInWithPassword(email: string, password: string): Promise<{ user: User | null, session: Session | null }> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('SDK AuthClient signInWithPassword failed:', error.message);
        throw error; // Re-throw the error
      }

      // Fetch profile data if user exists
      let profileData = null;
      if (data.user) {
           try {
               const { data: profile, error: profileError } = await this.supabaseClient
                   .from('profiles')
                   .select('*')
                   .eq('id', data.user.id)
                   .single();
               if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore 'not found' error
               profileData = profile;
           } catch (profileFetchError: any) {
               console.error('SDK AuthClient error fetching user profile after login:', profileFetchError.message);
           }
      }


      return {
          user: data.user ? mapSupabaseUserToUserInterface(data.user, profileData) : null,
          session: data.session,
      };

    } catch (error: any) {
      console.error('SDK AuthClient error during signInWithPassword:', error.message);
      throw error; // Re-throw the error
    }
  }

   /**
   * Handles user signup with email and password.
   * @param email User email.
   * @param password User password.
   * @returns Promise<{ user: User | null, session: Session | null }> The signed-up user and session, or null on failure.
   */
  async signUpWithPassword(email: string, password: string): Promise<{ user: User | null, session: Session | null }> {
    try {
      const { data, error } = await this.supabaseClient.auth.signUp({ email, password });

      if (error) {
        console.error('SDK AuthClient signUpWithPassword failed:', error.message);
        throw error; // Re-throw the error
      }

       // Fetch profile data if user exists (might not exist immediately if email confirmation is required)
      let profileData = null;
      if (data.user) {
           try {
               const { data: profile, error: profileError } = await this.supabaseClient
                   .from('profiles')
                   .select('*')
                   .eq('id', data.user.id)
                   .single();
               if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore 'not found' error
               profileData = profile;
           } catch (profileFetchError: any) {
               console.error('SDK AuthClient error fetching user profile after signup:', profileFetchError.message);
           }
      }


      return {
          user: data.user ? mapSupabaseUserToUserInterface(data.user, profileData) : null,
          session: data.session,
      };

    } catch (error: any) {
      console.error('SDK AuthClient error during signUpWithPassword:', error.message);
      throw error; // Re-throw the error
    }
  }


  /**
   * Handles user logout.
   * @returns Promise<void>
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      if (error) {
        console.error('SDK AuthClient signOut failed:', error.message);
        throw error; // Re-throw the error
      }
    } catch (error: any) {
      console.error('SDK AuthClient error during signOut:', error.message);
      throw error; // Re-throw the error
    }
  }

  /**
   * Gets the current user session.
   * @returns Promise<{ user: User | null, session: Session | null }> The current user and session, or null if not authenticated.
   */
  async getSession(): Promise<{ user: User | null, session: Session | null }> {
      try {
          const { data: { session }, error } = await this.supabaseClient.auth.getSession();

          if (error) {
              console.error('SDK AuthClient getSession failed:', error.message);
              throw error; // Re-throw the error
          }

          // Fetch profile data if user exists
          let profileData = null;
          if (session?.user) {
               try {
                   const { data: profile, error: profileError } = await this.supabaseClient
                       .from('profiles')
                       .select('*')
                       .eq('id', session.user.id)
                       .single();
                   if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore 'not found' error
                   profileData = profile;
               } catch (profileFetchError: any) {
                   console.error('SDK AuthClient error fetching user profile during getSession:', profileFetchError.message);
               }
          }


          return {
              user: session?.user ? mapSupabaseUserToUserInterface(session.user, profileData) : null,
              session: session,
          };

      } catch (error: any) {
          console.error('SDK AuthClient error during getSession:', error.message);
          throw error; // Re-throw the error
      }
  }

    /**
     * Gets the currently authenticated user.
     * @returns Promise<User | null> The current user or null if not authenticated.
     */
    async getUser(): Promise<User | null> {
        try {
            const { data: { user: supabaseUser }, error } = await this.supabaseClient.auth.getUser();

            if (error) {
                console.error('SDK AuthClient getUser failed:', error.message);
                throw error; // Re-throw the error
            }

             // Fetch profile data if user exists
            let profileData = null;
            if (supabaseUser) {
                 try {
                     const { data: profile, error: profileError } = await this.supabaseClient
                         .from('profiles')
                         .select('*')
                         .eq('id', supabaseUser.id)
                         .single();
                     if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore 'not found' error
                     profileData = profile;
                 } catch (profileFetchError: any) {
                     console.error('SDK AuthClient error fetching user profile during getUser:', profileFetchError.message);
                 }
            }

            return supabaseUser ? mapSupabaseUserToUserInterface(supabaseUser, profileData) : null;

        } catch (error: any) {
            console.error('SDK AuthClient error during getUser:', error.message);
            throw error; // Re-throw the error
        }
    }

    // Add other auth-related methods if needed (e.g., reset password, update user)
}
```