export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Green spinning ring - thin ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-[#7fc345] rounded-full animate-spin"></div>
        
        {/* Refex logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg" 
            alt="Refex Industries Limited" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

