import { useState, useEffect } from 'react';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { contactCmsApi } from '../../../services/api';
import { contactCardClass, contactContainer, contactSectionPad } from '../contactLayout';

interface OfficeAddress {
  id: number;
  title: string;
  details: string[];
  image?: string;
  isTopOffice: boolean;
  order: number;
  isActive: boolean;
}

function DetailLine({ line }: { line: string }) {
  const phoneMatch = line.match(/Phone:\s*(.+)/i);
  const emailMatch = line.match(/Email:\s*(.+)/i);

  if (phoneMatch) {
    const phone = phoneMatch[1].trim();
    return (
      <li className="flex items-start gap-2 text-sm leading-relaxed text-[#484848] sm:text-[15px]">
        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#4C8C2B]" strokeWidth={2} aria-hidden />
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[#2d5016]">
          {phone}
        </a>
      </li>
    );
  }

  if (emailMatch) {
    const email = emailMatch[1].trim();
    return (
      <li className="flex items-start gap-2 text-sm leading-relaxed text-[#484848] sm:text-[15px]">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#4C8C2B]" strokeWidth={2} aria-hidden />
        <a href={`mailto:${email}`} className="break-all hover:text-[#2d5016]">
          {email}
        </a>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed text-[#484848] sm:text-[15px]">
      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4C8C2B]/80" strokeWidth={2} aria-hidden />
      <span>{line}</span>
    </li>
  );
}

function OfficeCard({ office, featured }: { office: OfficeAddress; featured?: boolean }) {
  return (
    <article className={`${contactCardClass} transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(45,80,22,0.12)]`}>
      <div className="border-b border-[#eef3ea] bg-[#f7faf5] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4C8C2B]/10 text-[#2d5016]">
            <Building2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <h3 className="text-lg font-bold text-[#2d5016] sm:text-xl">{office.title}</h3>
        </div>
      </div>

      <div className={featured ? 'grid gap-6 p-5 sm:grid-cols-[1fr_minmax(0,200px)] sm:p-6' : 'p-5 sm:p-6'}>
        <ul className="space-y-2.5">
          {office.details.map((detail) => (
            <DetailLine key={detail} line={detail} />
          ))}
        </ul>
        {featured && office.image ? (
          <div className="overflow-hidden rounded-xl border border-[#e3ebe0]">
            <img
              src={office.image}
              alt={office.title}
              loading="lazy"
              className="h-full min-h-[180px] w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function OfficeAddresses() {
  const [offices, setOffices] = useState<OfficeAddress[]>([]);
  const [bottomOffices, setBottomOffices] = useState<OfficeAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fallbackTopOffices: OfficeAddress[] = [
      {
        id: 1,
        title: 'Registered Office',
        image: 'https://refex.co.in/wp-content/uploads/2025/07/Towers-289x300.jpg',
        details: [
          '2nd Floor, No.313, Refex Towers,',
          'Sterling Road, Valluvar Kottam High Road,',
          'Nungambakkam, Chennai,',
          'Tamil Nadu, India – 600034',
          'Phone: +91-44 – 3504 0050',
          'Email: info@refex.co.in',
        ],
        isTopOffice: true,
        order: 1,
        isActive: true,
      },
      {
        id: 2,
        title: 'Corporate Office',
        image: 'https://refex.co.in/wp-content/uploads/2025/07/Bazullah-Office-267x300.jpg',
        details: [
          'Refex, 67, Bazullah Road,',
          'Next to Sri Ramakrishna Mission',
          'Matriculation Higher Secondary School',
          'T Nagar, Chennai, Tamil Nadu, India – 600017',
        ],
        isTopOffice: true,
        order: 2,
        isActive: true,
      },
    ];

    const fallbackBottomOffices: OfficeAddress[] = [
      {
        id: 3,
        title: 'Factory',
        details: [
          'No: 1/171, Old Mahabalipuram Road,',
          'Thiruporur, Kanchipuram Dist – 603 110.',
          'Tamil Nadu, India – 600034',
          'Phone: +91-44 – 2744 5295',
          'Email: factory@refex.co.in',
        ],
        isTopOffice: false,
        order: 1,
        isActive: true,
      },
      {
        id: 4,
        title: 'Investors Grievances',
        details: [
          'Mr. Ankit Poddar',
          'Company Secretary / Compliance Officer',
          '2nd Floor, No.313, Refex Towers,',
          'Sterling Road, Valluvar Kottam High Road,',
          'Nungambakkam, Chennai,',
          'Tamil Nadu, India – 600034',
          'Phone: +91-44 – 3504 0050',
          'Email: investor.relations@refex.co.in',
        ],
        isTopOffice: false,
        order: 2,
        isActive: true,
      },
      {
        id: 5,
        title: 'For Determining Materiality of Events',
        details: [
          'Mr. Ankit Poddar – CS / Compliance Officer',
          '2nd Floor, No.313, Refex Towers,',
          'Sterling Road, Valluvar Kottam High Road,',
          'Nungambakkam, Chennai,',
          'Tamil Nadu, India – 600034',
          'Phone: +91-44 – 3504 0050',
          'Email: investor.relations@refex.co.in',
        ],
        isTopOffice: false,
        order: 3,
        isActive: true,
      },
    ];

    try {
      setLoading(true);
      const data = await contactCmsApi.getOfficeAddresses();
      const activeAddresses = (data || [])
        .filter((address: OfficeAddress) => address.isActive)
        .sort((a: OfficeAddress, b: OfficeAddress) => {
          if (a.isTopOffice !== b.isTopOffice) {
            return a.isTopOffice ? -1 : 1;
          }
          return a.order - b.order;
        });

      const topOffices = activeAddresses.filter((a: OfficeAddress) => a.isTopOffice);
      const bottom = activeAddresses.filter((a: OfficeAddress) => !a.isTopOffice);

      if (topOffices.length === 0 && bottom.length === 0) {
        setOffices(fallbackTopOffices);
        setBottomOffices(fallbackBottomOffices);
      } else {
        setOffices(topOffices);
        setBottomOffices(bottom);
      }
    } catch (error) {
      console.error('Failed to fetch office addresses:', error);
      setOffices(fallbackTopOffices);
      setBottomOffices(fallbackBottomOffices);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`bg-[#f3f7ef] ${contactSectionPad}`}>
        <div className={contactContainer}>
          <div className="flex items-center justify-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#4C8C2B]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`border-y border-[#dfe9d8] bg-[#f3f7ef] ${contactSectionPad}`} aria-labelledby="office-addresses-title">
      <div className={contactContainer}>
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#4C8C2B] sm:text-sm">
            Our Locations
          </p>
          <h2
            id="office-addresses-title"
            className="font-serif text-3xl font-medium text-[#1f1f1f] sm:text-4xl lg:text-[2.75rem]"
          >
            Office <span className="text-[#2d5016]">Addresses</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#484848] sm:text-base">
            Reach our registered, corporate, and operational teams across India.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {offices.map((office) => (
            <OfficeCard key={office.id} office={office} featured />
          ))}
        </div>

        {bottomOffices.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
            {bottomOffices.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
