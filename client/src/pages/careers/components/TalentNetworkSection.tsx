import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  Briefcase,
  FileText,
  Link2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  Users,
} from 'lucide-react';
import { useEmailValidation } from '../../../hooks/useEmailValidation';

const SECTION_BG = '/careers/hero-bg.png';

const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  experience: string;
  location: string;
  linkedin: string;
};

type FormErrors = Partial<Record<keyof FormState | 'resume', string>>;

function FieldLabel({
  icon: Icon,
  htmlFor,
  children,
}: {
  icon: typeof User;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 text-sm font-medium text-[#2d5016]">
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      {children}
    </label>
  );
}

export default function TalentNetworkSection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { validateEmail } = useEmailValidation({ required: true });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    experience: '',
    location: '',
    linkedin: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      next.name = 'Please enter your full name';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      next.phone = 'Please enter a valid contact number';
    }

    const emailError = validateEmail(formData.email);
    if (emailError) next.email = emailError;

    if (!formData.experience) {
      next.experience = 'Please select your experience';
    }

    if (!formData.location.trim()) {
      next.location = 'Please enter your current location';
    }

    if (resumeFile) {
      if (!ALLOWED_RESUME_TYPES.includes(resumeFile.type)) {
        next.resume = 'Upload PDF, DOC, or DOCX only';
      } else if (resumeFile.size > MAX_RESUME_BYTES) {
        next.resume = 'Resume must be 5MB or smaller';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleResumeChange = (file: File | null) => {
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: '' }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitStatus(null);
    setStatusMessage('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';
      const body = new FormData();
      body.append('name', formData.name.trim());
      body.append('phone', formData.phone.trim());
      body.append('email', formData.email.trim());
      body.append('experience', formData.experience);
      body.append('location', formData.location.trim());
      body.append('linkedin', formData.linkedin.trim());
      if (resumeFile) body.append('resume', resumeFile);

      const response = await fetch(`${API_BASE_URL}/api/careers/talent-network`, {
        method: 'POST',
        body,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Submission failed. Please try again.');
      }

      setSubmitStatus('success');
      setStatusMessage(result.message || 'Your profile has been submitted successfully.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        experience: '',
        location: '',
        linkedin: '',
      });
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="talent-network"
      className="relative scroll-mt-[calc(var(--header-offset,5.25rem)+1rem)] overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${SECTION_BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/86 to-white/78"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,540px)]">
          <div className="lg:pt-4">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4C8C2B] sm:text-sm">
              <Users className="h-4 w-4" strokeWidth={2} aria-hidden />
              Join Our Talent Network
            </div>

            <h2 className="font-serif text-3xl leading-tight text-[#1f1f1f] sm:text-4xl lg:text-[2.75rem]">
              Stay connected with{' '}
              <span className="text-[#2d5016]">opportunities.</span>
            </h2>

            {/* <p className="mt-5 max-w-xl text-base leading-relaxed text-[#484848] sm:text-[17px]">
              Even if there isn&apos;t a suitable opening today, we&apos;d love to stay in touch.
              Share your profile and we&apos;ll reach out when opportunities aligned with your
              experience and aspirations become available.
            </p> */}

            {/* <div className="mt-10 max-w-md border-t border-[#d9e8d2] pt-8 text-center lg:text-left">
              <Users className="mx-auto h-8 w-8 text-[#4C8C2B] lg:mx-0" strokeWidth={1.75} aria-hidden />
              <p className="mt-3 text-sm leading-relaxed text-[#555] sm:text-[15px]">
                Be part of a purpose-driven organization building a cleaner, greener tomorrow.
              </p>
            </div> */}
          </div>

          <div className="rounded-[1.75rem] border border-[#e3ebe0] bg-white p-6 shadow-[0_24px_60px_rgba(45,80,22,0.12)] sm:p-8">
            <div className="mb-6 flex items-start gap-3 border-b border-[#eef3ea] pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7faf5] text-[#2d5016]">
                <FileText className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f1f]">Share Your Information</h3>
                <p className="mt-1 text-sm text-[#666]">Help us get to know you better.</p>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-5 rounded-xl border border-[#4C8C2B]/30 bg-[#f7faf5] px-4 py-3 text-sm text-[#2d5016]">
                {statusMessage}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <FieldLabel icon={User} htmlFor="careers-name">
                  Name
                </FieldLabel>
                <input
                  id="careers-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#dfe7da] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <FieldLabel icon={Phone} htmlFor="careers-phone">
                  Contact Number
                </FieldLabel>
                <input
                  id="careers-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full rounded-xl border border-[#dfe7da] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <FieldLabel icon={Mail} htmlFor="careers-email">
                  Email ID
                </FieldLabel>
                <input
                  id="careers-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your email ID"
                  className="w-full rounded-xl border border-[#dfe7da] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <FieldLabel icon={Upload} htmlFor="careers-resume">
                  Resume
                </FieldLabel>
                <label
                  htmlFor="careers-resume"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#c8d9c0] bg-[#fafcf8] px-4 py-5 text-center transition-colors hover:border-[#4C8C2B]/50 hover:bg-[#f7faf5]"
                >
                  <Upload className="mb-2 h-5 w-5 text-[#4C8C2B]" aria-hidden />
                  <span className="text-sm font-medium text-[#2d5016]">
                    {resumeFile ? resumeFile.name : 'Upload your resume'}
                  </span>
                  <span className="mt-1 text-xs text-[#777]">PDF, DOC, DOCX — Max 5MB</span>
                  <input
                    ref={fileInputRef}
                    id="careers-resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => handleResumeChange(e.target.files?.[0] ?? null)}
                  />
                </label>
                {errors.resume && <p className="mt-1 text-xs text-red-600">{errors.resume}</p>}
              </div>

              <div>
                <FieldLabel icon={Briefcase} htmlFor="careers-experience">
                  Years of Experience
                </FieldLabel>
                <select
                  id="careers-experience"
                  value={formData.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  className="w-full rounded-xl border border-[#dfe7da] bg-white px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                >
                  <option value="">Select your experience</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="mt-1 text-xs text-red-600">{errors.experience}</p>
                )}
              </div>

              <div>
                <FieldLabel icon={MapPin} htmlFor="careers-location">
                  Current Location
                </FieldLabel>
                <input
                  id="careers-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Enter your current location"
                  className="w-full rounded-xl border border-[#dfe7da] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                />
                {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
              </div>

              <div>
                <FieldLabel icon={Link2} htmlFor="careers-linkedin">
                  LinkedIn ID
                </FieldLabel>
                <input
                  id="careers-linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="Enter your LinkedIn profile link"
                  className="w-full rounded-xl border border-[#dfe7da] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d5016] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#234015] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Profile'}
                {!isSubmitting && <i className="ri-arrow-right-line text-lg" aria-hidden />}
              </button>

              <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-[#777]">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Your information will be kept confidential and used only for recruitment purposes.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
