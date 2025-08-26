'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    image: '',
  });

  // Load user data from localStorage
  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setProfile({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
        image: user.image || '',
      });
    }
  }, []);

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'team', label: 'Team & Roles', icon: '👥' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'workspace', label: 'Workspace', icon: '🏢' },
  ];

  const generateApiKey = () => {
    const key = 'qrm_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(key);
    setShowApiKey(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-600 mt-2">{t('settings.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <img 
                        src={profile.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('avatar', file);
                          
                          try {
                            const response = await fetch('/api/user/avatar', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              setProfile({ ...profile, image: data.imageUrl });
                              alert('Profile picture updated successfully!');
                            } else {
                              const error = await response.json();
                              alert(error.error || 'Failed to upload image');
                            }
                          } catch (error) {
                            alert('Failed to upload image');
                          }
                        }
                      }}
                    />
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <Input
                    label="Company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <p className="text-gray-600 mt-1">€9/month • Renews on Jan 1, 2025</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/billing/portal', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                          });
                          if (response.ok) {
                            const data = await response.json();
                            window.location.href = data.url;
                          }
                        } catch (error) {
                          console.error('Error opening billing portal:', error);
                        }
                      }}
                    >
                      Manage Subscription
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">QR Codes</p>
                      <p className="text-xl font-bold text-gray-900">234 / 500</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '46.8%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Scans</p>
                      <p className="text-xl font-bold text-gray-900">45,678 / 100,000</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '45.7%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">API Calls</p>
                      <p className="text-xl font-bold text-gray-900">12,345 / 50,000</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '24.7%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: 'Dec 1, 2024', amount: '€9.00', status: 'Paid' },
                      { date: 'Nov 1, 2024', amount: '€9.00', status: 'Paid' },
                      { date: 'Oct 1, 2024', amount: '€9.00', status: 'Paid' },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.date}</p>
                          <p className="text-sm text-gray-500">Pro Plan Monthly</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="success">{invoice.status}</Badge>
                          <span className="font-medium text-gray-900">{invoice.amount}</span>
                          <Button variant="outline" size="sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button 
                    size="sm"
                    onClick={() => {
                      const email = prompt('Enter email address:');
                      const role = prompt('Enter role (OWNER/ADMIN/EDITOR/VIEWER):', 'VIEWER');
                      if (email && role) {
                        fetch('/api/team/invite', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, role }),
                        }).then(response => response.json())
                        .then(data => {
                          if (data.success) {
                            alert(`Invitation sent to ${email}`);
                          } else {
                            alert('Failed to send invitation');
                          }
                        });
                      }
                    }}
                  >
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@example.com', role: 'Owner', status: 'Active' },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
                    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
                    { name: 'Alice Brown', email: 'alice@example.com', role: 'Viewer', status: 'Pending' },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                          {member.status}
                        </Badge>
                        <select 
                          className="px-3 py-1 border rounded-lg text-sm"
                          onChange={(e) => {
                            // In production, this would update the user's role
                            console.log(`Updating ${member.email} role to ${e.target.value}`);
                          }}
                        >
                          <option value="owner" selected={member.role === 'Owner'}>Owner</option>
                          <option value="admin" selected={member.role === 'Admin'}>Admin</option>
                          <option value="editor" selected={member.role === 'Editor'}>Editor</option>
                          <option value="viewer" selected={member.role === 'Viewer'}>Viewer</option>
                        </select>
                        {member.role !== 'Owner' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (confirm(`Remove ${member.name} from team?`)) {
                                // In production, this would remove the user
                                console.log(`Removing ${member.email} from team`);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-info-50 rounded-lg">
                  <p className="text-sm text-info-900">
                    <strong>Team Seats:</strong> 4 of 5 used
                  </p>
                  <p className="text-sm text-info-700 mt-1">
                    Upgrade to Business plan for unlimited team members
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Use API keys to integrate QR Master with your applications. Keep your keys secure and never share them publicly.
                    </p>
                    <div className="p-4 bg-warning-50 rounded-lg">
                      <p className="text-sm text-warning-900">
                        <strong>⚠️ Warning:</strong> API keys provide full access to your account. Treat them like passwords.
                      </p>
                    </div>
                  </div>

                  {!apiKey ? (
                    <Button onClick={generateApiKey}>Generate New API Key</Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
                        <div className="flex space-x-2">
                          <Input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? 'Hide' : 'Show'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(apiKey)}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          This key will only be shown once. Store it securely.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
                      <code className="block p-3 bg-gray-100 rounded text-sm">
                        https://api.qrmaster.com/v1
                      </code>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                      <code className="block p-3 bg-gray-100 rounded text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Example Request</h4>
                      <pre className="p-3 bg-gray-100 rounded text-sm overflow-x-auto">
{`curl -X POST https://api.qrmaster.com/v1/qr-codes \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"My QR","content":"https://example.com"}'`}
                      </pre>
                    </div>
                    <Button variant="outline">View Full Documentation</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Workspace Tab */}
          {activeTab === 'workspace' && (
            <Card>
              <CardHeader>
                <CardTitle>Workspace Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name</label>
                  <Input value="Acme Corp" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workspace URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      qrmaster.com/
                    </span>
                    <Input value="acme-corp" className="rounded-l-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default QR Settings</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Auto-generate slugs for dynamic QR codes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Track scan analytics by default</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Require approval for new QR codes</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h4>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-900 mb-3">
                      Deleting your workspace will permanently remove all QR codes, analytics data, and team members.
                    </p>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                      Delete Workspace
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}