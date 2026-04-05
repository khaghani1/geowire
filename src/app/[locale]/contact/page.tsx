'use client';

import { useState } from 'react';
import { AlertBannerLiveWrapper } from '@/components/layout/AlertBannerLiveWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';

// ─── Styles ──────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-data)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  fontFamily: 'var(--font-body)',
  color: 'var(--text-primary)',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const SUBJECTS = [
  'General Inquiry',
  'Data Question',
  'Business / Partnership',
  'Bug Report',
] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Build mailto link with pre-filled fields
    const subjectLine = encodeURIComponent(`[GeoWire] ${subject}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.open(`mailto:contact@geowire.org?subject=${subjectLine}&body=${body}`, '_self');
    setSubmitted(true);
  }

  return (
    <>
      <AlertBannerLiveWrapper />
      <Navbar />

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px 60px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '12px',
          }}
        >
          Contact GeoWire
        </h1>
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-body)',
            marginBottom: '28px',
          }}
        >
          GeoWire is a macro intelligence platform tracking recession probability with live Federal
          Reserve data. For data inquiries, partnership opportunities, media requests, or to report
          issues, reach out below.
        </p>

        {/* Direct email */}
        <GlassCard style={{ padding: '20px', marginBottom: '28px' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-body)',
              marginBottom: '8px',
            }}
          >
            Email us directly:
          </p>
          <a
            href="mailto:contact@geowire.org"
            style={{
              fontSize: '16px',
              fontFamily: 'var(--font-data)',
              color: '#2979FF',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            contact@geowire.org
          </a>
        </GlassCard>

        {/* Contact Form */}
        {submitted ? (
          <GlassCard style={{ padding: '28px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '16px',
                color: '#00C853',
                fontWeight: 600,
                fontFamily: 'var(--font-heading)',
                marginBottom: '8px',
              }}
            >
              Your email client should have opened with the message pre-filled.
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              If it didn&apos;t open, please email us directly at contact@geowire.org.
            </p>
          </GlassCard>
        ) : (
          <GlassCard style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle} htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle} htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle} htmlFor="contact-subject">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'auto' as React.CSSProperties['appearance'],
                  }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle} htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '100px',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  color: '#fff',
                  background: '#2979FF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Send Message
              </button>
            </form>
          </GlassCard>
        )}
      </main>

      <Footer />
    </>
  );
}
