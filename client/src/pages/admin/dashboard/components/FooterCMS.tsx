import { useState, useEffect } from 'react';
import { footerCmsApi } from '../../../../services/api';
import { FOOTER_ABOUT_US_LINKS } from '../../../about-us/aboutNavLinks';
import { BUSINESS_NAV_DROPDOWN } from '../../../../utils/businessNavLinks';
import { getFooterInvestorLinks } from '../../../../utils/footerLinks';

interface FooterLink {
  name: string;
  href: string;
  target?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  subsections?: Array<{
    title: string;
    links: FooterLink[];
  }>;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterData {
  id?: number;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  contactEmail?: string;
  cin?: string;
  nseScripCode?: string;
  bseScripSymbol?: string;
  isin?: string;
  complaintsTitle?: string;
  complaintsPhone?: string;
  complaintsPhoneUrl?: string;
  complaintsEmail?: string;
  copyrightText?: string;
  copyrightLink?: string;
  copyrightLinkText?: string;
  bottomLinks: FooterLink[];
  backgroundImage?: string;
  backgroundImageOpacity?: number;
  isActive: boolean;
}

// Default footer data structure
function getDefaultFooterData(): FooterData {
  return {
    sections: [
      {
        title: 'About Us',
        links: FOOTER_ABOUT_US_LINKS,
      },
      {
        title: 'Business',
        links: [...BUSINESS_NAV_DROPDOWN],
      },
      {
        title: 'Sustainability',
        links: [
          { name: 'Refex on ESG', href: '/esg/#refex-esg' },
          { name: 'ESG Policies', href: '/esg/#esg-policies' },
        ],
      },
      {
        title: 'Investors',
        links: getFooterInvestorLinks(),
      },
    ],
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/refexindustrieslimited/', icon: 'ri-facebook-fill' },
      { platform: 'Twitter/X', url: 'https://x.com/GroupRefex', icon: 'ri-twitter-x-fill' },
      { platform: 'YouTube', url: 'https://www.youtube.com/@refexgroup', icon: 'ri-youtube-fill' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/showcase/refexindustrieslimited/', icon: 'ri-linkedin-fill' },
      { platform: 'Instagram', url: 'https://www.instagram.com/refexgroup/', icon: 'ri-instagram-fill' },
    ],
    contactEmail: 'investor.relations@refex.co.in',
    cin: 'L45200TN2002PLC049601',
    nseScripCode: 'REFEX',
    bseScripSymbol: '532884',
    isin: 'INE056I01025',
    complaintsTitle: 'For any Complaints',
    complaintsPhone: '+91 96297 38734',
    complaintsPhoneUrl: 'https://web.whatsapp.com/',
    complaintsEmail: 'refexcares@refex.co.in',
    copyrightText: `© ${new Date().getFullYear()}`,
    copyrightLink: 'https://refex.co.in/#',
    copyrightLinkText: 'Refex Industries',
    bottomLinks: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Use', href: '/terms-of-use' },
    ],
    isActive: true,
  };
}

export default function FooterCMS() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  useEffect(() => {
    loadFooter();
  }, []);

  useEffect(() => {
    if (footerData) {
      setBackgroundImageUrl(footerData.backgroundImage || '');
    }
  }, [footerData]);

  const loadFooter = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await footerCmsApi.get();
      if (data) {
        setFooterData({
          sections: Array.isArray(data.sections) ? data.sections : [],
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          contactEmail: data.contactEmail || '',
          cin: data.cin || '',
          nseScripCode: data.nseScripCode || '',
          bseScripSymbol: data.bseScripSymbol || '',
          isin: data.isin || '',
          complaintsTitle: data.complaintsTitle || '',
          complaintsPhone: data.complaintsPhone || '',
          complaintsPhoneUrl: data.complaintsPhoneUrl || '',
          complaintsEmail: data.complaintsEmail || '',
          copyrightText: data.copyrightText || '',
          copyrightLink: data.copyrightLink || '',
          copyrightLinkText: data.copyrightLinkText || '',
          bottomLinks: Array.isArray(data.bottomLinks) ? data.bottomLinks : [],
          backgroundImage: data.backgroundImage !== undefined && data.backgroundImage !== null ? data.backgroundImage : '',
          backgroundImageOpacity: data.backgroundImageOpacity !== undefined ? data.backgroundImageOpacity : 0.1,
          isActive: data.isActive !== false,
        });
      } else {
        setFooterData(getDefaultFooterData());
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load footer data');
      }
      setFooterData(getDefaultFooterData());
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
        
        setBackgroundImageUrl(fullImageUrl);
        if (footerData) {
          setFooterData({ ...footerData, backgroundImage: fullImageUrl });
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
    if (!footerData) return;

    try {
      setError('');
      setSuccess('');
      // Ensure backgroundImage is included in the payload (even if empty string)
      const payloadToSave = {
        ...footerData,
        backgroundImage: backgroundImageUrl || footerData.backgroundImage || '',
        backgroundImageOpacity: footerData.backgroundImageOpacity !== undefined ? footerData.backgroundImageOpacity : 0.1,
      };
      
      const saved = await footerCmsApi.save(payloadToSave);
      
      setSuccess('Footer data saved successfully');
      
      // Update state with saved data directly (includes backgroundImage)
      if (saved) {
        // Preserve backgroundImage exactly as received, or use empty string if null/undefined
        const updatedBackgroundImage = (saved.backgroundImage !== null && saved.backgroundImage !== undefined && saved.backgroundImage !== '') 
          ? String(saved.backgroundImage).trim() 
          : '';
        
        setBackgroundImageUrl(updatedBackgroundImage);
        
        // Use functional update to ensure we get the latest state
        setFooterData((prevData) => {
          const updatedData: FooterData = {
            sections: Array.isArray(saved.sections) ? saved.sections : (prevData?.sections || []),
            socialLinks: Array.isArray(saved.socialLinks) ? saved.socialLinks : (prevData?.socialLinks || []),
            contactEmail: saved.contactEmail || prevData?.contactEmail || '',
            cin: saved.cin || prevData?.cin || '',
            nseScripCode: saved.nseScripCode || prevData?.nseScripCode || '',
            bseScripSymbol: saved.bseScripSymbol || prevData?.bseScripSymbol || '',
            isin: saved.isin || prevData?.isin || '',
            complaintsTitle: saved.complaintsTitle || prevData?.complaintsTitle || '',
            complaintsPhone: saved.complaintsPhone || prevData?.complaintsPhone || '',
            complaintsPhoneUrl: saved.complaintsPhoneUrl || prevData?.complaintsPhoneUrl || '',
            complaintsEmail: saved.complaintsEmail || prevData?.complaintsEmail || '',
            copyrightText: saved.copyrightText || prevData?.copyrightText || '',
            copyrightLink: saved.copyrightLink || prevData?.copyrightLink || '',
            copyrightLinkText: saved.copyrightLinkText || prevData?.copyrightLinkText || '',
            bottomLinks: Array.isArray(saved.bottomLinks) ? saved.bottomLinks : (prevData?.bottomLinks || []),
            backgroundImage: updatedBackgroundImage,
            backgroundImageOpacity: saved.backgroundImageOpacity !== undefined ? saved.backgroundImageOpacity : (prevData?.backgroundImageOpacity || 0.1),
            isActive: saved.isActive !== false,
          };
          
          return updatedData;
        });
      } else {
        // Fallback to reload if saved data not returned
        loadFooter();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save footer data');
      }
    }
  };

  const addSection = () => {
    if (!footerData) return;
    setFooterData({
      ...footerData,
      sections: [...footerData.sections, { title: '', links: [] }],
    });
  };

  const updateSection = (index: number, section: FooterSection) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    updated[index] = section;
    setFooterData({ ...footerData, sections: updated });
  };

  const removeSection = (index: number) => {
    if (!footerData) return;
    const updated = footerData.sections.filter((_, i) => i !== index);
    setFooterData({ ...footerData, sections: updated });
  };

  const addLink = (sectionIndex: number, subsectionIndex?: number) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    if (subsectionIndex !== undefined) {
      if (!updated[sectionIndex].subsections) {
        updated[sectionIndex].subsections = [];
      }
      if (!updated[sectionIndex].subsections![subsectionIndex].links) {
        updated[sectionIndex].subsections![subsectionIndex].links = [];
      }
      updated[sectionIndex].subsections![subsectionIndex].links.push({ name: '', href: '' });
    } else {
      if (!updated[sectionIndex].links) {
        updated[sectionIndex].links = [];
      }
      updated[sectionIndex].links.push({ name: '', href: '' });
    }
    setFooterData({ ...footerData, sections: updated });
  };

  const updateLink = (sectionIndex: number, linkIndex: number, link: FooterLink, subsectionIndex?: number) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    if (subsectionIndex !== undefined) {
      if (updated[sectionIndex].subsections) {
        updated[sectionIndex].subsections![subsectionIndex].links[linkIndex] = link;
      }
    } else {
      updated[sectionIndex].links[linkIndex] = link;
    }
    setFooterData({ ...footerData, sections: updated });
  };

  const removeLink = (sectionIndex: number, linkIndex: number, subsectionIndex?: number) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    if (subsectionIndex !== undefined) {
      if (updated[sectionIndex].subsections) {
        updated[sectionIndex].subsections![subsectionIndex].links = updated[sectionIndex].subsections![subsectionIndex].links.filter((_, i) => i !== linkIndex);
      }
    } else {
      updated[sectionIndex].links = updated[sectionIndex].links.filter((_, i) => i !== linkIndex);
    }
    setFooterData({ ...footerData, sections: updated });
  };

  const addSubsection = (sectionIndex: number) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    if (!updated[sectionIndex].subsections) {
      updated[sectionIndex].subsections = [];
    }
    updated[sectionIndex].subsections!.push({ title: '', links: [] });
    setFooterData({ ...footerData, sections: updated });
  };

  const removeSubsection = (sectionIndex: number, subsectionIndex: number) => {
    if (!footerData) return;
    const updated = [...footerData.sections];
    if (updated[sectionIndex].subsections) {
      updated[sectionIndex].subsections = updated[sectionIndex].subsections!.filter((_, i) => i !== subsectionIndex);
    }
    setFooterData({ ...footerData, sections: updated });
  };

  const addSocialLink = () => {
    if (!footerData) return;
    setFooterData({
      ...footerData,
      socialLinks: [...footerData.socialLinks, { platform: '', url: '', icon: '' }],
    });
  };

  const updateSocialLink = (index: number, link: SocialLink) => {
    if (!footerData) return;
    const updated = [...footerData.socialLinks];
    updated[index] = link;
    setFooterData({ ...footerData, socialLinks: updated });
  };

  const removeSocialLink = (index: number) => {
    if (!footerData) return;
    const updated = footerData.socialLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, socialLinks: updated });
  };

  const addBottomLink = () => {
    if (!footerData) return;
    setFooterData({
      ...footerData,
      bottomLinks: [...footerData.bottomLinks, { name: '', href: '' }],
    });
  };

  const updateBottomLink = (index: number, link: FooterLink) => {
    if (!footerData) return;
    const updated = [...footerData.bottomLinks];
    updated[index] = link;
    setFooterData({ ...footerData, bottomLinks: updated });
  };

  const removeBottomLink = (index: number) => {
    if (!footerData) return;
    const updated = footerData.bottomLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, bottomLinks: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading footer data...</p>
        </div>
      </div>
    );
  }

  if (!footerData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No footer data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Footer CMS</h2>

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
        {/* Footer Sections */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Footer Sections</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('This will replace all current sections with default sections. Continue?')) {
                    setFooterData({ ...footerData!, sections: getDefaultFooterData().sections });
                    setSuccess('Default sections loaded');
                    setTimeout(() => setSuccess(''), 3000);
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <i className="ri-refresh-line mr-1"></i> Load Defaults
              </button>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <i className="ri-add-line mr-1"></i> Add Section
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {footerData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, { ...section, title: e.target.value })}
                      />
                    </div>
                    {/* Main Links */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Links</label>
                        <button
                          type="button"
                          onClick={() => addLink(sectionIndex)}
                          className="px-3 py-1 bg-[#7cd244] text-white rounded text-xs hover:bg-[#6db038]"
                        >
                          <i className="ri-add-line mr-1"></i> Add Link
                        </button>
                      </div>
                      {section.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="ml-4 mt-2 p-3 bg-gray-50 rounded border border-gray-200 flex gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            className="flex-1 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                            value={link.name}
                            onChange={(e) => updateLink(sectionIndex, linkIndex, { ...link, name: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Href"
                            className="flex-1 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                            value={link.href}
                            onChange={(e) => updateLink(sectionIndex, linkIndex, { ...link, href: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Target (optional)"
                            className="w-24 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                            value={link.target || ''}
                            onChange={(e) => updateLink(sectionIndex, linkIndex, { ...link, target: e.target.value || undefined })}
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(sectionIndex, linkIndex)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Subsections */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Subsections</label>
                        <button
                          type="button"
                          onClick={() => addSubsection(sectionIndex)}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        >
                          <i className="ri-add-line mr-1"></i> Add Subsection
                        </button>
                      </div>
                      {section.subsections && section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="ml-4 mt-2 p-3 bg-purple-50 rounded border border-purple-200 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Subsection Title"
                              className="flex-1 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                              value={subsection.title}
                              onChange={(e) => {
                                const updated = [...footerData.sections];
                                if (updated[sectionIndex].subsections) {
                                  updated[sectionIndex].subsections![subsectionIndex].title = e.target.value;
                                  setFooterData({ ...footerData, sections: updated });
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                          <div className="ml-4 space-y-2">
                            {subsection.links.map((link, linkIndex) => (
                              <div key={linkIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  className="flex-1 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                                  value={link.name}
                                  onChange={(e) => updateLink(sectionIndex, linkIndex, { ...link, name: e.target.value }, subsectionIndex)}
                                />
                                <input
                                  type="text"
                                  placeholder="Href"
                                  className="flex-1 border-gray-300 rounded shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244] text-sm"
                                  value={link.href}
                                  onChange={(e) => updateLink(sectionIndex, linkIndex, { ...link, href: e.target.value }, subsectionIndex)}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeLink(sectionIndex, linkIndex, subsectionIndex)}
                                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addLink(sectionIndex, subsectionIndex)}
                              className="px-2 py-1 bg-[#7cd244] text-white rounded text-xs hover:bg-[#6db038]"
                            >
                              <i className="ri-add-line mr-1"></i> Add Link
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="ml-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Social Media Links</h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <i className="ri-add-line mr-1"></i> Add Social Link
            </button>
          </div>
          <div className="space-y-4">
            {footerData.socialLinks.map((link, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Platform (e.g., Facebook)"
                  className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, { ...link, platform: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="URL"
                  className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, { ...link, url: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Icon (e.g., ri-facebook-fill)"
                  className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, { ...link, icon: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.contactEmail || ''}
                onChange={(e) => setFooterData({ ...footerData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CIN</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.cin || ''}
                onChange={(e) => setFooterData({ ...footerData, cin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NSE Scrip Code</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.nseScripCode || ''}
                onChange={(e) => setFooterData({ ...footerData, nseScripCode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BSE Scrip Symbol</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.bseScripSymbol || ''}
                onChange={(e) => setFooterData({ ...footerData, bseScripSymbol: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ISIN</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.isin || ''}
                onChange={(e) => setFooterData({ ...footerData, isin: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Complaints Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.complaintsTitle || ''}
                onChange={(e) => setFooterData({ ...footerData, complaintsTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.complaintsPhone || ''}
                onChange={(e) => setFooterData({ ...footerData, complaintsPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone URL</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.complaintsPhoneUrl || ''}
                onChange={(e) => setFooterData({ ...footerData, complaintsPhoneUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.complaintsEmail || ''}
                onChange={(e) => setFooterData({ ...footerData, complaintsEmail: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Copyright & Bottom Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.copyrightText || ''}
                onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Link</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.copyrightLink || ''}
                onChange={(e) => setFooterData({ ...footerData, copyrightLink: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Link Text</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.copyrightLinkText || ''}
                onChange={(e) => setFooterData({ ...footerData, copyrightLinkText: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Bottom Links</label>
              <button
                type="button"
                onClick={addBottomLink}
                className="px-3 py-1 bg-[#7cd244] text-white rounded text-xs hover:bg-[#6db038]"
              >
                <i className="ri-add-line mr-1"></i> Add Link
              </button>
            </div>
            <div className="space-y-2">
              {footerData.bottomLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                    value={link.name}
                    onChange={(e) => updateBottomLink(index, { ...link, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Href"
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                    value={link.href}
                    onChange={(e) => updateBottomLink(index, { ...link, href: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeBottomLink(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Background Image</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Background Image
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent outline-none"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a background image file (max 10MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL
              </label>
              {backgroundImageUrl ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                    {backgroundImageUrl}
                  </div>
                  <div className="mt-2">
                    <img 
                      src={backgroundImageUrl} 
                      alt="Background Preview" 
                      className="max-w-full h-auto max-h-48 rounded-lg shadow"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                  No background image uploaded yet. Please upload an image above.
                </div>
              )}
            </div>
            <div>
              <label htmlFor="backgroundImageOpacity" className="block text-sm font-medium text-gray-700 mb-2">
                Background Image Opacity (0.0 - 1.0)
              </label>
              <input
                type="number"
                id="backgroundImageOpacity"
                min="0"
                max="1"
                step="0.1"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
                value={footerData.backgroundImageOpacity !== undefined ? footerData.backgroundImageOpacity : 0.1}
                onChange={(e) => setFooterData({ ...footerData, backgroundImageOpacity: parseFloat(e.target.value) || 0.1 })}
              />
              <p className="mt-1 text-xs text-gray-500">Lower values make the image more subtle. Recommended: 0.1 - 0.3</p>
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-[#4f8f2a] border-gray-300 rounded"
            checked={footerData.isActive}
            onChange={(e) => setFooterData({ ...footerData, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#7cd244] text-white rounded-lg hover:bg-[#6db038] transition-colors"
          >
            Save Footer Data
          </button>
        </div>
      </form>
    </div>
  );
}

