// frontend/src/product/account/AccountPage.tsx
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";

export default function AccountPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  const email = user.email ?? "";
  const fullName = user.user_metadata?.full_name ?? "—";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Account settings
        </h1>

        <Card>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500">Full name</p>
              <p className="font-medium text-gray-900">{fullName}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
