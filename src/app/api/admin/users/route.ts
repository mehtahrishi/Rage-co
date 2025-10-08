import { NextRequest, NextResponse } from 'next/server';
import { Client, Users, Databases, Query } from 'node-appwrite';
import { CONFIG } from '@/lib/appwrite';

// This route requires authentication and should only be accessible by admins
export async function GET(request: NextRequest) {
  try {
    // Initialize Appwrite server SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!); // Server API key

    const users = new Users(client);
    const databases = new Databases(client);

    // Fetch users from Appwrite
    const usersList = await users.list([]);
    
    // Fetch additional user data from the users collection if needed
    // This would contain custom user data beyond what Appwrite auth provides
    let usersWithDetails = [];
    
    for (const user of usersList.users) {
      try {
        // Try to get additional user data from the database collection
        const userDocs = await databases.listDocuments(
          CONFIG.DATABASE_ID,
          CONFIG.COLLECTIONS.USERS,
          [Query.equal('email', user.email)]
        );
        
        const userDetails = userDocs.documents[0] || {};
        
        usersWithDetails.push({
          ...user,
          ...userDetails,
          // Add computed fields or additional data here
        });
      } catch (error) {
        // If we can't find additional details, just use the auth user data
        usersWithDetails.push(user);
      }
    }

    return NextResponse.json({
      success: true,
      data: usersWithDetails,
      total: usersList.total
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}