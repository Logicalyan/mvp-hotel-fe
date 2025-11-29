"use client";

import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";

export function PropertyCard({ property }) {
    const {
        id,
        name,
        location,
        image,
        price,
        bedrooms,
        bathrooms,
        sqft,
        badges = [],
        agent,
        isFeatured = false,
    } = property;

    return (
        <Link href={`/dashboard/property/${id}`} className="block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer">
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={image || "/placeholder-hotel.jpg"}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {isFeatured && (
                            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">
                                FEATURED
                            </span>
                        )}
                        {badges.map((badge, idx) => (
                            <span
                                key={idx}
                                className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            // Handle favorite logic
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                    >
                        <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>

                    {/* Property Name */}
                    <h3 className="text-lg font-bold text-black mb-3 line-clamp-1 hover:text-blue-600 transition-colors">
                        {name}
                    </h3>

                    {/* Property Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Maximize className="w-4 h-4" />
                            <span>{sqft} SqFt</span>
                        </div>
                    </div>

                    {/* Price and Agent */}
                    <div className="flex items-center justify-between">
                        {/* Agent Info */}
                        {agent && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-600">
                                        {agent.name?.charAt(0) || "A"}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">{agent.name}</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                                ${price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">/night</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
