import { Building2, Mountain, Coffee, Dumbbell, ShoppingCart } from "lucide-react";

export default function HotelDescription({ hotel }) {
  const features = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Strategic Location",
      description: "Located nearby top universities: Universitas Muhammadiyah Malang, Universitas Negeri Malang, and Universitas Brawijaya."
    },
    {
      icon: <Mountain className="h-6 w-6" />,
      title: "Stunning View",
      description: "Enjoy breathtaking Arjuna Mountain view with misty morning ambience."
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Complete Facilities",
      description: "Features kitchen, cozy sofa, and bunk bed catering up to 3 guests."
    },
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Recreational Areas",
      description: "Two pools, gym, futsal field for your fitness and leisure needs."
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Convenience Store",
      description: "On-site minimarket and coffee shop for your daily needs."
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Studio Apartment in Strategic Malang Location</h2>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-gray-700 leading-relaxed mb-6">
          A studio apartment in strategic location in Malang. Perfect for students and academics 
          with proximity to major universities. Situated on the main road to Batu - East Java's 
          premier tourist destination - making it ideal for tourists as well.
        </p>
        
        <p className="text-gray-700 leading-relaxed">
          This modern apartment features contemporary design with all essential amenities for 
          a comfortable stay. Whether you're visiting for education, business, or leisure, 
          this property offers the perfect balance of convenience and comfort.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}