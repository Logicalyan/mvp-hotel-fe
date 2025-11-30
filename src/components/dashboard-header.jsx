"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

export function DashboardHeader() {
    const { user, logout, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    // Don't render user-dependent content until hydration is complete
    if (!isClient) {
        return (
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1.5">
                                <Image src="/image/logo remove bg.png" alt="HotelLoop Logo" width={28} height={28} className="object-contain" />
                            </div>
                            <span className="text-xl font-bold text-black">HotelLoop</span>
                        </Link>
                        <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1.5">
                            <Image src="/image/logo remove bg.png" alt="HotelLoop Logo" width={28} height={28} className="object-contain" />
                        </div>
                        <span className="text-xl font-bold text-black">HotelLoop</span>
                    </Link>

                    {/* Right Side - User Profile Dropdown */}
                    <div className="flex items-center gap-4">
                        {/* Desktop User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hidden md:flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200 border border-transparent hover:border-gray-200">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-sm text-left">
                                        <div className="font-semibold text-gray-900">{user?.name || ""}</div>
                                        <div className="text-gray-500 text-xs truncate max-w-[150px]">{user?.email || ""}</div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                                <DropdownMenuLabel className="text-gray-700 font-semibold">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-200" />
                                <div className="px-3 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 truncate">{user?.name || ""}</div>
                                            <div className="text-gray-500 text-xs truncate">{user?.email || ""}</div>
                                            {user?.role && (
                                                <div className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                                                    {user.role}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-gray-200" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="cursor-pointer font-medium"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                                        <div className="font-medium text-black">{user?.name || ""}</div>
                                        <div className="text-gray-500 text-xs">{user?.email || ""}</div>
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
