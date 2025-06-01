import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="max-w-7xl mx-auto px-8 bg-black/50 mt-48 backdrop-blur-md text-gray-300 py-8">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                    <div className="flex items-center space-x-3">
                        <Link2 className="h-10 w-10 text-sky-400" />
                        <span className="text-2xl font-bold text-white">Linkwith</span>
                    </div>
                    <p className="text-center md:text-right text-gray-400 text-sm">
                        Simplify your links and share them with confidence.
                    </p>
                </div>

                <div className="flex justify-around gap-6 mt-8 text-sm">
                    <div>
                        <h3 className="text-white font-semibold mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="hover:text-sky-400 transition duration-300">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-sky-400 transition duration-300">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/generate-url" className="hover:text-sky-400 transition duration-300">
                                    Shorten URL
                                </Link>
                            </li>
                            <li>
                                <Link to="/generate-qr" className="hover:text-sky-400 transition duration-300">
                                    Generate QR Code
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="hover:text-sky-400 transition duration-300">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-3">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition duration-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-600 transition duration-300">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition duration-300">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Linkwith. All rights reserved.
                </div>
            </div>
        </footer>
    );
}