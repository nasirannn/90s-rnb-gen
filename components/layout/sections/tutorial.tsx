"use client";

import Image from "next/image";

export const TutorialSection = () => {
  const steps = [
    {
      icon: "/icons/01-Choose Style & Parameters.svg",
      title: "Choose Style & Options",
      description: "Select your favorite R&B style, mood, instruments, and customize your music DNA.",
    },
    {
      icon: "/icons/02-Generate Music Instantly.svg",
      title: "Generate Music Instantly",
      description: "Click generate and let AI compose, arrange, create lyrics and vocals in seconds.",
    },
    {
      icon: "/icons/03-Listen & Download.svg",
      title: "Listen & Download",
      description: "Preview your generated music online and download high-quality audio files when satisfied.",
    },
  ];

  return (
    <section id="tutorial" className="py-20 bg-muted/20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How To Create a 90s R&B Song With AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your own 90s R&B classic music in just three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center"
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={128}
                  height={128}
                  className="w-32 h-32"
                />
              </div>
              
              {/* Title with Step Number */}
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {index + 1}.
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden shadow-xl border border-purple-400/20">
            {/* Shine effect overlay */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            
            <span className="relative z-10">Start Creating The Old School R&B Songs</span>
          </button>
        </div>
      </div>
    </section>
  );
};
