import { HiDeviceMobile } from 'react-icons/hi';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
          <span className="text-sm font-semibold text-primary">Scan for Sustainability</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
          Know Your{' '}
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500">
            Product's Environmental Impact
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Simply scan a product image with your camera to instantly discover its sustainability attributes, material composition, and environmental footprint.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Scan Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden bg-card border border-border h-96 flex items-center justify-center transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5"></div>
          <div className="relative z-10 text-center">
            <HiDeviceMobile className="text-6xl mb-4 mx-auto text-primary" />
            <p className="text-muted-foreground">Product Scan Preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}
