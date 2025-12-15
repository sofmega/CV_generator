import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";
import { getAuthHeaders } from "../../lib/api";

type Plan = "FREE" | "STARTER" | "PRO";

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPlan, setCurrentPlan] = useState<Plan>("FREE");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

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

  // --------------------------------------------------
  // Load current plan from backend
  // --------------------------------------------------
  useEffect(() => {
    async function loadPlan() {
      if (!user) {
        setCurrentPlan("FREE");
        return;
      }

      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me/usage`,
          { headers }
        );

        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.plan ?? "FREE");
        }
      } catch {
        setCurrentPlan("FREE");
      }
    }

    loadPlan();
  }, [user]);

  // --------------------------------------------------
  // Subscribe (FREE → paid)
  // --------------------------------------------------
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
          body: JSON.stringify({ priceId }),
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

  // --------------------------------------------------
  // Manage subscription (Stripe Customer Portal)
  // --------------------------------------------------
  async function manageSubscription() {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoadingPortal(true);

    try {
      const headers = await getAuthHeaders();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/billing/portal`,
        {
          method: "POST",
          headers,
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to open billing portal.");
      }
    } catch (err) {
      console.error("Billing portal error:", err);
      alert("Unable to open billing portal.");
    } finally {
      setLoadingPortal(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-20 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10">Choose Your Plan</h1>

      <div className="flex gap-6 flex-wrap justify-center">
        {PLANS.map((plan) => (
          <Card key={plan.name} className="w-80 text-center p-6">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-xl font-semibold text-gray-700">{plan.price}</p>

            <p className="text-gray-600 mt-2 mb-6 text-sm">
              {plan.description}
            </p>

            {currentPlan === "FREE" ? (
              <Button
                onClick={() => subscribe(plan.stripePriceId)}
                disabled={loadingPlan === plan.stripePriceId}
                className="w-full"
              >
                {loadingPlan === plan.stripePriceId
                  ? "Redirecting…"
                  : "Subscribe"}
              </Button>
            ) : (
              <Button
                onClick={manageSubscription}
                disabled={loadingPortal}
                className="w-full"
                variant="secondary"
              >
                {loadingPortal
                  ? "Opening billing…"
                  : "Manage subscription"}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
