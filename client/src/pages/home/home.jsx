import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import './home.css';

const testimonials = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Software Engineer",
    feedback: "This job portal helped me land my dream job in just two weeks!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 2,
    name: "Mark Thompson",
    role: "Project Manager",
    feedback: "Easy to use and the listings are always updated. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    name: "Sara Lee",
    role: "Financial Analyst",
    feedback: "Great platform for job seekers. The customer support is responsive too.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  }
];

const galleryImages = [
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/44.jpg",
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
  "https://randomuser.me/api/portraits/men/59.jpg"
];

const featuredJobs = [
  {
    id: 1,
    title: 'Smart Meter Installation Engineer',
    location: 'Raipur',
    company: 'Tata Power - Smart Meter Division'
  },
  {
    id: 2,
    title: 'Field Technician - Smart Meter',
    location: 'Bilaspur',
    company: 'Tata Power - Smart Meter Division'
  },
  {
    id: 3,
    title: 'Data Analyst - Meter Data Management',
    location: 'Raigarh',
    company: 'Tata Power - Analytics Division'
  }
];

function Home() {
  const navigate = useNavigate();

  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const filteredJobs = featuredJobs.filter(job =>
    job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
    job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      setNewsletterMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setNewsletterMessage(error.response?.data?.message || 'Subscription failed. Try again later.');
    }
  };

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Next Opportunity</h1>
          <p>We help you find your next opportunity across industries and cities.</p>

          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                `/jobs?title=${encodeURIComponent(searchTitle)}&location=${encodeURIComponent(searchLocation)}`
              );
            }}
          >
            <input
              type="text"
              placeholder="Search job titles or keywords"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button type="submit">Search Jobs</button>
          </form>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          <div className="category-card">IT</div>
          <div className="category-card">Operation</div>
          <div className="category-card">NOMC</div>
          <div className="category-card">Finance</div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-jobs">
        <h2>Featured Jobs</h2>
        <div className="job-cards">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Company:</strong> {job.company}</p>
                <button onClick={() => navigate(`/jobs?id=${job.id}`)}>View Details</button>
              </div>
            ))
          ) : (
            <p>No jobs found matching your criteria.</p>
          )}
        </div>
        <div className="view-more-container">
          <button className="view-more-button" onClick={() => navigate('/jobs')}>
            View More Jobs
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <h2>Office & Work Environment Gallery</h2>
        <div className="gallery-grid">
          {galleryImages.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt={`Gallery image ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="testimonial-swiper"
        >
          {testimonials.map(({ id, name, role, feedback, avatar }) => (
            <SwiperSlide key={id}>
              <div className="testimonial-card">
                <img src={avatar} alt={`${name}'s avatar`} className="testimonial-avatar" />
                <p className="testimonial-feedback">"{feedback}"</p>
                <p className="testimonial-name">{name}</p>
                <p className="testimonial-role">{role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Our Office Location</h2>
        <div className="map-container">
          <iframe
            title="Cord Ventures Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d929.9039169353154!2d81.65646506951475!3d21.207421349061878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd9189b576f1%3A0x8a20d71bcd549bcc!2sCord%20Ventures!5e0!3m2!1sen!2sin!4v1749469215932!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-banner">
        <h2>Get Job Alerts in Your Inbox</h2>
        <p>Subscribe to receive the latest job postings and updates.</p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
        {newsletterMessage && (
          <p className="newsletter-status">{newsletterMessage}</p>
        )}
      </section>

      {/* Contact Us CTA */}
      <section className="contact-cta">
        <h2>Have Questions or Need Help?</h2>
        <p>Contact our support team anytime.</p>
        <button onClick={() => navigate('/contact')}>Contact Us</button>
      </section>

    </div>
  );
}

export default Home;
