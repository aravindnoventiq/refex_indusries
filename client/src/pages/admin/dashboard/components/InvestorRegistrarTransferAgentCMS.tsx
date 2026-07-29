import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

interface RegistrarTransferAgentData {
  id?: number;
  name: string;
  iconUrl?: string;
  address?: string;
  address2?: string;
  address3?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export default function InvestorRegistrarTransferAgentCMS() {
  const [data, setData] = useState<RegistrarTransferAgentData>({
    name: '',
    iconUrl: '',
    address: '',
    address2: '',
    address3: '',
    phone: '',
    email: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Try to load from a custom endpoint or use a page content structure
      // For now, we'll use a simple structure stored in page content
      const pageData = await investorsCmsApi.getPageContentBySlug('registrar-transfer-agent');
      if (pageData && pageData.sections && pageData.sections.length > 0) {
        // Extract data from sections or use a different structure
        // Since this is a simple contact page, we'll store it in a content field
        const content = pageData.sections[0]?.contents?.[0];
        if (content) {
          // Parse content to extract structured data
          const parsedData = parseContentToData(content);
          setData(parsedData);
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load Registrar Transfer Agent data');
      }
      // Use default structure if not found
      setData({
        name: 'Mr. R. D. Ramasamy, Director - M/s CAMEO CORPORATE SERVICES LIMITED',
        iconUrl: 'https://refex.co.in/wp-content/uploads/2025/02/corporate-icon.png',
        address: 'Subramanian Building,',
        address2: 'No.1, Club House Road,',
        address3: 'Chennai- 600002, Tamil Nadu.',
        phone: '044-28460390',
        email: 'investor@cameoindia.com',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const parseContentToData = (content: any): RegistrarTransferAgentData => {
    // Parse content string to extract structured data
    const contentStr = content.content || '';
    const lines = contentStr.split('\n').map(line => line.trim()).filter(line => line);
    
    const addressLines: string[] = [];
    let phone = '';
    let email = '';
    
    lines.forEach((line) => {
      if (line.toLowerCase().startsWith('phone:')) {
        phone = line.replace(/^phone:\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('email:')) {
        email = line.replace(/^email:\s*/i, '').trim();
      } else {
        addressLines.push(line);
      }
    });
    
    return {
      name: content.title || '',
      iconUrl: 'https://refex.co.in/wp-content/uploads/2025/02/corporate-icon.png', // Default icon
      address: addressLines[0] || '',
      address2: addressLines[1] || '',
      address3: addressLines[2] || '',
      phone: phone,
      email: email,
      isActive: true,
    };
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      if (!data.name.trim()) {
        setError('Name is required');
        return;
      }

      // Store as page content with a content section
      const pageContent = {
        slug: 'registrar-transfer-agent',
        title: 'Registrar & Transfer Agent',
        hasYearFilter: false,
        filterItems: [],
        sections: [
          {
            title: 'Registrar & Transfer Agent',
            documents: [],
            contents: [
              {
                title: data.name,
                subtitle: '',
                content: `${data.address || ''}\n${data.address2 || ''}\n${data.address3 || ''}\nPhone: ${data.phone || ''}\nEmail: ${data.email || ''}`,
              },
            ],
            audios: [],
          },
        ],
        isActive: data.isActive,
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('registrar-transfer-agent');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, pageContent);
        setSuccess('Registrar Transfer Agent updated successfully');
      } else {
        await investorsCmsApi.createPageContent(pageContent);
        setSuccess('Registrar Transfer Agent created successfully');
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save Registrar Transfer Agent');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Registrar Transfer Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registrar & Transfer Agent CMS</h2>
        <p className="text-sm text-gray-600 mt-1">Manage Registrar & Transfer Agent contact information</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name/Title *
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="e.g., Mr. R. D. Ramasamy, Director - M/s CAMEO CORPORATE SERVICES LIMITED"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon/Image URL
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.iconUrl || ''}
              onChange={(e) => setData({ ...data, iconUrl: e.target.value })}
              placeholder="https://example.com/icon.png"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.address || ''}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              placeholder="e.g., Subramanian Building,"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.address2 || ''}
              onChange={(e) => setData({ ...data, address2: e.target.value })}
              placeholder="e.g., No.1, Club House Road,"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 3
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.address3 || ''}
              onChange={(e) => setData({ ...data, address3: e.target.value })}
              placeholder="e.g., Chennai- 600002, Tamil Nadu."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.phone || ''}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="e.g., 044-28460390"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={data.email || ''}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="e.g., investor@cameoindia.com"
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={data.isActive}
              onChange={(e) => setData({ ...data, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

