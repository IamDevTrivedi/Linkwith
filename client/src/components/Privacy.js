import React from 'react';
import { ShieldCheck, UserCheck, Mail } from 'lucide-react';

export default function Privacy() {

  document.title = "Privacy Policy | Linkwith | Create Custom Short URLs with Ease";

  return (
    <div className="max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-8 text-gray-300">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Your privacy is our top priority. Here's how we handle and protect your data.
        </p>
      </div>

      {/* Introduction Section */}
      <div className="bg-black/50 p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-3xl font-semibold text-white mb-6">Introduction</h2>
        <p className="text-lg text-gray-400">
          At <span className="text-sky-400">Linkwith</span>, we value your trust and are committed to safeguarding your personal information. This privacy policy outlines how we collect, use, and protect your data when you use our services.
        </p>
      </div>

      {/* Data Usage Section */}
      <div className="mb-12 p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Data Collection and Usage</h2>
        <ul className="space-y-4 text-lg text-gray-400">
          <li className="flex items-start space-x-4">
            <ShieldCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Information You Provide:</strong> We collect the data you provide directly, such as your email address and link details.
            </span>
          </li>
          <li className="flex items-start space-x-4">
            <ShieldCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Automatic Data Collection:</strong> We collect data like your IP address, browser type, and usage patterns for analytics and security purposes.
            </span>
          </li>
          <li className="flex items-start space-x-4">
            <ShieldCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Third-Party Services:</strong> Data shared with third-party services is minimal and only for the purpose of improving user experience.
            </span>
          </li>
        </ul>
      </div>

      {/* User Rights Section */}
      <div className="bg-black/50 p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-3xl font-semibold text-white mb-6">Your Rights</h2>
        <ul className="space-y-4 text-lg text-gray-400">
          <li className="flex items-start space-x-4">
            <UserCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Access Your Data:</strong> You have the right to request a copy of your personal data.
            </span>
          </li>
          <li className="flex items-start space-x-4">
            <UserCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Request Deletion:</strong> You can request the deletion of your data at any time.
            </span>
          </li>
          <li className="flex items-start space-x-4">
            <UserCheck className="h-8 w-8 text-sky-400" />
            <span>
              <strong>Update Information:</strong> You can update your personal information in your account settings.
            </span>
          </li>
        </ul>
      </div>

      {/* Contact Information Section */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-6">Contact Us</h2>
        <p className="text-lg text-gray-400">
          If you have any questions about this privacy policy or your data, feel free to reach out.
        </p>
        <div className="mt-4">
          <Mail className="h-8 w-8 text-sky-400 mx-auto" />
          <p className="text-lg text-sky-400 mt-2">privacy@linkwith.com</p>
        </div>
      </div>
    </div>
  );
}
