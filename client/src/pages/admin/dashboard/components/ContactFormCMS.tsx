import { useState, useEffect } from 'react';
import { contactCmsApi } from '../../../../services/api';
import { DEFAULT_REFEX_TOWERS_MAP_EMBED_URL } from '../../../contact/contactLayout';

interface ContactForm {
  id?: number;
  title: string;
  subtitle?: string;
  mapEmbedUrl?: string;
  formEndpointUrl: string;
  successMessage?: string;
  errorMessage?: string;
  isActive: boolean;
}

export default function ContactFormCMS() {
  const [form, setForm] = useState<ContactForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactCmsApi.getForm();
      setForm(data || null);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load contact form');
      }
      // Fallback to default data
      setForm({
        title: 'Get in Touch',
        subtitle: "Have Questions? We're happy to help!",
        mapEmbedUrl: DEFAULT_REFEX_TOWERS_MAP_EMBED_URL,
        formEndpointUrl: 'https://readdy.ai/api/form/d4ijdrv1vras6h6ft1qg',
        successMessage: "Thank you! Your message has been sent successfully.",
        errorMessage: "Sorry, there was an error sending your message. Please try again.",
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.formEndpointUrl.trim()) {
      setError('Form Endpoint URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await contactCmsApi.saveForm(form);
      setSuccess('Contact form saved successfully');
      loadForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save contact form');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading contact form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No contact form data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Form CMS</h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.subtitle || ''}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Have Questions? We're happy to help!"
          />
        </div>

        <div>
          <label htmlFor="mapEmbedUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Embed URL
          </label>
          <textarea
            id="mapEmbedUrl"
            rows={3}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.mapEmbedUrl || ''}
            onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
            placeholder={DEFAULT_REFEX_TOWERS_MAP_EMBED_URL}
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            Google Maps embed URL for the contact page. Leave blank to use the default Refex Towers location.
          </p>
        </div>

        <div>
          <label htmlFor="formEndpointUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Form Endpoint URL *
          </label>
          <input
            type="text"
            id="formEndpointUrl"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.formEndpointUrl}
            onChange={(e) => setForm({ ...form, formEndpointUrl: e.target.value })}
            placeholder="https://readdy.ai/api/form/..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">The API endpoint URL where the form will be submitted.</p>
        </div>

        <div>
          <label htmlFor="successMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Success Message
          </label>
          <input
            type="text"
            id="successMessage"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.successMessage || ''}
            onChange={(e) => setForm({ ...form, successMessage: e.target.value })}
            placeholder="Thank you! Your message has been sent successfully."
          />
        </div>

        <div>
          <label htmlFor="errorMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Error Message
          </label>
          <input
            type="text"
            id="errorMessage"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7cd244] focus:ring-[#7cd244]"
            value={form.errorMessage || ''}
            onChange={(e) => setForm({ ...form, errorMessage: e.target.value })}
            placeholder="Sorry, there was an error sending your message. Please try again."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-[#4f8f2a] border-gray-300 rounded"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#7cd244] text-white rounded-lg hover:bg-[#6db038] transition-colors"
          >
            Save Contact Form
          </button>
        </div>
      </form>
    </div>
  );
}

