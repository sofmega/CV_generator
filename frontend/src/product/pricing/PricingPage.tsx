// frontend/src/product/pricing/PricingPage.tsx
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuthHeaders } from "../../lib/api"; 

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const PLANS = [
    {
      name: "Starter",
      price: "9€ / month",
      description: "50 AI generations per month",
      stripePriceId: "price_1Sc6euLPQul2TqUGUBDjs9de",
    },
    {
      name: "Pro",
      price: "29€ / month",
      description: "Unlimited or 200+ generations per month",
      stripePriceId: "price_1Sc6fcLPQul2TqUGKIlyWCGN",
    },
  ];

  async function subscribe(priceId: string) {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoadingPlan(priceId);

    try {
      const headers = await getAuthHeaders(); 

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers, 
          },
          body: JSON.stringify({
            priceId, 
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe error: No checkout URL returned.");
      }
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert("Unable to start payment. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-20 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10">Choose Your Plan</h1>

      <div className="flex gap-6 flex-wrap justify-center">
        {PLANS.map((plan) => (
          <Card key={plan.name} className="w-80 text-center p-6">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-xl font-semibold text-gray-700">{plan.price}</p>

            {plan.description && (
              <p className="text-gray-600 mt-2 mb-6 text-sm">
                {plan.description}
              </p>
            )}

            <Button
              onClick={() => subscribe(plan.stripePriceId)}
              disabled={loadingPlan === plan.stripePriceId}
              className="w-full"
            >
              {loadingPlan === plan.stripePriceId ? "Redirecting…" : "Subscribe"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
