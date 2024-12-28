import Header from "../Header/Header";

const Home = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12">
            Why Choose Our Service?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-yellow-500 text-4xl mb-4">💺</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Reservations</h3>
              <p className="text-gray-600">
                Book your seats online with just a few clicks, ensuring a hassle-free experience.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-yellow-500 text-4xl mb-4">📆</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Real-Time Availability</h3>
              <p className="text-gray-600">
                Check seat availability in real-time and secure your spot immediately.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-yellow-500 text-4xl mb-4">🚍</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Wide Network</h3>
              <p className="text-gray-600">
                Access a wide network of buses and routes to suit your travel needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-yellow-500 py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-6">
            Ready to Book Your Seat?
          </h2>
          <p className="text-lg sm:text-xl text-black mb-8">
            Don't wait any longer! Reserve your seat now and experience the convenience of online
            booking.
          </p>
          {/* <button
            className="bg-black text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            aria-label="Book Your Seat"
          >
            Book Your Seat
          </button> */}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Online Seat Reservation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
