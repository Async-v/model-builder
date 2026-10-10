import React from "react";

const variants = {
  primary: "bg-ink text-white hover:bg-[#2b3b33] border border-ink",
  secondary: "bg-white text-ink border border-line hover:bg-canvas",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-canvas border border-transparent",
  danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50"
};

export default function Button({ children, variant = "secondary", size = "md", className = "", ...props }) {
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", icon: "h-9 w-9" };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}