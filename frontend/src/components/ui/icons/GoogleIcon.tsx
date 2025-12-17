// frontend/src/components/ui/icons/GoogleIcon.tsx
export default function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M44.5 20H24v8.5h11.8C34.3 33.7 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.6 1.3 9 3.5l6-6C35.3 5.1 30 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.2-2.7-.5-4z"
        fill="#FFC107"
      />
      <path
        d="M6.3 14.7l7 5.1C15.2 15.2 19.2 12 24 12c3.5 0 6.6 1.3 9 3.5l6-6C35.3 5.1 30 3 24 3 16 3 9.1 7.5 6.3 14.7z"
        fill="#FF3D00"
      />
      <path
        d="M24 45c5.6 0 10.8-2.1 14.7-5.9l-6.8-5.6C29.7 37 27 38 24 38c-5.6 0-10.4-3.8-12.1-9l-7 5.4C7.6 41.5 15.3 45 24 45z"
        fill="#4CAF50"
      />
      <path
        d="M44.5 20H24v8.5h11.8c-1.1 3-3.2 5.3-5.9 6.9l.0.0 6.8 5.6C40.6 37.3 44 31.9 44 24c0-1.4-.2-2.7-.5-4z"
        fill="#1976D2"
      />
    </svg>
  );
}
