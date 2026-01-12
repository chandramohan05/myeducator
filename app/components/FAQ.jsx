"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "What age can my child start chess?",
      answer:
        "Some children start very early. In fact, even a 3-year-old child has achieved a FIDE rating — which shows that age is not a limitation. What truly matters is not the number, but the child’s understanding ability and interest."
    },

    {
      question: "How many classes per week?",
      answer: `
A child can start chess as soon as they can understand basic instructions and show interest.

Before joining, we do a quick screening/assessment to check:
 • Attention span
 • Ability to follow simple instructions
 • Interest level
 • Comfort with basic shapes, movement, and patterns

If the child is ready, we start immediately.
If not, we guide the parents on how to slowly build interest and prepare the child for future classes.
      `
    },

    {
      question: "Will my child get a certificate?",
      answer:
        "Yes. Your child will receive a certificate at the completion of each learning stage. Every level has its own certificate to recognise progress and motivate the child as they advance."
    },

    {
      question: "Who are the coaches?",
      answer:
        "All our coaches are full-time professional chess trainers with FIDE titles and extensive teaching experience. Our team includes career chess players with over 25 years of playing and coaching expertise. They have successfully trained and produced numerous state champions, national champions, and international FIDE-rated players right from the rookie stage."
    },

    {
      question: "Do you offer tournaments?",
      answer:
        "Yes. We conduct online tournaments every weekend, followed by a detailed game-analysis session led by our coach. This helps students understand their mistakes, improve faster, and gain real tournament experience regularly."
    },

    {
      question: "What if my child misses a class?",
      answer:
        "Yes, we provide compensation classes for any properly informed absence. The missed class will be automatically added to the child’s bucket list and scheduled within the immediate next month—without any need for parent follow-up or intervention."
    },

    {
      question: "Will I get a refund if I discontinue?",
      answer: `
Our programs are engaging, and most students continue without opting for discontinuation. However, since all payments are collected in advance and allocated to coaches to block and secure your time slot, we are unable to offer refunds.

In exceptional situations—such as genuine medical reasons—refunds may be considered only if the assigned coach agrees. Each case will be reviewed individually.
      `
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className='bg-gray-50'>
      <div className="w-full max-w-4xl mx-auto px-04 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
          Frequently Asked Questions By Parents
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center"
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-blue-600 font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${
                    openQuestion === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openQuestion === index ? 'max-h-96 p-4 pt-0' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
