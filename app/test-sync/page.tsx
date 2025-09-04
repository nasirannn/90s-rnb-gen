"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function TestSyncPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const syncUserCredits = async () => {
    if (!user) {
      setResult({ error: 'Please log in first' });
      return;
    }

    setIsLoading(true);
    try {
      // 获取当前session的access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setResult({ error: 'No valid session found' });
        return;
      }

      const response = await fetch('/api/sync-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserCredits = async () => {
    if (!user) {
      setResult({ error: 'Please log in first' });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setResult({ error: 'No valid session found' });
        return;
      }

      const response = await fetch('/api/user-credits', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">User Credits Sync Test</h1>
      
      <div className="space-y-4">
        <div>
          <p className="mb-2">
            <strong>Current User:</strong> {user ? `${user.email} (${user.id})` : 'Not logged in'}
          </p>
        </div>

        <div className="space-x-4">
          <Button 
            onClick={syncUserCredits} 
            disabled={isLoading || !user}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Syncing...' : 'Sync User to Neon DB'}
          </Button>

          <Button 
            onClick={getUserCredits} 
            disabled={isLoading || !user}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Loading...' : 'Get User Credits'}
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
