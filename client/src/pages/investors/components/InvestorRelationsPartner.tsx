export default function InvestorRelationsPartner() {
  return (
    <section className="site-page-light py-16 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-[#484848] uppercase tracking-wider">
            Investors Relations Partner
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/3 flex justify-center">
            <img 
              src="https://refex.co.in/wp-content/uploads/2025/02/kirin_logo_dark.png" 
              alt="Kirin Advisors" 
              className="max-w-[280px] w-full h-auto"
            />
          </div>

          <div className="lg:w-2/3 bg-[#f3f7ef] rounded-lg p-8 text-center border border-[#dfe9d8]">
            <h3 className="text-2xl font-bold text-[#1f1f1f] mb-2">
              Kirin Advisors Private Limited
            </h3>
            <p className="text-[#484848] mb-6">Corporate Communication Advisor</p>
            
            <div className="space-y-4 text-[#484848]">
              <p className="font-bold text-lg">Contact Details</p>
              <p className="font-semibold">Sunil Mudgal – Director</p>
              <p>
                <a 
                  href="mailto:sunil@kirinadvisors.com" 
                  className="text-[#7cd244] hover:underline cursor-pointer"
                >
                  sunil@kirinadvisors.com
                </a>
              </p>
              <p>
                Phone: <a 
                  href="tel:9869275849" 
                  className="text-[#7cd244] hover:underline cursor-pointer"
                >
                  +91 98692 75849
                </a>
              </p>
              <p>
                <a 
                  href="http://www.kirinadvisors.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#7cd244] hover:underline cursor-pointer"
                >
                  www.kirinadvisors.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
