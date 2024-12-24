import buildings from "../assets/buildings.jpg";

const Header = () => {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 w-full h-96 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${buildings})`,
        }}
      />

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="relative z-20 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-6">
            Online Seat Reservation
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
