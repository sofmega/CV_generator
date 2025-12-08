// frontend/src/product/pricing/PaymentSuccess.tsx
export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-gray-700 mb-8">
        Your subscription is now active. Thank you!
      </p>

      <a
        href="/"
        className="text-blue-600 underline text-lg font-medium"
      >
        Go back to dashboard
      </a>
    </div>
  );
}
