'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/hooks/useTranslation';
import { QRCodeSVG } from 'qrcode.react';

interface BulkQRData {
  title: string;
  contentType: string;
  content: string;
  tags?: string;
  type?: 'STATIC' | 'DYNAMIC';
}

export default function BulkUploadPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [data, setData] = useState<BulkQRData[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.name.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = Papa.parse(text, { header: true });
        processData(result.data);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const processData = (rawData: any[]) => {
    // Auto-detect columns
    if (rawData.length > 0) {
      const columns = Object.keys(rawData[0]);
      const autoMapping: Record<string, string> = {};
      
      columns.forEach((col) => {
        const lowerCol = col.toLowerCase();
        if (lowerCol.includes('title') || lowerCol.includes('name')) {
          autoMapping.title = col;
        } else if (lowerCol.includes('type')) {
          autoMapping.contentType = col;
        } else if (lowerCol.includes('content') || lowerCol.includes('url') || lowerCol.includes('data')) {
          autoMapping.content = col;
        } else if (lowerCol.includes('tag')) {
          autoMapping.tags = col;
        }
      });
      
      setMapping(autoMapping);
    }
    
    setData(rawData);
    setStep('preview');
  };

  const handleUpload = async () => {
    setLoading(true);
    
    try {
      // Transform data based on mapping
      const transformedData = data.map((row: any) => ({
        title: row[mapping.title] || 'Untitled',
        contentType: row[mapping.contentType] || 'URL',
        content: row[mapping.content] || '',
        tags: row[mapping.tags] || '',
        type: 'DYNAMIC' as const,
      }));

      const response = await fetch('/api/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodes: transformedData }),
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        setStep('complete');
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { title: 'Product Page', contentType: 'URL', content: 'https://example.com/product', tags: 'product,marketing' },
      { title: 'Contact Card', contentType: 'VCARD', content: 'John Doe', tags: 'contact,business' },
      { title: 'WiFi Network', contentType: 'WIFI', content: 'NetworkName:password123', tags: 'wifi,office' },
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('bulk.title')}</h1>
        <p className="text-gray-600 mt-2">{t('bulk.subtitle')}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step === 'upload' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === 'upload' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="ml-3 font-medium">Upload File</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full bg-primary-600 transition-all ${
              step === 'preview' || step === 'complete' ? 'w-full' : 'w-0'
            }`} />
          </div>
          
          <div className={`flex items-center ${
            step === 'preview' || step === 'complete' ? 'text-primary-600' : 'text-gray-400'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === 'preview' || step === 'complete' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="ml-3 font-medium">Preview & Map</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-200 mx-4">
            <div className={`h-full bg-primary-600 transition-all ${
              step === 'complete' ? 'w-full' : 'w-0'
            }`} />
          </div>
          
          <div className={`flex items-center ${step === 'complete' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === 'complete' ? 'bg-primary-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="ml-3 font-medium">Complete</span>
          </div>
        </div>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Button variant="outline" onClick={downloadTemplate}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template
              </Button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <p className="text-xs text-gray-400">Supports CSV, XLS, XLSX (max 1000 rows)</p>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">CSV Format</p>
                      <p className="text-sm text-gray-500">Comma-separated values</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Excel Format</p>
                      <p className="text-sm text-gray-500">XLS or XLSX files</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Fast Processing</p>
                      <p className="text-sm text-gray-500">Up to 1000 QR codes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview & Map Columns</CardTitle>
              <Badge variant="info">{data.length} rows detected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Column</label>
                <Select
                  value={mapping.title || ''}
                  onChange={(e) => setMapping({ ...mapping, title: e.target.value })}
                  options={Object.keys(data[0] || {}).map((col) => ({ value: col, label: col }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type Column</label>
                <Select
                  value={mapping.contentType || ''}
                  onChange={(e) => setMapping({ ...mapping, contentType: e.target.value })}
                  options={Object.keys(data[0] || {}).map((col) => ({ value: col, label: col }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Column</label>
                <Select
                  value={mapping.content || ''}
                  onChange={(e) => setMapping({ ...mapping, content: e.target.value })}
                  options={Object.keys(data[0] || {}).map((col) => ({ value: col, label: col }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags Column (Optional)</label>
                <Select
                  value={mapping.tags || ''}
                  onChange={(e) => setMapping({ ...mapping, tags: e.target.value })}
                  options={[
                    { value: '', label: 'None' },
                    ...Object.keys(data[0] || {}).map((col) => ({ value: col, label: col }))
                  ]}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Preview</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Content</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row: any, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">
                        <QRCodeSVG
                          value={row[mapping.content] || 'https://example.com'}
                          size={40}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {row[mapping.title] || 'Untitled'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {row[mapping.contentType] || 'URL'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {(row[mapping.content] || '').substring(0, 30)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {row[mapping.tags] || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length > 5 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing 5 of {data.length} rows
              </p>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleUpload} loading={loading}>
                Create {data.length} QR Codes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h2>
            <p className="text-gray-600 mb-8">
              Successfully created {data.length} QR codes
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                View Dashboard
              </Button>
              <Button onClick={() => {
                setStep('upload');
                setData([]);
                setMapping({});
              }}>
                Upload More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}