// frontend/src/App.tsx
import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";

import { GeneratePage } from "./product/generator/GeneratePage.tsx";
import LoginPage from "./product/auth/LoginPage";
import RegisterPage from "./product/auth/RegisterPage";
import AuthCallback from "./product/auth/AuthCallback";
import PricingPage from "./product/pricing/PricingPage";
import PaymentSuccess from "./product/pricing/PaymentSuccess";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="pt-10">
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          

        </Routes>
      </main>
    </div>
  );
}
