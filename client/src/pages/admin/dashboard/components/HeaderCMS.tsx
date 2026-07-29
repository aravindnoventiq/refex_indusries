import { useState, useEffect } from 'react';
import { headerCmsApi } from '../../../../services/api';
import { ABOUT_US_NAV_DROPDOWN } from '../../../about-us/aboutNavLinks';
import { BUSINESS_NAV_DROPDOWN } from '../../../../utils/businessNavLinks';

const POWER_TRADING_SURRENDER_PETITION_PDF =
  'https://refex.co.in/uploads/pdfs/pdf-1783071359067-610585102.pdf';

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: Array<{
    name: string;
    href: string;
    hasSubmenu?: boolean;
    submenu?: Array<{ name: string; href: string }>;
  }>;
}

interface HeaderData {
  id?: number;
  logoUrl: string;
  logoAlt?: string;
  showStockInfo: boolean;
  bsePrice?: string;
  bseChange?: string;
  bseChangeIndicator?: 'up' | 'down';
  nsePrice?: string;
  nseChange?: string;
  nseChangeIndicator?: 'up' | 'down';
  navigationItems: NavigationItem[];
  contactButtonText: string;
  contactButtonHref: string;
  isActive: boolean;
}

const isSmartOdrEntry = (name?: string, href?: string): boolean => {
  const normalizedName = String(name || "").trim().toLowerCase();
  const normalizedHref = String(href || "").trim().toLowerCase().replace(/\/$/, "");
  return (
    normalizedName === "smart odr" ||
    normalizedHref === "/investors/smart-odr" ||
    normalizedHref.includes("/investors/smart-odr")
  );
};

const sanitizeNavigationItems = (items: NavigationItem[]): NavigationItem[] =>
  (items || [])
    .filter((item) => !isSmartOdrEntry(item.name, item.href))
    .map((item) => ({
      ...item,
      dropdown: (item.dropdown || [])
        .filter((dropItem) => !isSmartOdrEntry(dropItem.name, dropItem.href))
        .map((dropItem) => ({
          ...dropItem,
          submenu: (dropItem.submenu || []).filter(
            (subItem) => !isSmartOdrEntry(subItem.name, subItem.href)
          ),
        }))
        .filter((dropItem) => {
          if (!dropItem.hasSubmenu) return true;
          return (dropItem.submenu || []).length > 0;
        }),
    }));

// Default navigation items structure
function getDefaultNavigationItems(): NavigationItem[] {
  return [
    { 
      name: 'Home', 
      href: '/',
      dropdown: []
    },
    { 
      name: 'About Us', 
      href: '/about-us',
      dropdown: ABOUT_US_NAV_DROPDOWN,
    },
    { 
      name: 'Business', 
      href: '#business',
      dropdown: [...BUSINESS_NAV_DROPDOWN],
    },
    { 
      name: 'Investors', 
      href: '/investors',
      dropdown: []
    },
    { 
      name: 'ESG', 
      href: '/esg',
      dropdown: []
    },
    {
      name: 'Careers',
      href: '/careers/',
      dropdown: [],
    },
    {
      name: 'Power Trading Surrender Petition',
      href: POWER_TRADING_SURRENDER_PETITION_PDF,
      dropdown: [],
    },
  ];
}

export default function HeaderCMS() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    loadHeader();
  }, []);

  useEffect(() => {
    if (headerData) {
      setLogoUrl(headerData.logoUrl || '');
    }
  }, [headerData]);

  const loadHeader = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await headerCmsApi.get();
      if (data) {
        setHeaderData({
          logoUrl: data.logoUrl || '',
          logoAlt: data.logoAlt || '',
          showStockInfo: data.showStockInfo !== false,
          bsePrice: data.bsePrice || '',
          bseChange: data.bseChange || '',
          bseChangeIndicator: data.bseChangeIndicator || 'down',
          nsePrice: data.nsePrice || '',
          nseChange: data.nseChange || '',
          nseChangeIndicator: data.nseChangeIndicator || 'down',
          navigationItems: Array.isArray(data.navigationItems) ? sanitizeNavigationItems(data.navigationItems) : [],
          contactButtonText: data.contactButtonText || 'Contact Us',
          contactButtonHref: data.contactButtonHref || '/contact/',
          isActive: data.isActive !== false,
        });
      } else {
        // Default data with navigation items
        setHeaderData({
          logoUrl: 'https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg',
          logoAlt: 'Refex Industries Limited',
          showStockInfo: true,
          bsePrice: '324.45',
          bseChange: '-0.23%',
          bseChangeIndicator: 'down',
          nsePrice: '323.35',
          nseChange: '-0.51%',
          nseChangeIndicator: 'down',
          navigationItems: getDefaultNavigationItems(),
          contactButtonText: 'Contact Us',
          contactButtonHref: '/contact/',
          isActive: true,
        });
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load header data');
      }
      // Fallback to default data with navigation items
      setHeaderData({
        logoUrl: 'https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg',
        logoAlt: 'Refex Industries Limited',
        showStockInfo: true,
        bsePrice: '324.45',
        bseChange: '-0.23%',
        bseChangeIndicator: 'down',
        nsePrice: '323.35',
        nseChange: '-0.51%',
        nseChangeIndicator: 'down',
        navigationItems: getDefaultNavigationItems(),
        contactButtonText: 'Contact Us',
        contactButtonHref: '/contact/',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBaseUrl}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        const fullImageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${apiBaseUrl}${data.imageUrl}`;
        
        setLogoUrl(fullImageUrl);
        if (headerData) {
          setHeaderData({ ...headerData, logoUrl: fullImageUrl });
        }
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!headerData) return;

    if (!logoUrl.trim()) {
      setError('Logo is required. Please upload a logo image.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const headerDataToSave = {
        ...headerData,
        logoUrl: logoUrl || headerData.logoUrl,
      };
      await headerCmsApi.save(headerDataToSave);
      setSuccess('Header data saved successfully');
      loadHeader();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save header data');
      }
    }
  };

  const addNavigationItem = () => {
    if (!headerData) return;
    setHeaderData({
      ...headerData,
      navigationItems: [
        ...headerData.navigationItems,
        { name: '', href: '', dropdown: [] },
      ],
    });
  };

  const updateNavigationItem = (index: number, item: NavigationItem) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    updated[index] = item;
    setHeaderData({ ...headerData, navigationItems: updated });
  };

  const removeNavigationItem = (index: number) => {
    if (!headerData) return;
    const updated = headerData.navigationItems.filter((_, i) => i !== index);
    setHeaderData({ ...headerData, navigationItems: updated });
  };

  const addDropdownItem = (navIndex: number) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (!updated[navIndex].dropdown) {
      updated[navIndex].dropdown = [];
    }
    updated[navIndex].dropdown!.push({ name: '', href: '' });
    setHeaderData({ ...headerData, navigationItems: updated });
  };

  const updateDropdownItem = (navIndex: number, dropIndex: number, item: any) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (updated[navIndex].dropdown) {
      updated[navIndex].dropdown![dropIndex] = item;
      setHeaderData({ ...headerData, navigationItems: updated });
    }
  };

  const removeDropdownItem = (navIndex: number, dropIndex: number) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (updated[navIndex].dropdown) {
      updated[navIndex].dropdown = updated[navIndex].dropdown!.filter((_, i) => i !== dropIndex);
      setHeaderData({ ...headerData, navigationItems: updated });
    }
  };

  const addSubmenuItem = (navIndex: number, dropIndex: number) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (updated[navIndex].dropdown && updated[navIndex].dropdown[dropIndex]) {
      if (!updated[navIndex].dropdown[dropIndex].submenu) {
        updated[navIndex].dropdown[dropIndex].submenu = [];
        updated[navIndex].dropdown[dropIndex].hasSubmenu = true;
      }
      updated[navIndex].dropdown[dropIndex].submenu!.push({ name: '', href: '' });
      setHeaderData({ ...headerData, navigationItems: updated });
    }
  };

  const updateSubmenuItem = (navIndex: number, dropIndex: number, subIndex: number, item: { name: string; href: string }) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (updated[navIndex].dropdown && updated[navIndex].dropdown[dropIndex].submenu) {
      updated[navIndex].dropdown[dropIndex].submenu![subIndex] = item;
      setHeaderData({ ...headerData, navigationItems: updated });
    }
  };

  const removeSubmenuItem = (navIndex: number, dropIndex: number, subIndex: number) => {
    if (!headerData) return;
    const updated = [...headerData.navigationItems];
    if (updated[navIndex].dropdown && updated[navIndex].dropdown[dropIndex].submenu) {
      updated[navIndex].dropdown[dropIndex].submenu = updated[navIndex].dropdown[dropIndex].submenu!.filter((_, i) => i !== subIndex);
      if (updated[navIndex].dropdown[dropIndex].submenu!.length === 0) {
        updated[navIndex].dropdown[dropIndex].hasSubmenu = false;
        delete updated[navIndex].dropdown[dropIndex].submenu;
      }
      setHeaderData({ ...headerData, navigationItems: updated });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading header data...</p>
        </div>
      </div>
    );
  }

  if (!headerData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No header data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Header CMS</h2>

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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Logo Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo *
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a logo image file (max 10MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              {logoUrl ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                    {logoUrl}
                  </div>
                  <div className="mt-2">
                    <img src={logoUrl} alt={headerData.logoAlt || 'Logo'} className="max-h-20 h-auto rounded-lg shadow" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                  No logo uploaded yet. Please upload a logo image above.
                </div>
              )}
            </div>
            <div>
              <label htmlFor="logoAlt" className="block text-sm font-medium text-gray-700 mb-2">
                Logo Alt Text
              </label>
              <input
                type="text"
                id="logoAlt"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={headerData.logoAlt || ''}
                onChange={(e) => setHeaderData({ ...headerData, logoAlt: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Stock Info Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Stock Information</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showStockInfo"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={headerData.showStockInfo}
                onChange={(e) => setHeaderData({ ...headerData, showStockInfo: e.target.checked })}
              />
              <label htmlFor="showStockInfo" className="ml-2 block text-sm text-gray-900">
                Show Stock Information
              </label>
            </div>
            {headerData.showStockInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div className="space-y-4 border p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">BSE</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.bsePrice || ''}
                      onChange={(e) => setHeaderData({ ...headerData, bsePrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.bseChange || ''}
                      onChange={(e) => setHeaderData({ ...headerData, bseChange: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indicator</label>
                    <select
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.bseChangeIndicator || 'down'}
                      onChange={(e) => setHeaderData({ ...headerData, bseChangeIndicator: e.target.value as 'up' | 'down' })}
                    >
                      <option value="down">Down</option>
                      <option value="up">Up</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4 border p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">NSE</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.nsePrice || ''}
                      onChange={(e) => setHeaderData({ ...headerData, nsePrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.nseChange || ''}
                      onChange={(e) => setHeaderData({ ...headerData, nseChange: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indicator</label>
                    <select
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={headerData.nseChangeIndicator || 'down'}
                      onChange={(e) => setHeaderData({ ...headerData, nseChangeIndicator: e.target.value as 'up' | 'down' })}
                    >
                      <option value="down">Down</option>
                      <option value="up">Up</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Navigation Items</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('This will replace all current navigation items with default items. Continue?')) {
                    setHeaderData({ ...headerData!, navigationItems: getDefaultNavigationItems() });
                    setSuccess('Default navigation items loaded');
                    setTimeout(() => setSuccess(''), 3000);
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <i className="ri-refresh-line mr-1"></i> Load Defaults
              </button>
              <button
                type="button"
                onClick={addNavigationItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <i className="ri-add-line mr-1"></i> Add Navigation Item
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {headerData.navigationItems.map((item, navIndex) => (
              <div key={navIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.name}
                          onChange={(e) => updateNavigationItem(navIndex, { ...item, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Href</label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.href}
                          onChange={(e) => updateNavigationItem(navIndex, { ...item, href: e.target.value })}
                        />
                      </div>
                    </div>
                    {/* Dropdown Items */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Dropdown Items</label>
                        <button
                          type="button"
                          onClick={() => addDropdownItem(navIndex)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          <i className="ri-add-line mr-1"></i> Add Dropdown
                        </button>
                      </div>
                      {item.dropdown && item.dropdown.map((dropItem, dropIndex) => (
                        <div key={dropIndex} className="ml-4 mt-2 p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Name"
                              className="w-full border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              value={dropItem.name}
                              onChange={(e) => updateDropdownItem(navIndex, dropIndex, { ...dropItem, name: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Href"
                                className="flex-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                value={dropItem.href}
                                onChange={(e) => updateDropdownItem(navIndex, dropIndex, { ...dropItem, href: e.target.value })}
                              />
                              <button
                                type="button"
                                onClick={() => removeDropdownItem(navIndex, dropIndex)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                          {/* Submenu */}
                          {dropItem.hasSubmenu && (
                            <div className="ml-4 mt-2 space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-gray-700">Submenu Items</label>
                                <button
                                  type="button"
                                  onClick={() => addSubmenuItem(navIndex, dropIndex)}
                                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                >
                                  <i className="ri-add-line mr-1"></i> Add Submenu
                                </button>
                              </div>
                              {dropItem.submenu && dropItem.submenu.map((subItem, subIndex) => (
                                <div key={subIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Name"
                                    className="flex-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    value={subItem.name}
                                    onChange={(e) => updateSubmenuItem(navIndex, dropIndex, subIndex, { ...subItem, name: e.target.value })}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Href"
                                    className="flex-1 border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    value={subItem.href}
                                    onChange={(e) => updateSubmenuItem(navIndex, dropIndex, subIndex, { ...subItem, href: e.target.value })}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeSubmenuItem(navIndex, dropIndex, subIndex)}
                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...headerData.navigationItems];
                                  if (updated[navIndex].dropdown) {
                                    updated[navIndex].dropdown[dropIndex].hasSubmenu = false;
                                    delete updated[navIndex].dropdown[dropIndex].submenu;
                                    setHeaderData({ ...headerData, navigationItems: updated });
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Remove Submenu
                              </button>
                            </div>
                          )}
                          {!dropItem.hasSubmenu && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...headerData.navigationItems];
                                if (updated[navIndex].dropdown) {
                                  updated[navIndex].dropdown[dropIndex].hasSubmenu = true;
                                  updated[navIndex].dropdown[dropIndex].submenu = [];
                                  setHeaderData({ ...headerData, navigationItems: updated });
                                }
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Add Submenu
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNavigationItem(navIndex)}
                    className="ml-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
            {headerData.navigationItems.length === 0 && (
              <p className="text-gray-500 text-sm">No navigation items. Click "Add Navigation Item" to add one.</p>
            )}
          </div>
        </div>

        {/* Contact Button Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Button</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactButtonText" className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                id="contactButtonText"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={headerData.contactButtonText}
                onChange={(e) => setHeaderData({ ...headerData, contactButtonText: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="contactButtonHref" className="block text-sm font-medium text-gray-700 mb-2">
                Button Href
              </label>
              <input
                type="text"
                id="contactButtonHref"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={headerData.contactButtonHref}
                onChange={(e) => setHeaderData({ ...headerData, contactButtonHref: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={headerData.isActive}
            onChange={(e) => setHeaderData({ ...headerData, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Header Data
          </button>
        </div>
      </form>
    </div>
  );
}

