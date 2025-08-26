'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function WifiPage() {
  const searchParams = useSearchParams();
  const ssid = searchParams.get('ssid') || 'Unknown Network';
  const security = searchParams.get('security') || 'WPA';
  const password = searchParams.get('password') || '';

  const handleConnect = () => {
    // For mobile devices, this will trigger the WiFi connection dialog
    if (navigator.userAgent.includes('Mobile')) {
      // Try to open WiFi settings
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        window.location.href = 'App-Prefs:root=WIFI';
      } else if (navigator.userAgent.includes('Android')) {
        window.location.href = 'android-app://com.android.settings/.wifi.WifiSettings';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect to WiFi
          </h1>
          
          <div className="bg-gray-100 rounded-lg p-4 text-left mb-4">
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Network:</span>
                <span className="ml-2 text-gray-900">{ssid}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Security:</span>
                <span className="ml-2 text-gray-900">{security}</span>
              </div>
              {password && (
                <div>
                  <span className="font-medium text-gray-700">Password:</span>
                  <span className="ml-2 text-gray-900 font-mono">{password}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleConnect}
            className="w-full"
          >
            Connect to Network
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Tap the button above to connect to this WiFi network on your device.
          </p>
        </div>
      </Card>
    </div>
  );
}
