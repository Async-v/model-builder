import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ title, description, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h2 className="text-lg font-semibold tracking-tight">{title}</h2>{description && <p className="mt-1 text-sm leading-5 text-muted">{description}</p>}</div>
        <Button size="icon" variant="ghost" aria-label="Close dialog" onClick={onClose}><X size={17}/></Button>
      </div>
      {children}
      {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
    </section>
  </div>;
}