import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../services/api';
import {
  newsroomAccentTextClass,
  newsroomFilterBarClass,
  newsroomInputClass,
  newsroomMediaCardClass,
  newsroomMetaTextClass,
  newsroomSpinnerClass,
} from '../newsroomLayout';

interface Event {
  id: number;
  title: string;
  date: string;
  source: string;
  image: string;
  link: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Default fallback data
    const fallbackEvents: Event[] = [
      {
        id: 1,
        title: "Refex Gheun Tak – A Women's Ultimate Frisbee Tournament",
        date: 'January 25, 2023',
        source: 'Times of India',
        image: 'https://refex.co.in/wp-content/uploads/2023/02/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg',
        link: 'https://businessnewsthisweek.com/business/team-meraki-wins-refex-gheun-tak-a-womens-ultimate-frisbee-tournament/',
        category: 'Frisbee Tournament',
        order: 1,
        isActive: true,
      },
      {
        id: 2,
        title: 'Refex Group Road Safety Awareness event',
        date: 'January 11, 2023',
        source: 'Events',
        image: 'https://refex.co.in/wp-content/uploads/2023/01/Refex-Group-Road-Safety-Awareness-event.jpg',
        link: 'https://navjeevanexpress.com/csr-initiative-refex-group-kick-starts-road-safety-campaign-on-anna-salai-in-chennai/',
        category: 'Awareness event',
        order: 2,
        isActive: true,
      },
    ];

    try {
      setLoading(true);
      const data = await newsroomCmsApi.getEvents();
      const activeEvents = (data || [])
        .filter((event: Event) => event.isActive)
        .sort((a: Event, b: Event) => {
          // Sort by order first, then by date descending
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
      
      if (activeEvents.length === 0) {
        setEvents(fallbackEvents);
      } else {
        setEvents(activeEvents);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback to default data on error
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className={newsroomSpinnerClass} aria-hidden />
          <p className="mt-4 text-[#5a5a5a]">Loading events...</p>
        </div>
      </div>
    );
  }

  // Filter and sort
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      {/* Filter Bar */}
      <div className={`mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center ${newsroomFilterBarClass}`}>
        <p className="text-sm font-medium text-[#5a5a5a]">
          Displaying 1 - {filteredEvents.length} of {filteredEvents.length} events
        </p>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={newsroomInputClass}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            className={`${newsroomInputClass} cursor-pointer sm:w-auto`}
          >
            <option value="desc">Date (Newest)</option>
            <option value="asc">Date (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <div key={event.id} className={newsroomMediaCardClass}>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative mb-4 h-[300px] w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-bold uppercase text-[#2d5016] shadow-sm">
                    {event.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h5 className="mb-3 line-clamp-2 text-[20px] font-bold text-white">{event.title}</h5>
                  <span className="inline-block text-[16px] font-semibold text-[#7cd244] group-hover:underline">
                    Continue Reading
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 px-4 pb-4">
                <p className={`text-[16px] ${newsroomMetaTextClass}`}>{event.date}</p>
                <p className={`text-[14px] font-bold uppercase ${newsroomAccentTextClass}`}>{event.source}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
