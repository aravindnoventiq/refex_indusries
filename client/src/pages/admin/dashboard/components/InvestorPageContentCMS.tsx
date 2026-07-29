import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';
import { slugify } from '../../../../utils/slugify';

const API_BASE_URL = "";

interface Document {
  title: string;
  date: string;
  year: string;
  pdfUrl: string;
}

interface Content {
  title: string;
  subtitle: string;
  content: string;
}

interface Audio {
  name: string;
  year: string;
  audioUrl: string;
  pdfUrl: string;
}

interface Section {
  title: string;
  documents: Document[];
  contents?: Content[];
  audios?: Audio[];
}

interface InvestorPage {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  filterItems?: string[];
  sections: Section[];
  isActive: boolean;
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
}

export default function InvestorPageContentCMS() {
  const [pages, setPages] = useState<InvestorPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<InvestorPage | null>(null);
  const [pageContent, setPageContent] = useState<InvestorPage>({
    slug: '',
    title: '',
    hasYearFilter: false,
    filterItems: [],
    sections: [],
    isActive: true,
    showPublishDate: false,
    showCmsPublishDate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingDocument, setEditingDocument] = useState<{ sectionIndex: number; document: Document | null; documentIndex: number } | null>(null);
  const [editingContent, setEditingContent] = useState<{ sectionIndex: number; content: Content | null; contentIndex: number } | null>(null);
  const [editingAudio, setEditingAudio] = useState<{ sectionIndex: number; audio: Audio | null; audioIndex: number } | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showAudioForm, setShowAudioForm] = useState(false);
  const [showFilterItemForm, setShowFilterItemForm] = useState(false);
  const [editingFilterItem, setEditingFilterItem] = useState<string>('');
  const [editingFilterIndex, setEditingFilterIndex] = useState<number>(-1);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingAudioPdf, setUploadingAudioPdf] = useState(false);
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

  const handleDocumentPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDocument?.document) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('PDF size should be less than 50MB');
      return;
    }

    setUploadingPdf(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const subfolder = pageContent.slug || 'general';
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/${subfolder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: data.pdfUrl }
      });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleAudioPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAudio?.audio) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('PDF size should be less than 50MB');
      return;
    }

    setUploadingAudioPdf(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const subfolder = pageContent.slug || 'general';
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/${subfolder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingAudio({
        ...editingAudio,
        audio: { ...editingAudio.audio, pdfUrl: data.pdfUrl }
      });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingAudioPdf(false);
    }
  };

  useEffect(() => {
    loadAllPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage.slug);
    }
  }, [selectedPage]);

  const loadAllPages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getAllPageContent();
      setPages(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load pages');
      }
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async (slug: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getPageContentBySlug(slug);
      if (data) {
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const pageData = {
          ...data,
          filterItems: Array.isArray(filterItems) ? filterItems : [],
          showPublishDate: data.showPublishDate || (data as any).show_publish_date || false,
          showCmsPublishDate: data.showCmsPublishDate || (data as any).show_cms_publish_date || false,
          isActive: data.isActive !== undefined ? data.isActive : (data as any).is_active !== undefined ? (data as any).is_active : true,
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load page content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) {
      setError('Page title is required');
      return;
    }

    const slug = slugify(newPageTitle);

    // Check if slug already exists
    const existingPage = pages.find(p => p.slug === slug);
    if (existingPage) {
      setError('A page with this title already exists');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const newPage = {
        slug: slug,
        title: newPageTitle.trim(),
        hasYearFilter: false,
        filterItems: [],
        sections: [],
        isActive: true,
        showPublishDate: false,
        showCmsPublishDate: false,
      };
      await investorsCmsApi.createPageContent(newPage);

      // Automatically create a related link for this page
      try {
        const href = `/investors/${slug}/`;
        // Check if link already exists
        const existingLinks = await investorsCmsApi.getRelatedLinks();
        const linkExists = existingLinks.some((link: any) => link.href === href);

        if (!linkExists) {
          await investorsCmsApi.createRelatedLink({
            name: newPageTitle.trim(),
            href: href,
            displayOrder: existingLinks.length,
            isActive: true,
          });
          setSuccess('Page and related link created successfully');
        } else {
          setSuccess('Page created successfully. Related link already exists.');
        }
      } catch (linkErr: any) {
        console.error('Failed to create related link:', linkErr);
        setSuccess('Page created successfully, but failed to create related link: ' + (linkErr.message || 'Unknown error'));
      }

      setNewPageTitle('');
      setShowNewPageForm(false);
      await loadAllPages();
      // Select the newly created page
      const createdPage = await investorsCmsApi.getPageContentBySlug(slug);
      if (createdPage) {
        setSelectedPage(createdPage);
      }
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to create page');
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      const saveData = {
        ...pageContent,
        filterItems: pageContent.filterItems || [],
        show_publish_date: pageContent.showPublishDate,
        show_cms_publish_date: pageContent.showCmsPublishDate,
        is_active: pageContent.isActive,
      };

      const isNewPage = !pageContent.id;

      if (pageContent.id) {
        await investorsCmsApi.updatePageContent(pageContent.id, saveData);
        setSuccess('Page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Page created successfully');
      }

      // Ensure related link exists for this page
      if (pageContent.slug && pageContent.isActive) {
        try {
          const href = `/investors/${pageContent.slug}/`;
          const existingLinks = await investorsCmsApi.getRelatedLinks();
          const linkExists = existingLinks.some((link: any) => {
            const linkHref = link.href.replace(/\/$/, '');
            const pageHref = href.replace(/\/$/, '');
            return linkHref === pageHref;
          });

          if (!linkExists) {
            await investorsCmsApi.createRelatedLink({
              name: pageContent.title,
              href: href,
              displayOrder: existingLinks.length,
              isActive: true,
            });
            if (isNewPage) {
              setSuccess('Page and related link created successfully');
            } else {
              setSuccess('Page updated and related link created successfully');
            }
          }
        } catch (linkErr: any) {
          console.error('Failed to create/update related link:', linkErr);
          // Don't fail the whole operation if link creation fails
        }
      }

      await loadPageContent(pageContent.slug);
      await loadAllPages();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to save page');
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }
    try {
      await investorsCmsApi.deletePageContent(id);
      setSuccess('Page deleted successfully');
      await loadAllPages();
      if (selectedPage?.id === id) {
        setSelectedPage(null);
        setPageContent({
          slug: '',
          title: '',
          hasYearFilter: false,
          filterItems: [],
          sections: [],
          isActive: true,
          showPublishDate: false,
          showCmsPublishDate: false,
        });
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete page');
    }
  };

  // Filter items handlers
  const handleAddFilterItem = () => {
    setEditingFilterItem('');
    setEditingFilterIndex(-1);
    setShowFilterItemForm(true);
    setError('');
  };

  const handleEditFilterItem = (index: number) => {
    const filterItems = pageContent.filterItems || [];
    setEditingFilterItem(filterItems[index]);
    setEditingFilterIndex(index);
    setShowFilterItemForm(true);
    setError('');
  };

  const handleDeleteFilterItem = (index: number) => {
    if (!confirm('Are you sure you want to delete this filter item?')) {
      return;
    }
    const filterItems = [...(pageContent.filterItems || [])];
    filterItems.splice(index, 1);
    setPageContent({ ...pageContent, filterItems });
  };

  const handleSaveFilterItem = () => {
    if (!editingFilterItem.trim()) {
      setError('Filter item (year) is required');
      return;
    }

    const filterItems = [...(pageContent.filterItems || [])];

    if (filterItems.includes(editingFilterItem.trim()) && editingFilterIndex < 0) {
      setError('This filter item already exists');
      return;
    }

    if (editingFilterIndex >= 0) {
      filterItems[editingFilterIndex] = editingFilterItem.trim();
    } else {
      filterItems.push(editingFilterItem.trim());
    }

    filterItems.sort((a, b) => b.localeCompare(a));

    setPageContent({ ...pageContent, filterItems });
    setEditingFilterItem('');
    setEditingFilterIndex(-1);
    setShowFilterItemForm(false);
    setError('');
  };

  // Section handlers
  const handleAddSection = () => {
    setEditingSection({
      title: '',
      documents: [],
      contents: [],
      audios: [],
    });
    setShowSectionForm(true);
    setError('');
  };

  const handleEditSection = (section: Section, index: number) => {
    setEditingSection({ ...section });
    setShowSectionForm(true);
    setError('');
  };

  const handleDeleteSection = (index: number) => {
    if (!confirm('Are you sure you want to delete this section? All documents in this section will also be deleted.')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections.splice(index, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveSection = () => {
    if (!editingSection || !editingSection.title.trim()) {
      setError('Section title is required');
      return;
    }

    const updatedSections = [...pageContent.sections];
    const existingIndex = updatedSections.findIndex(s => s.title === editingSection.title && s !== editingSection);

    if (existingIndex >= 0) {
      setError('A section with this title already exists');
      return;
    }

    const sectionIndex = updatedSections.findIndex(s => s.title === editingSection.title);
    if (sectionIndex >= 0) {
      updatedSections[sectionIndex] = editingSection;
    } else {
      updatedSections.push(editingSection);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setShowSectionForm(false);
    setEditingSection(null);
    setError('');
  };

  // Document handlers
  const handleAddDocument = (sectionIndex: number) => {
    setEditingDocument({
      sectionIndex,
      document: {
        title: '',
        date: '',
        year: '',
        pdfUrl: '',
      },
      documentIndex: -1,
    });
    setShowDocumentForm(true);
    setIsManualPdfUrl(false);
    setError('');
  };

  const handleEditDocument = (sectionIndex: number, documentIndex: number) => {
    const document = pageContent.sections[sectionIndex].documents[documentIndex];
    setEditingDocument({
      sectionIndex,
      document: { ...document },
      documentIndex,
    });
    setShowDocumentForm(true);
    setIsManualPdfUrl(false);
    setError('');
  };

  const handleDeleteDocument = (sectionIndex: number, documentIndex: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections[sectionIndex].documents.splice(documentIndex, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveDocument = () => {
    if (!editingDocument || !editingDocument.document) {
      return;
    }

    const doc = editingDocument.document;
    if (!doc.title.trim()) {
      setError('Document title is required');
      return;
    }
    if (!doc.pdfUrl.trim()) {
      setError('PDF URL is required');
      return;
    }
    if (pageContent.hasYearFilter && !doc.year.trim()) {
      setError('Year is required when year filter is enabled');
      return;
    }

    const updatedSections = [...pageContent.sections];
    if (editingDocument.documentIndex >= 0) {
      updatedSections[editingDocument.sectionIndex].documents[editingDocument.documentIndex] = doc;
    } else {
      updatedSections[editingDocument.sectionIndex].documents.push(doc);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setShowDocumentForm(false);
    setEditingDocument(null);
    setError('');
  };

  // Content handlers
  const handleAddContent = (sectionIndex: number) => {
    setEditingContent({
      sectionIndex,
      content: {
        title: '',
        subtitle: '',
        content: '',
      },
      contentIndex: -1,
    });
    setShowContentForm(true);
    setError('');
  };

  const handleEditContent = (sectionIndex: number, contentIndex: number) => {
    const section = pageContent.sections[sectionIndex];
    const contents = section.contents || [];
    const content = contents[contentIndex];
    setEditingContent({
      sectionIndex,
      content: { ...content },
      contentIndex,
    });
    setShowContentForm(true);
    setError('');
  };

  const handleDeleteContent = (sectionIndex: number, contentIndex: number) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    if (!updatedSections[sectionIndex].contents) {
      updatedSections[sectionIndex].contents = [];
    }
    updatedSections[sectionIndex].contents!.splice(contentIndex, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveContent = () => {
    if (!editingContent || !editingContent.content) {
      return;
    }

    const content = editingContent.content;
    if (!content.title.trim()) {
      setError('Content title is required');
      return;
    }

    const updatedSections = [...pageContent.sections];
    if (!updatedSections[editingContent.sectionIndex].contents) {
      updatedSections[editingContent.sectionIndex].contents = [];
    }

    if (editingContent.contentIndex >= 0) {
      updatedSections[editingContent.sectionIndex].contents![editingContent.contentIndex] = content;
    } else {
      updatedSections[editingContent.sectionIndex].contents!.push(content);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setShowContentForm(false);
    setEditingContent(null);
    setError('');
  };

  // Audio handlers
  const handleAddAudio = (sectionIndex: number) => {
    setEditingAudio({
      sectionIndex,
      audio: {
        name: '',
        year: '',
        audioUrl: '',
        pdfUrl: '',
      },
      audioIndex: -1,
    });
    setShowAudioForm(true);
    setError('');
  };

  const handleEditAudio = (sectionIndex: number, audioIndex: number) => {
    const section = pageContent.sections[sectionIndex];
    const audios = section.audios || [];
    const audio = audios[audioIndex];
    setEditingAudio({
      sectionIndex,
      audio: { ...audio },
      audioIndex,
    });
    setShowAudioForm(true);
    setError('');
  };

  const handleDeleteAudio = (sectionIndex: number, audioIndex: number) => {
    if (!confirm('Are you sure you want to delete this audio?')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    if (!updatedSections[sectionIndex].audios) {
      updatedSections[sectionIndex].audios = [];
    }
    updatedSections[sectionIndex].audios!.splice(audioIndex, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleAudioFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg|aac)$/i)) {
      setError('Please upload a valid audio file (mp3, wav, m4a, ogg, or aac)');
      return;
    }

    // Validate file size (50 MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Audio file size must be less than 50 MB');
      return;
    }

    try {
      setUploadingAudio(true);
      setError('');
      const formData = new FormData();
      formData.append('audio', file);

      // Get API base URL - use the same as in api.ts
      const apiBaseUrl = "";
      const response = await fetch(`${apiBaseUrl}/api/upload/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload audio');
      }

      const data = await response.json();
      if (editingAudio && editingAudio.audio) {
        setEditingAudio({
          ...editingAudio,
          audio: { ...editingAudio.audio, audioUrl: data.audioUrl }
        });
      }
      setSuccess('Audio uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload audio file');
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSaveAudio = () => {
    if (!editingAudio || !editingAudio.audio) {
      return;
    }

    const audio = editingAudio.audio;
    if (!audio.name.trim()) {
      setError('Audio name is required');
      return;
    }
    if (pageContent.hasYearFilter && !audio.year.trim()) {
      setError('Year is required when year filter is enabled');
      return;
    }
    if (!audio.audioUrl.trim()) {
      setError('Audio URL is required. Please upload an audio file or provide a URL.');
      return;
    }

    const updatedSections = [...pageContent.sections];
    if (!updatedSections[editingAudio.sectionIndex].audios) {
      updatedSections[editingAudio.sectionIndex].audios = [];
    }

    if (editingAudio.audioIndex >= 0) {
      updatedSections[editingAudio.sectionIndex].audios![editingAudio.audioIndex] = audio;
    } else {
      updatedSections[editingAudio.sectionIndex].audios!.push(audio);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setShowAudioForm(false);
    setEditingAudio(null);
    setError('');
  };

  if (loading && pages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Investor Pages CMS</h2>
        <p className="text-sm text-gray-600 mt-1">Manage all investor pages and their content</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Pages List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pages</h3>
              <button
                onClick={() => setShowNewPageForm(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="ri-add-line mr-1"></i>
                New
              </button>
            </div>

            {/* New Page Form */}
            {showNewPageForm && (
              <div className="mb-4 p-3 bg-white rounded border border-gray-300">
                <input
                  type="text"
                  className="w-full mb-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Page title"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreatePage();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePage}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewPageForm(false);
                      setNewPageTitle('');
                      setError('');
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Pages List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No pages found</p>
              ) : (
                pages.map((page) => (
                  <div
                    key={page.id || page.slug}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPage?.id === page.id || selectedPage?.slug === page.slug
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-500 mt-1">/{page.slug}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (page.id) {
                            handleDeletePage(page.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-xs ml-2"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Page Editor */}
        <div className="lg:col-span-3">
          {selectedPage ? (
            <div className="space-y-6">
              {/* General Settings */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={pageContent.title}
                      onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                      placeholder="Page Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-lg shadow-sm bg-gray-100"
                      value={pageContent.slug}
                      disabled
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasYearFilter"
                      checked={pageContent.hasYearFilter}
                      onChange={(e) => setPageContent({ ...pageContent, hasYearFilter: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasYearFilter" className="ml-2 block text-sm text-gray-900">
                      Enable Year Filter
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={pageContent.isActive}
                      onChange={(e) => setPageContent({ ...pageContent, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showCmsPublishDate"
                      checked={pageContent.showCmsPublishDate}
                      onChange={(e) => setPageContent({ ...pageContent, showCmsPublishDate: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showCmsPublishDate" className="ml-2 block text-sm text-gray-900">
                      Show Published Date field in CMS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showPublishDate"
                      checked={pageContent.showPublishDate}
                      onChange={(e) => setPageContent({ ...pageContent, showPublishDate: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showPublishDate" className="ml-2 block text-sm text-gray-900">
                      Show Publish Dates on Website
                    </label>
                  </div>
                </div>
              </div>

              {/* Filter Items Management */}
              {pageContent.hasYearFilter && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Filter Items (Years)</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage the years available in the filter dropdown</p>
                    </div>
                    <button
                      onClick={handleAddFilterItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Filter Item
                    </button>
                  </div>

                  {showFilterItemForm && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        {editingFilterIndex >= 0 ? 'Edit Filter Item' : 'Add New Filter Item'}
                      </h4>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={editingFilterItem}
                          onChange={(e) => setEditingFilterItem(e.target.value)}
                          placeholder="e.g., 2025-26"
                        />
                        <button
                          onClick={handleSaveFilterItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingFilterItem('');
                            setEditingFilterIndex(-1);
                            setShowFilterItemForm(false);
                            setError('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {pageContent.filterItems && Array.isArray(pageContent.filterItems) && pageContent.filterItems.length > 0 ? (
                    <div className="space-y-2">
                      {pageContent.filterItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                          <span className="text-sm font-medium text-gray-900">FY {item}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditFilterItem(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFilterItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No filter items found. Click "Add Filter Item" to create one.
                    </div>
                  )}
                </div>
              )}

              {/* Sections */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
                  <button
                    onClick={handleAddSection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Section
                  </button>
                </div>

                {showSectionForm && editingSection && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      {pageContent.sections.find(s => s.title === editingSection.title && s !== editingSection) ? 'Edit Section' : 'Add New Section'}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={editingSection.title}
                          onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                          placeholder="e.g., Financial Results"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveSection}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Section
                        </button>
                        <button
                          onClick={() => {
                            setShowSectionForm(false);
                            setEditingSection(null);
                            setError('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {pageContent.sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No sections found. Click "Add Section" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pageContent.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-semibold text-gray-900">{section.title}</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSection(section, sectionIndex)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSection(sectionIndex)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Documents ({section.documents.length})</span>
                            <button
                              onClick={() => handleAddDocument(sectionIndex)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Document
                            </button>
                          </div>
                          {section.documents.length === 0 ? (
                            <p className="text-sm text-gray-500">No documents in this section.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.documents.map((doc, docIndex) => (
                                <div key={docIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                                    <p className="text-xs text-gray-500">
                                      Date: {doc.date} {doc.year ? `| Year: ${doc.year}` : ''}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditDocument(sectionIndex, docIndex)}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDocument(sectionIndex, docIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Content ({section.contents?.length || 0})</span>
                            <button
                              onClick={() => handleAddContent(sectionIndex)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Content
                            </button>
                          </div>
                          {!section.contents || section.contents.length === 0 ? (
                            <p className="text-sm text-gray-500">No content in this section.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.contents.map((content, contentIndex) => (
                                <div key={contentIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{content.title}</p>
                                    {content.subtitle && (
                                      <p className="text-xs text-gray-600 mt-1">{content.subtitle}</p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditContent(sectionIndex, contentIndex)}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteContent(sectionIndex, contentIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Audio ({section.audios?.length || 0})</span>
                            <button
                              onClick={() => handleAddAudio(sectionIndex)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              + Add Audio
                            </button>
                          </div>
                          {!section.audios || section.audios.length === 0 ? (
                            <p className="text-sm text-gray-500">No audio in this section.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.audios.map((audio, audioIndex) => (
                                <div key={audioIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{audio.name}</p>
                                    {audio.year && (
                                      <p className="text-xs text-blue-600 mt-1">Year: {audio.year}</p>
                                    )}
                                    {audio.audioUrl && (
                                      <p className="text-xs text-gray-500 mt-1">Audio: {audio.audioUrl.substring(0, 50)}...</p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditAudio(sectionIndex, audioIndex)}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAudio(sectionIndex, audioIndex)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Audio Form */}
              {showAudioForm && editingAudio && editingAudio.audio && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    {editingAudio.audioIndex >= 0 ? 'Edit Audio' : 'Add New Audio'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingAudio.audio.name}
                        onChange={(e) => setEditingAudio({
                          ...editingAudio,
                          audio: { ...editingAudio.audio!, name: e.target.value }
                        })}
                        placeholder="e.g., Audio Recordings of Earnings Conference Call – Q2 FY 26"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year {pageContent.hasYearFilter && '*'}
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingAudio.audio.year || ''}
                        onChange={(e) => setEditingAudio({
                          ...editingAudio,
                          audio: { ...editingAudio.audio!, year: e.target.value }
                        })}
                        placeholder="e.g., 2024-25"
                      />
                      {pageContent.hasYearFilter && (
                        <p className="text-xs text-gray-500 mt-1">Required for year filtering</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Audio File
                      </label>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                        onChange={handleAudioFileUpload}
                        disabled={uploadingAudio}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {uploadingAudio && (
                        <p className="text-sm text-blue-600 mt-1">Uploading audio file...</p>
                      )}
                      {editingAudio.audio.audioUrl && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current audio: {editingAudio.audio.audioUrl}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audio URL (or use upload above)
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingAudio.audio.audioUrl}
                        onChange={(e) => setEditingAudio({
                          ...editingAudio,
                          audio: { ...editingAudio.audio!, audioUrl: e.target.value }
                        })}
                        placeholder="https://example.com/audio.mp3 or /uploads/audio/audio-1234567890.mp3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transcript PDF
                      </label>
                      <div className="flex items-center gap-4 mb-2">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleAudioPdfUpload}
                          className="hidden"
                          id="audioTranscriptPdfUpload"
                          disabled={uploadingAudioPdf}
                        />
                        <label
                          htmlFor="audioTranscriptPdfUpload"
                          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploadingAudioPdf
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                          {uploadingAudioPdf ? 'Uploading...' : 'Upload PDF'}
                        </label>
                        {editingAudio.audio.pdfUrl && (
                          <span className="text-sm text-gray-600 truncate max-w-md">
                            {editingAudio.audio.pdfUrl}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAudio}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Audio
                      </button>
                      <button
                        onClick={() => {
                          setShowAudioForm(false);
                          setEditingAudio(null);
                          setError('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Form */}
              {showContentForm && editingContent && editingContent.content && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    {editingContent.contentIndex >= 0 ? 'Edit Content' : 'Add New Content'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingContent.content.title}
                        onChange={(e) => setEditingContent({
                          ...editingContent,
                          content: { ...editingContent.content!, title: e.target.value }
                        })}
                        placeholder="e.g., Managing Director"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingContent.content.subtitle}
                        onChange={(e) => setEditingContent({
                          ...editingContent,
                          content: { ...editingContent.content!, subtitle: e.target.value }
                        })}
                        placeholder="e.g., Refex Industries Limited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        rows={6}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingContent.content.content}
                        onChange={(e) => setEditingContent({
                          ...editingContent,
                          content: { ...editingContent.content!, content: e.target.value }
                        })}
                        placeholder="Enter content details..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveContent}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Content
                      </button>
                      <button
                        onClick={() => {
                          setShowContentForm(false);
                          setEditingContent(null);
                          setError('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Form */}
              {showDocumentForm && editingDocument && editingDocument.document && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    {editingDocument.documentIndex >= 0 ? 'Edit Document' : 'Add New Document'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={editingDocument.document.title}
                        onChange={(e) => setEditingDocument({
                          ...editingDocument,
                          document: { ...editingDocument.document, title: e.target.value }
                        })}
                        placeholder="e.g., Un-Audited Financial Results – Q2 FY26"
                      />
                    </div>
                    {pageContent.showCmsPublishDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Published Date
                        </label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={editingDocument.document.date}
                          onChange={(e) => setEditingDocument({
                            ...editingDocument,
                            document: { ...editingDocument.document, date: e.target.value }
                          })}
                          placeholder="e.g., 04/11/2025"
                        />
                      </div>
                    )}
                    {pageContent.hasYearFilter && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year *
                        </label>
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={editingDocument.document.year}
                          onChange={(e) => setEditingDocument({
                            ...editingDocument,
                            document: { ...editingDocument.document, year: e.target.value }
                          })}
                          placeholder="e.g., 2025-26"
                        />
                      </div>
                    )}
                    <div className={pageContent.hasYearFilter ? '' : 'md:col-span-2'}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          PDF Document *
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-xs text-gray-600">Manual URL</span>
                          <button
                            type="button"
                            onClick={() => setIsManualPdfUrl(!isManualPdfUrl)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isManualPdfUrl ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isManualPdfUrl ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      {isManualPdfUrl ? (
                        <input
                          type="text"
                          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={editingDocument.document.pdfUrl}
                          onChange={(e) => setEditingDocument({
                            ...editingDocument,
                            document: { ...editingDocument.document, pdfUrl: e.target.value }
                          })}
                          placeholder="https://example.com/document.pdf"
                        />
                      ) : (
                        <div className="flex items-center gap-4 mb-2">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleDocumentPdfUpload}
                            className="hidden"
                            id="pageContentDocPdfUpload"
                            disabled={uploadingPdf}
                          />
                          <label
                            htmlFor="pageContentDocPdfUpload"
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploadingPdf
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                          >
                            {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                          </label>
                          {editingDocument.document.pdfUrl && (
                            <span className="text-sm text-gray-600 truncate max-w-md">
                              {editingDocument.document.pdfUrl}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={handleSaveDocument}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Document
                      </button>
                      <button
                        onClick={() => {
                          setShowDocumentForm(false);
                          setEditingDocument(null);
                          setError('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save All Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a page from the list to edit, or create a new page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

