import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function BookingCard({ hotel }) {
  return (
    <Card className="p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold">Rp 850.000</p>
          <p className="text-sm text-gray-500">mulai dari / malam</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
          </div>
          <p className="text-xs text-gray-500">128 ulasan</p>
        </div>
      </div>

      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6">
        Pilih Kamar
      </Button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Harga sudah termasuk pajak
      </p>
    </Card>
  );
}   