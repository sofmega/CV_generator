import React from "react";

interface NavbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function NavbarButton({
  children,
  className = "",
  ...props
}: NavbarButtonProps) {
  return (
    <button
      {...props}
      className={`text-blue-600 hover:text-blue-800 font-medium transition ${className}`}
    >
      {children}
    </button>
  );
}
