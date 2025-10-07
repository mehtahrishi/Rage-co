import { account, ID } from '@/lib/appwrite';
import type { Models } from 'appwrite';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  
  // Register new user
  static async register({ email, password, name }: RegisterCredentials) {
    try {
      console.log('Creating user account...');
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      console.log('User created, creating session...');
      // Create session after registration
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login({ email, password }: LoginCredentials) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      // User not logged in
      return null;
    }
  }

  // Update user profile
  static async updateProfile({ name, email }: { name?: string; email?: string }) {
    try {
      if (name) {
        await account.updateName(name);
      }
      if (email) {
        await account.updateEmail(email, 'password'); // You'd need to handle password verification
      }
      return await account.get();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(newPassword: string, oldPassword: string) {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Send password recovery email
  static async sendPasswordRecovery(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      console.error('Password recovery error:', error);
      throw error;
    }
  }

  // Complete password recovery
  static async completePasswordRecovery(
    userId: string,
    secret: string,
    newPassword: string
  ) {
    try {
      await account.updateRecovery(userId, secret, newPassword);
    } catch (error) {
      console.error('Password recovery completion error:', error);
      throw error;
    }
  }

  // Verify email
  static async sendEmailVerification() {
    try {
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Complete email verification
  static async completeEmailVerification(userId: string, secret: string) {
    try {
      await account.updateVerification(userId, secret);
    } catch (error) {
      console.error('Email verification completion error:', error);
      throw error;
    }
  }
}