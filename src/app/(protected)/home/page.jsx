"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getHotels } from "@/lib/services/hotel";
import HotelCard from "@/components/home/HotelCard";
import HeroSearchBar from "@/components/home/HeroSearchBar";
import FilterSidebar from "@/components/home/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchHotels = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getHotels(page, filters);
      setHotels(res.hotels);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(1);
  }, [filters]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= meta.last_page) {
      fetchHotels(page);
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO + SEARCH BAR ala Traveloka */}
      <HeroSearchBar onSearch={setFilters} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTER */}
          <div className="lg:col-span-1">
            <FilterSidebar onApply={setFilters} />
          </div>

          {/* HOTEL LIST */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {meta.total > 0 ? `${meta.total} Hotel ditemukan` : "Cari Hotel"}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-2xl" />
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <p className="text-xl text-gray-500">Tidak ada hotel yang cocok</p>
                <p className="text-gray-400 mt-2">Coba ubah filter pencarian</p>
              </div>
            )}

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={meta.current_page === 1}
                  onClick={() => handlePageChange(meta.current_page - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {[...Array(Math.min(5, meta.last_page))].map((_, i) => {
                  let pageNum;
                  if (meta.last_page <= 5) pageNum = i + 1;
                  else if (meta.current_page <= 3) pageNum = i + 1;
                  else if (meta.current_page > meta.last_page - 3)
                    pageNum = meta.last_page - 4 + i;
                  else pageNum = meta.current_page - 2 + i;

                  return (
                    <Button
                      key={pageNum}
                      variant={meta.current_page === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => handlePageChange(meta.current_page + 1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}