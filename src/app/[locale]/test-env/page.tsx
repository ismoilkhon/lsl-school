'use client';

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p><strong>NEXT_PUBLIC_APPWRITE_ENDPOINT:</strong> {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_APPWRITE_PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_APPWRITE_DATABASE_ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_APPWRITE_BUCKET_ID:</strong> {process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'NOT SET'}</p>
      </div>
    </div>
  );
}
