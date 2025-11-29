import Link from "next/link";
import { Hotel, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export function DashboardFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Hotel className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Homzen</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Specializes in providing high-class tours for those in need. Contact Us
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-400">📍 329 Queensberry Street, North Melbourne VIC 3051, Australia.</p>
                            <p className="text-gray-400">📞 123 456 7890</p>
                            <p className="text-gray-400">✉️ support@homzen.com</p>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Pricing Plans
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Our Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Our Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Property For Sale
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Property For Rent
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Property For Buy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    Our Agents
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Your Weekly/Monthly Dose of Knowledge and Inspiration
                        </p>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">
                                →
                            </button>
                        </div>
                        {/* Social Media */}
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © 2024 Homzen. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="hover:text-blue-400 transition-colors">
                            Terms Of Services
                        </Link>
                        <Link href="#" className="hover:text-blue-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-blue-400 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
