// frontend/src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const { user } = useAuthContext();

  return (
    <header className="w-full bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="text-xl font-semibold text-gray-800">
        <Link to="/">CVPRO AI</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/pricing" className="text-gray-700 hover:underline">
          Pricing
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Register
            </Link>
          </>
        ) : (
          <ProfileMenu />
        )}
      </div>
    </header>
  );
}
