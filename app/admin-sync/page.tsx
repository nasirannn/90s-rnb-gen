"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSyncPage() {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const syncUserById = async () => {
    if (!userId.trim()) {
      setResult({ error: 'Please enter a user ID' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sync-user-by-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin User Sync</h1>
      
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to Authentication → Users</li>
            <li>Copy the User ID of existing users</li>
            <li>Paste the User ID below and click &quot;Sync User&quot;</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">
              Supabase User ID:
            </label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter Supabase User ID (UUID format)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full max-w-md"
            />
          </div>

          <Button 
            onClick={syncUserById} 
            disabled={isLoading || !userId.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Syncing...' : 'Sync User to Neon DB'}
          </Button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
