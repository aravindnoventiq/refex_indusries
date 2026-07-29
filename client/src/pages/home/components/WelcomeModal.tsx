import { useState, useEffect } from 'react';

interface WelcomeModalProps {
  imageUrl?: string;
}

export default function WelcomeModal({ imageUrl }: WelcomeModalProps) {
  const [showModal, setShowModal] = useState(false);
  const firstImage = imageUrl || '/first.jpg';

  useEffect(() => {
    // Show modal on every home page refresh
    // Small delay for better UX
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  // Default image if none provided
  const defaultImage = 'https://via.placeholder.com/800x600?text=Welcome+to+Refex+Industries';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="theme-keep-light bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative animate-in zoom-in-95 duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center w-10 h-10"
          aria-label="Close modal"
        >
          <i className="ri-close-line text-3xl font-bold"></i>
        </button>
        
        {/* Image */}
        <div className="p-4">
          <img
            src={firstImage}
            alt="Welcome"
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
        </div>
      </div>
    </div>
  );
}

