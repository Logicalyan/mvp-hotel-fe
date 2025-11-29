"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Hotel, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";

export function DashboardHeader() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Hotel className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-black">Homzen</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/dashboard/listing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Listing
                        </Link>
                        <Link href="/dashboard/properties" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Properties
                        </Link>
                        <Link href="/dashboard/pages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Pages
                        </Link>
                        <Link href="/dashboard/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Blog
                        </Link>
                    </nav>

                    {/* Right Side - User & Actions */}
                    <div className="flex items-center gap-4">
                        {/* User Info */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-black">{user?.name || "Guest"}</div>
                                <div className="text-gray-500 text-xs">{user?.email}</div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="hidden md:flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col gap-3">
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                                Home
                            </Link>
                            <Link href="/dashboard/listing" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                                Listing
                            </Link>
                            <Link href="/dashboard/properties" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                                Properties
                            </Link>
                            <Link href="/dashboard/pages" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                                Pages
                            </Link>
                            <Link href="/dashboard/blog" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                                Blog
                            </Link>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-black">{user?.name || "Guest"}</div>
                                        <div className="text-gray-500 text-xs">{user?.email}</div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
