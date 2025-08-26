import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function QRInactivePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            QR Code Inactive
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-600">
            <p>This QR code is currently inactive and cannot be accessed.</p>
            <p className="text-sm mt-2">
              The QR code may have been paused or deactivated by its owner.
            </p>
          </div>
          
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            
            <Link href="/create">
              <Button variant="outline" className="w-full">
                Create New QR Code
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
