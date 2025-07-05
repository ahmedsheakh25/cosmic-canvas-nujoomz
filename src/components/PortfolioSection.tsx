
import React, { useState } from 'react';

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: "Tawaz Identity",
      category: "brand",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Complete brand identity and digital experience",
      tags: ["Branding", "UI/UX", "Web Design"],
      status: "completed"
    },
    {
      id: 2,
      title: "Cosmic E-Commerce",
      category: "ecommerce",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Next-gen online shopping experience",
      tags: ["E-Commerce", "Development", "UX"],
      status: "completed"
    },
    {
      id: 3,
      title: "Stellar App Interface",
      category: "app",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Mobile-first application design",
      tags: ["App Design", "UI/UX", "Motion"],
      status: "completed"
    },
    {
      id: 4,
      title: "Galactic Marketing Campaign",
      category: "marketing",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Multi-platform digital campaign",
      tags: ["Marketing", "Social Media", "Video"],
      status: "completed"
    },
    {
      id: 5,
      title: "Nebula Web Platform",
      category: "web",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Corporate website with AI integration",
      tags: ["Web Development", "AI", "CMS"],
      status: "completed"
    },
    {
      id: 6,
      title: "Orbital Motion Graphics",
      category: "motion",
      image: "/lovable-uploads/98bc32f0-9b76-4b2b-b654-71eb87bd0541.png",
      description: "Animated brand storytelling",
      tags: ["Motion Graphics", "Animation", "Branding"],
      status: "completed"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Missions', labelAr: 'جميع المهام' },
    { id: 'brand', label: 'Branding', labelAr: 'العلامة التجارية' },
    { id: 'web', label: 'Web', labelAr: 'الويب' },
    { id: 'app', label: 'Apps', labelAr: 'التطبيقات' },
    { id: 'ecommerce', label: 'E-Commerce', labelAr: 'التجارة الإلكترونية' },
    { id: 'motion', label: 'Motion', labelAr: 'الحركة' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
            Missions We've Completed
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explore our cosmic portfolio of successful missions across the digital universe
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-[#7EF5A5]/50 hover:shadow-2xl hover:shadow-[#7EF5A5]/10 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7EF5A5]/20 to-[#4AE374]/20" />
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                    View Mission
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 bg-[#7EF5A5] text-black px-3 py-1 rounded-full text-xs font-semibold">
                  Mission Complete ✓
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#7EF5A5] transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7EF5A5]/5 to-[#4AE374]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-6">Want to see your project here?</p>
          <button className="bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300">
            Start Your Mission 🚀
          </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 border border-[#7EF5A5]/5 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
      <div className="absolute bottom-20 left-10 w-32 h-32 border border-[#4AE374]/10 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
    </section>
  );
};

export default PortfolioSection;
