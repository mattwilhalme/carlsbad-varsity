"use client";

import { FormEvent, useState } from "react";

const cmsUrl = (process.env.NEXT_PUBLIC_CMS_URL ?? "https://north-county-press.onrender.com").replace(/\/$/, "");

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function CoverageRequestForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${cmsUrl}/api/coverage-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) throw new Error(result.error || "We could not submit your request.");

      form.reset();
      setState("success");
      setMessage("Thank you. Your request has been sent to our editorial team. Coverage is subject to availability and is not guaranteed.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not submit your request. Please try again or email us.");
    }
  }

  return (
    <form className="coverage-request-form" onSubmit={submitRequest} noValidate>
      <div className="form-grid">
        <label>
          <span>Your name <small>Optional</small></span>
          <input name="requesterName" type="text" autoComplete="name" maxLength={160} />
        </label>
        <label>
          <span>Email <small>Optional</small></span>
          <input name="email" type="email" autoComplete="email" maxLength={320} />
        </label>
        <label>
          <span>Phone <small>Optional</small></span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={80} />
        </label>
        <label>
          <span>School or team <small>Optional</small></span>
          <input name="schoolOrTeam" type="text" maxLength={240} />
        </label>
        <label>
          <span>Event name <small>Optional</small></span>
          <input name="eventName" type="text" maxLength={240} />
        </label>
        <label>
          <span>Event date and time <small>Optional</small></span>
          <input name="eventDate" type="datetime-local" />
        </label>
        <label className="form-wide">
          <span>Location <small>Optional</small></span>
          <input name="location" type="text" autoComplete="street-address" maxLength={320} />
        </label>
        <label className="form-wide">
          <span>Tell us about the event or story <small>Optional</small></span>
          <textarea name="details" rows={8} maxLength={5000} />
        </label>
      </div>

      <label className="website-field" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <button className="coverage-submit" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting…" : "Submit coverage request"}
      </button>

      {message ? <p className={`form-message ${state}`} role="status" aria-live="polite">{message}</p> : null}
    </form>
  );
}
