const steps = [
  {
    number: "1",
    title: "Get your Instant Quote",
    description: "Select your device and condition, and get your offer before you say goodbye to clutter.",
    image: (
      <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Ship for Free",
    description: "Print the free, trackable label, and send it off. We'll handle the rest.",
    image: (
      <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Get Paid Fast",
    description: "No listings, waiting, or meeting strangers. Get paid after we inspect your device. Cha-ching!",
    image: (
      <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            From drawer to dollars in 3 simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
                {step.image}
              </div>
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
