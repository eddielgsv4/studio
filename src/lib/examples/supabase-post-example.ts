/**
 * Example: Authenticated Posting to Supabase
 * 
 * This file demonstrates how to post data to Supabase using Supabase authentication.
 */

import { supabase, createUserProfile } from '@/lib/auth/supabase';

// Example interface for a post/content item
interface PostData {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  data?: any; // Additional JSON data
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a new post in Supabase
 * Requires user to be authenticated with Supabase
 */
export const createPost = async (title: string, content: string, additionalData?: any): Promise<PostData> => {
  try {
    // Get current user info from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated. Please sign in with Supabase first.');
    }

    // Ensure user profile exists in Supabase
    await ensureUserProfile(user);

    // Create the post
    const { data, error } = await supabase
      .from('test_data')
      .insert([{
        user_id: user.id,
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('test_data')
      .select('*')
      .eq('user_id', user.id)
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
      .eq('user_id', user.id) // Ensure user can only update their own posts
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('test_data')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id); // Ensure user can only delete their own posts

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
 * This should be called after Supabase authentication
 */
const ensureUserProfile = async (user: any) => {
  try {
    await createUserProfile({
      user_id: user.id,
      email: user.email,
      name: user.user_metadata.name,
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
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

/**
 * Get current user's Supabase UID
 */
export const getCurrentUserUID = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

/**
 * Example usage:
 * 
 * // After user signs in with Supabase
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
