import React from "react";
import {
  FiUploadCloud,
  FiZap,
  FiShield,
  FiBarChart2,
  FiFileText,
  FiClock,
} from "react-icons/fi";

function FeaturesSection() {
  const features = [
    {
      icon: FiUploadCloud,
      title: "Easy File Upload",
      description:
        "Drag and drop your CSV files or click to browse. Support for large files up to 100MB.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description:
        "Process thousands of rows in seconds with our optimized data processing engine.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description:
        "Your data is processed securely and never stored permanently on our servers.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: FiBarChart2,
      title: "Data Insights",
      description:
        "Get instant statistics and insights about your data with visual previews.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: FiFileText,
      title: "Smart Validation",
      description:
        "Automatic data validation and error detection to ensure data quality.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      icon: FiClock,
      title: "Real-time Processing",
      description:
        "See your data being processed in real-time with live progress updates.",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div
      id="features"
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center animate-fadeIn">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase mb-2">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            A better way to process your data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
            Our platform offers powerful tools to make data processing simple
            and efficient.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-2 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient border on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}
                ></div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`${feature.iconColor} text-2xl`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 -z-10`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div
          className="mt-16 text-center animate-fadeIn"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span>Ready to get started? Try it now →</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
