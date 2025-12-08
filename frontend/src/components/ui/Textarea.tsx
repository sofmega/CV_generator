// frontend/src/components/ui/Textarea.tsx
import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-medium text-gray-700">{label}</label>
      )}

      <textarea
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
