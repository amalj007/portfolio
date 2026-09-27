"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { FormEvent, PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";

const mailTo = "amaljoy519@gmail.com";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.5 });

  function magnet(event: ReactPointerEvent<HTMLButtonElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12);
  }

  function resetMagnet() {
    x.set(0);
    y.set(0);
  }

  function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const message = String(fields.get("message") || "").trim();
    const subject = encodeURIComponent("Automation engineering enquiry from " + name);
    const body = encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message);
    setStatus("Your mail app is opening with this message drafted.");
    window.location.href = "mailto:" + mailTo + "?subject=" + subject + "&body=" + body;
  }

  return (
    <form className="message-form" onSubmit={createDraft}>
      <div className="message-form-heading">
        <span className="mono-label">DIRECT CHANNEL / 01</span>
        <span className="message-form-rule" aria-hidden="true" />
      </div>
      <label className="message-field">
        <span>YOUR NAME</span>
        <input name="name" type="text" autoComplete="name" placeholder="Name" required maxLength={100} />
      </label>
      <label className="message-field">
        <span>EMAIL ADDRESS</span>
        <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={160} />
      </label>
      <label className="message-field">
        <span>MESSAGE</span>
        <textarea name="message" rows={3} placeholder="What are you building?" required maxLength={2000} />
      </label>
      <motion.button
        className="button button-primary message-submit"
        type="submit"
        style={{ x, y }}
        onPointerMove={magnet}
        onPointerLeave={resetMagnet}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <span>Draft a message</span><span className="button-icon" aria-hidden="true">↗</span>
      </motion.button>
      <p className="message-form-note" aria-live="polite">
        {status || "Opens your email app with a draft. Nothing is sent automatically."}
      </p>
    </form>
  );
}

