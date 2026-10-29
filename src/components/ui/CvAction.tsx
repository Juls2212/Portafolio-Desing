"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { buttonClasses } from "./Button";

const PENDING_MESSAGE = "CV pendiente: añade el archivo PDF";

/**
 * "Descargar CV" action. With a real `site.cvUrl` it is a download link; otherwise it is a
 * button that announces a status message (aria-live) and never navigates.
 */
export function CvAction({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const announce = () => {
    setMessage(PENDING_MESSAGE);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 5000);
  };

  const label = (
    <>
      Descargar CV <span aria-hidden="true">↓</span>
    </>
  );

  return (
    <>
      {site.cvUrl ? (
        <a href={site.cvUrl} download className={buttonClasses("primary", className)}>
          {label}
        </a>
      ) : (
        <button type="button" onClick={announce} className={buttonClasses("primary", className)}>
          {label}
        </button>
      )}
      <span role="status" aria-live="polite" className="basis-full font-mono text-xs text-text-muted empty:hidden">
        {message}
      </span>
    </>
  );
}
