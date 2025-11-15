export default function CTA() {
  return (
    <section className="w-full py-16 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-background p-12 sm:p-16 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Join the Sustainability Revolution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start making informed decisions today. Scan your first product and discover how you can live more sustainably.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors"
              >
                Schedule Demo
              </a>
            </div>

            <p className="text-muted-foreground text-sm mt-8">
              ✓ Free to use • ✓ No credit card required • ✓ Instant results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
