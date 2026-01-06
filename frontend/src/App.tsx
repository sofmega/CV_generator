// frontend/src/App.tsx
import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";

import HomePage from "./product/home/HomePage";
import { GeneratePage } from "./product/generator/GeneratePage";

import LoginPage from "./product/auth/LoginPage";
import RegisterPage from "./product/auth/RegisterPage";
import AuthCallback from "./product/auth/AuthCallback";
import PricingPage from "./product/pricing/PricingPage";
import PaymentSuccess from "./product/pricing/PaymentSuccess";
import AccountPage from "./product/account/AccountPage";
import ResetPasswordPage from "./product/auth/ResetPasswordPage";

import FeedbackPage from "./product/account/FeedbackPage";
import FeedbackFloatingButton from "./components/ui/FeedbackFloatingButton";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <FeedbackFloatingButton />

      <main>
        <Routes>
          
          <Route path="/" element={<HomePage />} />

          
          <Route path="/ai-cv-generator" element={<GeneratePage mode="cv" />} />
          <Route
            path="/cover-letter-generator"
            element={<GeneratePage mode="coverLetter" />}
          />

          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </main>
    </div>
  );
}
