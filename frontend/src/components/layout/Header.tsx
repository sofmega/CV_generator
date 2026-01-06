import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const { user } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center justify-between">
          
          {/* BRAND */}
          <Link to="/" className="flex items-center gap-3">
            {/* LOGO */}
            <img
              src="/logo.png"
              alt="JOB INCUBATEUR"
              className="h-16 w-16 object-cover transition-transform duration-200 hover:scale-[1.03]"
              draggable={false}
            />

            {/* TEXT */}
            <div className="leading-tight">
              <div className="text-base font-semibold text-gray-900 tracking-tight">
                JOB INCUBATEUR
              </div>

              <div className="text-sm text-gray-500 hidden sm:block">
                CV & Cover Letter AI
                
              </div>
            </div>
          </Link>
          


          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/blog" className="text-gray-700 hover:underline">
  Blog
</Link>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Pricing
            </NavLink>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <ProfileMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
