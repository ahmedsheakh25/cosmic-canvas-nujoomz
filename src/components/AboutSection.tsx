
import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
              Our Orbit
            </h2>
            <div className="space-y-6 text-lg text-white/80">
              <p>
                We are <span className="text-[#7EF5A5] font-semibold">Of Space Studio</span> – a creative collective that thinks beyond conventional boundaries. Our mission is to craft cosmic brand experiences that transcend the ordinary.
              </p>
              <p>
                Powered by AI-driven insights and human creativity, we navigate the vast universe of digital possibilities to create brands that truly stand out in their orbit.
              </p>
              <p>
                From brand identity to interactive experiences, we believe every project is a new mission to explore uncharted creative territories.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="text-3xl text-[#7EF5A5] font-bold mb-2">50+</div>
                <div className="text-white/70">Missions Completed</div>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="text-3xl text-[#7EF5A5] font-bold mb-2">25+</div>
                <div className="text-white/70">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#7EF5A5]/20 via-transparent to-[#4AE374]/20 backdrop-blur-lg border border-[#7EF5A5]/30 rounded-3xl p-8 h-96">
              
              {/* Central hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center text-black font-bold text-xl">
                OS
              </div>

              {/* Orbiting elements */}
              <div className="absolute top-1/2 left-1/2 w-48 h-48 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-full h-full border border-[#7EF5A5]/40 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#7EF5A5] rounded-full flex items-center justify-center text-xs">🎨</div>
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-[#4AE374] rounded-full flex items-center justify-center text-xs">🚀</div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#7EF5A5] rounded-full flex items-center justify-center text-xs">💫</div>
                  <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 bg-[#4AE374] rounded-full flex items-center justify-center text-xs">🌟</div>
                </div>
              </div>

              {/* Outer orbit */}
              <div className="absolute top-1/2 left-1/2 w-64 h-64 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-full h-full border border-[#4AE374]/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/60 rounded-full"></div>
                  <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Background particles */}
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-[#7EF5A5] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-[#4AE374]/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-8 -left-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Philosophy section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8 text-[#7EF5A5]">Our Philosophy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h4 className="text-xl font-semibold mb-3 text-white">AI-Powered Creativity</h4>
              <p className="text-white/70">We blend artificial intelligence with human imagination to create solutions that are both innovative and intuitive.</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-3 text-white">Strategic Thinking</h4>
              <p className="text-white/70">Every creative decision is backed by strategic insights and data-driven approaches to ensure maximum impact.</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-4">🌍</div>
              <h4 className="text-xl font-semibold mb-3 text-white">Human Connection</h4>
              <p className="text-white/70">Despite our cosmic aspirations, we remain grounded in creating meaningful connections between brands and people.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
