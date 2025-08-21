/**
 * Example: Authenticated Posting to Supabase with Firebase Auth
 * 
 * This file demonstrates how to post data to Supabase using Firebase authentication.
 * The integration uses Firebase JWT tokens for authentication with Supabase.
 */

import { supabase, getCurrentUserFromJWT, createUserProfile } from '@/lib/auth/supabase';
import { auth } from '@/lib/auth/firebase';

// Example interface for a post/content item
interface PostData {
  id?: string;
  firebase_uid: string;
  title: string;
  content: string;
  data?: any; // Additional JSON data
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new post in Supabase
 * Requires user to be authenticated with Firebase
 */
export const createPost = async (title: string, content: string, additionalData?: any): Promise<PostData> => {
  try {
    // Get current user info from Firebase JWT
    const userInfo = await getCurrentUserFromJWT();
    if (!userInfo) {
      throw new Error('User not authenticated. Please sign in with Firebase first.');
    }

    // Ensure user profile exists in Supabase
    await ensureUserProfile(userInfo);

    // Create the post
    const { data, error } = await supabase
      .from('test_data')
      .insert([{
        firebase_uid: userInfo.firebase_uid,
        title: title.trim(),
        content: content.trim(),
        data: additionalData || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }

    console.log('Post created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Get all posts for the current authenticated user
 */
export const getUserPosts = async (): Promise<PostData[]> => {
  try {
    const userInfo = await getCurrentUserFromJWT();
    if (!userInfo) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('test_data')
      .select('*')
      .eq('firebase_uid', userInfo.firebase_uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (postId: string, title: string, content: string, additionalData?: any): Promise<PostData> => {
  try {
    const userInfo = await getCurrentUserFromJWT();
    if (!userInfo) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('test_data')
      .update({
        title: title.trim(),
        content: content.trim(),
        data: additionalData || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('firebase_uid', userInfo.firebase_uid) // Ensure user can only update their own posts
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to update post: ${error.message}`);
    }

    if (!data) {
      throw new Error('Post not found or you do not have permission to update it');
    }

    console.log('Post updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const userInfo = await getCurrentUserFromJWT();
    if (!userInfo) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('test_data')
      .delete()
      .eq('id', postId)
      .eq('firebase_uid', userInfo.firebase_uid); // Ensure user can only delete their own posts

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }

    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Ensure user profile exists in Supabase
 * This should be called after Firebase authentication
 */
const ensureUserProfile = async (userInfo: any) => {
  try {
    await createUserProfile({
      firebase_uid: userInfo.firebase_uid,
      email: userInfo.email,
      name: userInfo.name,
    });
  } catch (error: any) {
    // If user already exists, that's fine
    if (!error.message?.includes('duplicate key')) {
      console.warn('Error ensuring user profile:', error);
    }
  }
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Get current user's Firebase UID
 */
export const getCurrentUserUID = (): string | null => {
  return auth.currentUser?.uid || null;
};

/**
 * Example usage:
 * 
 * // After user signs in with Firebase
 * import { createPost, getUserPosts } from '@/lib/examples/supabase-post-example';
 * 
 * // Create a post
 * const newPost = await createPost(
 *   'My First Post',
 *   'This is the content of my post',
 *   { category: 'general', tags: ['example', 'test'] }
 * );
 * 
 * // Get all user posts
 * const userPosts = await getUserPosts();
 * 
 * // Update a post
 * const updatedPost = await updatePost(
 *   newPost.id,
 *   'Updated Title',
 *   'Updated content'
 * );
 * 
 * // Delete a post
 * await deletePost(newPost.id);
 */
