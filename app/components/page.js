"use client";

export default function PricingPage() {
  const plans = [
    {
      title: "Beginner",
      price: "₹1,999/month",
      description: "Perfect for beginners starting their chess journey.",
      features: [
        "4 weekly classes",
        "AI training tools",
        "Weekend online tournaments",
        "Stage completion certificate",
        "Performance tracking dashboard",
      ],
      color: "blue"
    },
    {
      title: "Intermediate",
      price: "₹2,999/month",
      description: "Ideal for kids who know basics and want structured improvement.",
      features: [
        "8 weekly classes",
        "Advanced AI tools",
        "Detailed game analysis",
        "Tournament preparation",
        "Stage completion certificate"
      ],
      color: "purple"
    },
    {
      title: "Advanced",
      price: "₹3,999/month",
      description: "For serious learners aiming for competitive excellence.",
      features: [
        "12 weekly classes",
        "Professional-level training",
        "Deep analysis with coaches",
        "FIDE-level study material",
        "Stage completion certificate"
      ],
      color: "red"
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Simple & Transparent Pricing
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-12">
          Choose the perfect plan for your child — no hidden fees.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:scale-[1.02] transition-all"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {plan.title}
                </h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {plan.price}
                </p>
                <p className="text-gray-500 mt-2">{plan.description}</p>
              </div>

              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✔</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-6 py-3 text-white rounded-xl font-medium 
                bg-${plan.color}-600 hover:bg-${plan.color}-700 transition-all`}
              >
                Book Free Demo
              </button>
            </div>
          ))}
        </div>

        {/* Extra Info */}
        <div className="mt-16 text-center max-w-3xl mx-auto text-gray-700">
          <h3 className="text-xl font-semibold mb-3">What’s Included in Every Plan?</h3>
          <p>
            Compensation classes for valid absences • Weekly tournaments • AI tools • 
            Certificates • Parent support • Performance dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
