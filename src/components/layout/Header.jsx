"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold text-gray-900">Homzen</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Listing</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Properties</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Pages</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Blog</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hidden md:block text-sm text-gray-700 hover:text-gray-900">
              Login/Register
            </a>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Submit Property
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Home</DropdownMenuItem>
                <DropdownMenuItem>Listing</DropdownMenuItem>
                <DropdownMenuItem>Properties</DropdownMenuItem>
                <DropdownMenuItem>Pages</DropdownMenuItem>
                <DropdownMenuItem>Blog</DropdownMenuItem>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Login/Register</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}