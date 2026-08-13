import React, { useState } from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import "./contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      errs.email = "Invalid email address";
    }
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitted(false); // hide success message on any input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" }); // reset form
        setErrors({});
      } else {
        alert(data.message || "Failed to submit message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Server error. Please try again later.");
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterError("Email is required");
      setNewsletterSuccess(false);
      return;
    }
    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newsletterEmail.trim())
    ) {
      setNewsletterError("Invalid email address");
      setNewsletterSuccess(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const result = await response.json();
      if (response.ok) {
        setNewsletterError("");
        setNewsletterSuccess(true);
        setNewsletterEmail("");
      } else {
        setNewsletterError(result.message);
        setNewsletterSuccess(false);
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setNewsletterError("Server error");
      setNewsletterSuccess(false);
    }
  };

  const faqs = [
    {
      question: "How long does it take to get a response?",
      answer: "We aim to respond to all inquiries within 24-48 hours on business days.",
    },
    {
      question: "Can I track my job application status?",
      answer: "Yes, you can log in to your account and check the status of your applications anytime.",
    },
    {
      question: "What is the best way to contact support?",
      answer: "Use this contact form or email us directly at adecco-ankitoshk@tatapower.com for quickest responses.",
    },
  ];

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We're here to help. Reach out with your query and our team will respond promptly.</p>

      <div className="contact-wrapper">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {["name", "email", "subject"].map((field) => (
            <div className="form-row" key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:<span className="required">*</span>
              </label>
              <div className="form-input">
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className={errors[field] ? "input-error" : ""}
                />
                {errors[field] && <span className="error-msg">{errors[field]}</span>}
              </div>
            </div>
          ))}

          <div className="form-row">
            <label htmlFor="message">Message:<span className="required">*</span></label>
            <div className="form-input">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className={errors.message ? "input-error" : ""}
              />
              {errors.message && <span className="error-msg">{errors.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <button type="submit" className="submit-btn">Send Message</button>
          </div>

          {submitted && <p className="success-msg">Thank you! We'll respond shortly.</p>}
        </form>

        <aside className="contact-info">
          <h2>Office Info</h2>
          <p><strong>Address:</strong> TP Power Plus, Kamal Vihar Sector-2, Near Ram Krishna Hospital, Raipur 492001</p>
          <p><strong>Phone:</strong> <a href="tel:+918271311102">+91 82713 11102</a></p>
          <p><strong>Email:</strong> <a href="mailto:adecco-ankitoshk@tatapower.com">adecco-ankitoshk@tatapower.com</a></p>
          <p><strong>Hours:</strong> Mon-Sat: 9am–6pm</p>

          <div className="social-media">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>

          <div className="map-container">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d929.9039169353154!2d81.65646506951475!3d21.207421349061878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd9189b576f1%3A0x8a20d71bcd549bcc!2sCord%20Ventures!5e0!3m2!1sen!2sin!4v1749469215932!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>

          <div className="faq-section">
            <h3>FAQs</h3>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {faq.question}
                  <span className={`arrow ${faqOpen === i ? "open" : ""}`} />
                </button>
                <div className={`faq-answer ${faqOpen === i ? "open" : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="newsletter-section">
        <h3>Stay Updated</h3>
        <p>Subscribe to get the latest updates directly to your inbox.</p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            value={newsletterEmail}
            onChange={(e) => {
              setNewsletterEmail(e.target.value);
              setNewsletterError("");
              setNewsletterSuccess(false);
            }}
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
        {newsletterError && <p className="error-msg">{newsletterError}</p>}
        {newsletterSuccess && <p className="success-msg">You're now subscribed! 🎉</p>}
      </div>
    </div>
  );
}

export default Contact;
