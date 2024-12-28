import { Link } from "react-router-dom";
import buildings from "../assets/buildings.jpg";

const Header = () => {
  return (
    <div className="relative">
      {/* Background Image Section */}
      <div
        className="absolute inset-0 w-full h-96 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${buildings})`,
        }}
      ></div>

      {/* Dark Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Content Section */}
      <div className="relative z-20 px-4 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6">
            Online Seat Reservation
          </h1>

          {/* Subtitle */}
          <p className="text-white text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
            Reserve your seat effortlessly with our online booking system. Explore availability and
            book your spot in just a few clicks.
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <Link to={'/bookings'}>
              <button
                className="bg-yellow-500 text-black py-2 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition"
                aria-label="Book Now"
              >
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
