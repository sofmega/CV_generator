// frontend/src/components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-medium text-gray-700">{label}</label>
      )}

      <input
        {...props}
        className={`
          p-3 border rounded-lg bg-gray-50 
          focus:bg-white focus:ring-2 focus:ring-blue-500 
          outline-none transition
          ${props.className ?? ""}
        `}
      />
    </div>
  );
}
