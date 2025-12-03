import PropertyCard from "./HotelCard";

const latest = [
  {
    type: "HOUSE",
    title: "Coastal Serenity Cottage",
    address: "21 Hillside Drive, Beverly Hills, California",
    beds: 4, baths: 3, area: "600 SqFt",
    price: "$750.00/sqft",
    agent: "Kathryn Murphy",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
  },
  // tambah 3-4 lagi...
];

export default function LatestProperties() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {latest.concat(latest).slice(0, 4).map((prop, i) => (
        <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
          <img src={prop.image} alt="" className="w-full h-48 object-cover" />
          <div className="p-4">
            <p className="text-xs text-gray-500">{prop.type}</p>
            <h4 className="font-semibold mt-1">{prop.title}</h4>
            <p className="text-2xl font-bold text-red-600 mt-2">{prop.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}