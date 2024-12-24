import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentProps {
  selectedSeats: number[];
  totalAmount: number;
  onPaymentComplete?: (paidSeats: number[]) => void;
}

const Payment: React.FC<PaymentProps> = ({
  selectedSeats = [],
  totalAmount = 0,
  onPaymentComplete = () => {},
}) => {
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onPaymentComplete(selectedSeats);
      navigate("/available-buses", {
        state: {
          paymentSuccess: true,
          paidSeats: selectedSeats,
        },
      });
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Payment Details</h2>
        <div className="mb-6 bg-slate-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <p>Selected Seats: {selectedSeats.join(", ")}</p>
          <p className="text-lg font-bold mt-2">
            Total Amount: {totalAmount.toLocaleString()} LKR
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Cardholder Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium">
              Card Number
            </label>
            <input
              id="number"
              name="number"
              type="text"
              placeholder="4111 1111 1111 1111"
              value={cardDetails.number}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setCardDetails((prev) => ({
                  ...prev,
                  number: formatted,
                }));
              }}
              maxLength={19}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium">
                Expiry Date
              </label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setCardDetails((prev) => ({
                    ...prev,
                    expiry: formatted,
                  }));
                }}
                maxLength={5}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium">
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                maxLength={3}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isProcessing
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition-colors duration-200`}
          >
            {isProcessing
              ? "Processing..."
              : `Pay ${totalAmount.toLocaleString()} LKR`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default Payment;
