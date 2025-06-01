import React from 'react';
import { Users, Briefcase, CheckCircle } from 'lucide-react';

export default function About() {

    document.title = "About | Linkwith | Create Custom Short URLs with Ease";

    return (
        <div className="max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-8 text-gray-300">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-white">
                    About <span className="text-sky-400">Linkwith</span>
                </h1>
                <p className="mt-4 text-lg text-gray-400">
                    Empowering seamless link management for individuals and businesses worldwide.
                </p>
            </div>

            {/* Mission Section */}
            <div className="bg-black/50 p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-3xl font-semibold text-white text-center mb-6">
                    Our Mission
                </h2>
                <p className="text-center text-gray-400 text-lg">
                    At <span className="text-sky-400">Linkwith</span>, we strive to make links smarter,
                    more accessible, and engaging. From shortening URLs to generating QR codes and tracking analytics,
                    our platform simplifies how you connect and share information.
                </p>
            </div>

            {/* Team Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold text-white text-center mb-8">
                    Meet Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Users className="h-12 w-12 text-sky-400" />
                        <h3 className="text-xl font-bold text-white">Dev Trivedi</h3>
                        <p className="text-sm text-gray-400">Founder & CEO</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Users className="h-12 w-12 text-sky-400" />
                        <h3 className="text-xl font-bold text-white">Dev Trivedi</h3>
                        <p className="text-sm text-gray-400">Head of Development</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Users className="h-12 w-12 text-sky-400" />
                        <h3 className="text-xl font-bold text-white">Dev Trivedi</h3>
                        <p className="text-sm text-gray-400">Marketing Lead</p>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-black/50 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-white text-center mb-6">
                    Why Choose Us?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4">
                        <Briefcase className="h-12 w-12 text-sky-400 mx-auto" />
                        <h3 className="text-xl font-bold text-white">Professional Tools</h3>
                        <p className="text-sm text-gray-400">
                            Powerful tools for managing and analyzing links effectively.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <CheckCircle className="h-12 w-12 text-sky-400 mx-auto" />
                        <h3 className="text-xl font-bold text-white">User-Friendly</h3>
                        <p className="text-sm text-gray-400">
                            Designed with simplicity and ease of use for everyone.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Briefcase className="h-12 w-12 text-sky-400 mx-auto" />
                        <h3 className="text-xl font-bold text-white">Customizable Options</h3>
                        <p className="text-sm text-gray-400">
                            Tailor the platform to fit your needs with flexible features.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
