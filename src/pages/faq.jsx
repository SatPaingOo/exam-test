import React, { useState } from "react";
import { Card } from "@/components/common";

const faqs = [
  {
    question: "What is ITPEC?",
    answer:
      "ITPEC stands for Information Technology Professional Examination Council. It's a certification program for IT professionals in Myanmar.",
  },
  {
    question: "How do I prepare for ITPEC exams?",
    answer:
      "You can prepare by taking practice quizzes on our platform, reviewing study materials, and tracking your progress.",
  },
  {
    question: "Is the service free?",
    answer:
      "We offer a free tier with basic features. Premium features are available with a subscription.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can contact us through the contact page or email us at support@example.com.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about our ITPEC exam preparation
            platform
          </p>
        </div>
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <Card key={index} className="faq-item">
              <button
                className={`faq-question ${
                  openIndex === index ? "active" : ""
                }`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`faq-answer ${openIndex === index ? "open" : ""}`}
              >
                <div className="answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
