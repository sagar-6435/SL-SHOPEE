import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, Instagram, Facebook, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/branches`);
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        }
      } catch (err) {
        console.error('Failed to fetch branches', err);
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `New Inquiry from Contact Form!\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Branches Section */}
      <div className="py-12 md:py-20 bg-gray-50/50">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[10px] font-body font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 block">Our Presence</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Our Branches across <span className="italic font-serif font-medium text-[var(--color-primary)]">East Godavari</span>
            </h2>
            <p className="text-gray-500 font-body text-lg leading-relaxed max-w-2xl mx-auto">
              We are proud to serve you closely through our dedicated network. Find your nearest SL SHOPEE branch and visit us today.
            </p>
          </div>

          {loadingBranches ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div key={idx} className="h-32 bg-gray-200/50 animate-pulse rounded-3xl w-full"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map(branch => (
                <div key={branch._id} className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all group flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4 mt-2">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#8E447E] transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 mt-1">
                      <h4 className="font-display font-bold text-gray-900 text-lg mb-1">{branch.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-body mb-6 flex-grow">
                    {branch.address}
                  </p>
                  <div className="flex flex-col gap-3">
                    {branch.googleMapsLink && (
                      <a
                        href={branch.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Get Directions to ${branch.name}`}
                        className="inline-flex items-center gap-2 text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest hover:gap-4 transition-all w-fit"
                      >
                        <span className="text-[var(--color-primary)]">Get Directions</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      </a>
                    )}
                    {branch.instagramLink && (
                      <a
                        href={branch.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Follow ${branch.name} on Instagram`}
                        className="inline-flex items-center gap-2 text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest hover:gap-4 transition-all w-fit"
                      >
                        <span className="text-pink-600">Instagram</span>
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA / Contact Section */}
      <div id="contact-section" className="py-12 md:py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-12">
            <span className="text-[10px] font-body font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 block">Contact Us</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-4 leading-tight">
              Let's start a <span className="italic font-serif font-medium text-[var(--color-primary)]">conversation.</span>
            </h2>
            <p className="text-gray-500 font-body text-lg leading-relaxed max-w-2xl">
              Whether you're looking for a bespoke digital gift or a professional studio session, our team is here to curate your memories with care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Contact Form */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-purple-100/50 border border-purple-50/50">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-10">Send a message</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Your Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry about collections"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Your Message</label>
                  <textarea
                    placeholder="How can we help you today?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 h-40 resize-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 py-4 px-10 bg-[#8E447E] text-white rounded-2xl font-body font-bold text-sm hover:bg-[#7A3B6D] transition-all shadow-lg active:scale-95"
                >
                  <span>Send Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Details & Map Card */}
            <div className="space-y-12">
              <div className="bg-gray-50 rounded-[40px] p-8 md:p-12">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-10">Studio Details</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Our Location</h5>
                      <div className="text-sm font-body text-gray-700 leading-relaxed">
                        <ol>
                          <li>1. Achampeta</li>
                          <li>2. Peddapuram</li>
                          <li>3. Pithapuram</li>
                          <li>4. Gollaprolu</li>
                          <li>5. Kathipudi</li>
                        </ol><br />Andhra Pradesh 534204
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</h5>
                      <p className="text-sm font-body text-gray-700 leading-relaxed">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Email</h5>
                      <p className="text-sm font-body text-gray-700">contact@slshopee.digital</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-200">
                  <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-6">Connect with us</h5>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/sl_shopee_kathipudi/" className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

