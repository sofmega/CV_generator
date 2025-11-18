// cvgen/src/App.tsx

import { useEffect } from "react";
import { testSupabase } from "./utils/testSupabase";

export default function App() {
  useEffect(() => {
    testSupabase();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        🚀 Tailwind is working!
      </h1>
    </div>
  );
}
