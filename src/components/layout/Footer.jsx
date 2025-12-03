export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">H</div>
              <span className="text-xl font-bold text-white">Homzen</span>
            </div>
            <p className="text-sm">Specialized in providing high-class tours for the modern traveler.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Property for Sale</a></li>
              <li><a href="#" className="hover:text-white">Property for Rent</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Our Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Your weekly/monthly dose of knowledge and inspiration.</p>
            <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © 2025 Homzen. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}