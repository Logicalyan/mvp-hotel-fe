"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, Search } from "lucide-react";
import { 
  getProvinces, 
  getCities, 
  getDistricts, 
  getSubDistricts,
  getHotelFacilities 
} from "@/lib/services/reference";

const priceRanges = [
  { label: "Di bawah Rp500.000", min: 0, max: 500000 },
  { label: "Rp500.000 - Rp1.000.000", min: 500000, max: 1000000 },
  { label: "Rp1.000.000 - Rp2.000.000", min: 1000000, max: 2000000 },
  { label: "Di atas Rp2.000.000", min: 2000000, max: 999999999 },
];

export default function FilterSidebar({ onApply }) {
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    province_id: "",
    city_id: "",
    district_id: "",
    sub_district_id: "",
    facilities: [],
    price_min: "",
    price_max: "",
  });

  useEffect(() => {
    Promise.all([getProvinces(), getHotelFacilities()])
      .then(([provData, facData]) => {
        setProvinces(provData);
        setFacilities(facData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filters.province_id) {
      getCities(filters.province_id).then(setCities);
    } else {
      setCities([]);
      setDistricts([]);
      setSubDistricts([]);
      setFilters(prev => ({ ...prev, city_id: "", district_id: "", sub_district_id: "" }));
    }
  }, [filters.province_id]);

  useEffect(() => {
    if (filters.city_id) {
      getDistricts(filters.city_id).then(setDistricts);
    } else {
      setDistricts([]);
      setSubDistricts([]);
      setFilters(prev => ({ ...prev, district_id: "", sub_district_id: "" }));
    }
  }, [filters.city_id]);

  useEffect(() => {
    if (filters.district_id) {
      getSubDistricts(filters.district_id).then(setSubDistricts);
    } else {
      setSubDistricts([]);
      setFilters(prev => ({ ...prev, sub_district_id: "" }));
    }
  }, [filters.district_id]);

  const handleFacilityToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(id)
        ? prev.facilities.filter(f => f !== id)
        : [...prev.facilities, id]
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      price_min: prev.price_min === min && prev.price_max === max ? "" : min,
      price_max: prev.price_min === min && prev.price_max === max ? "" : max,
    }));
  };

  const applyFilters = () => {
    const cleanFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && (!Array.isArray(value) || value.length > 0)) {
        cleanFilters[key] = value;
      }
    });
    if (search) cleanFilters.search = search;
    onApply(cleanFilters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      province_id: "",
      city_id: "",
      district_id: "",
      sub_district_id: "",
      facilities: [],
      price_min: "",
      price_max: "",
    });
    setSearch("");
    onApply({});
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Filter Pencarian</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Cari nama hotel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      <div className="space-y-4">
        <Label className="font-semibold">Lokasi</Label>

        <Select value={filters.province_id} onValueChange={(v) => setFilters(prev => ({ ...prev, province_id: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map(p => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.city_id} onValueChange={(v) => setFilters(prev => ({ ...prev, city_id: v }))} disabled={!filters.province_id}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kota/Kabupaten" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.district_id} onValueChange={(v) => setFilters(prev => ({ ...prev, district_id: v }))} disabled={!filters.city_id}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kecamatan" />
          </SelectTrigger>
          <SelectContent>
            {districts.map(d => (
              <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sub_district_id} onValueChange={(v) => setFilters(prev => ({ ...prev, sub_district_id: v }))} disabled={!filters.district_id}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kelurahan" />
          </SelectTrigger>
          <SelectContent>
            {subDistricts.map(s => (
              <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold">Harga per Malam</Label>
        <div className="mt-3 space-y-2">
          {priceRanges.map(range => (
            <div key={range.min} className="flex items-center gap-3">
              <Checkbox
                checked={filters.price_min == range.min && filters.price_max == range.max}
                onCheckedChange={() => handlePriceChange(range.min, range.max)}
              />
              <Label className="cursor-pointer text-sm">{range.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="font-semibold">Fasilitas Hotel</Label>
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {facilities.map(fac => (
            <div key={fac.id} className="flex items-center gap-3">
              <Checkbox
                checked={filters.facilities.includes(fac.id)}
                onCheckedChange={() => handleFacilityToggle(fac.id)}
              />
              <Label className="cursor-pointer text-sm">{fac.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" onClick={applyFilters}>
        Terapkan Filter
      </Button>
    </div>
  );
}
