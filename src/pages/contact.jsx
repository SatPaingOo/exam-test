import React, { useState } from "react";
import { Card, Button, Input, Select } from "@/components/common";

const topicOptions = [
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "partnerships", label: "Partnerships" },
  { value: "feedback", label: "Product Feedback" },
];

const Contact = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    topic: "support",
    message: "",
  });

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Store a lightweight payload so follow-up flows can build on it later.
    sessionStorage.setItem(
      "exam-test-contact-draft",
      JSON.stringify({ ...form, submittedAt: new Date().toISOString() })
    );
    alert("Thanks for reaching out! Our team will reply soon.");
    setForm({ fullName: "", email: "", topic: "support", message: "" });
  };

  return (
    <div className="contact-page">
      <section className="page-hero page-hero--subtle">
        <div className="container">
          <p className="page-hero__eyebrow">Get in Touch</p>
          <h1 className="page-hero__title">We Are Here to Help</h1>
          <p className="page-hero__subtitle">
            Questions about exam prep, partnerships, or platform support? Drop
            us a note and we will respond within one business day.
          </p>
        </div>
      </section>

      <section className="contact-page__content">
        <div className="container">
          <div className="contact-page__grid">
            <Card className="contact-page__card" hover={false}>
              <h2>Contact Details</h2>
              <p>
                Prefer email? Reach our support desk at
                <a href="mailto:support@examtest.io"> support@examtest.io</a>.
              </p>
              <p>
                We typically respond between <strong>08:00–18:00 JST</strong>,
                Monday through Friday. For urgent exam-day issues, include your
                track and attempt ID so we can investigate faster.
              </p>
              <div className="contact-page__details">
                <div>
                  <span className="label">Community</span>
                  <a
                    href="https://community.examtest.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    community.examtest.io
                  </a>
                </div>
                <div>
                  <span className="label">Press</span>
                  <a href="mailto:press@examtest.io">press@examtest.io</a>
                </div>
                <div>
                  <span className="label">Partners</span>
                  <a href="mailto:partners@examtest.io">partners@examtest.io</a>
                </div>
              </div>
            </Card>

            <Card className="contact-page__card" hover={false}>
              <h2>Send a Message</h2>
              <form className="contact-page__form" onSubmit={handleSubmit}>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  placeholder="Jane Doe"
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="you@example.com"
                  required
                />
                <Select
                  label="Topic"
                  name="topic"
                  value={form.topic}
                  onChange={updateField("topic")}
                  options={topicOptions}
                  required
                />
                <div className="contact-page__textarea">
                  <label htmlFor="message">
                    Message<span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={updateField("message")}
                    placeholder="Share how we can support you."
                    required
                    rows={5}
                  />
                </div>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
