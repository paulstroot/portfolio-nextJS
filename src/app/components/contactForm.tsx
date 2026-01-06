"use client";
import { escapeHtml } from "@/app/utilities/sanitize";
import { Button } from "flowbite-react";
import { useState, type FormEvent } from "react";
import Send from "./icons/send.js";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const doSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault(); // Prevent default browser form submission

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    try {
      const emailBody = [
        `Name: ${escapeHtml(String(formValues.first_name))} ${escapeHtml(
          String(formValues.last_name)
        )}`,
        `Email: ${escapeHtml(String(formValues.email))}`,
        `Phone: ${escapeHtml(String(formValues.phone))}`,
        `Message: ${escapeHtml(String(formValues.message))}`,
      ].join("\n");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: {
            email: contactEmail,
            name: `${formValues.first_name} ${formValues.last_name}`,
          },
          from: { email: contactEmail },
          subject: "Contact From Portfolio",
          text: emailBody,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      console.log("Email request queued successfully");
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Failed to send email:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
    setIsSubmitting(false);
  };
  if (success) {
    return (
      <div className="text-primary-contrast">
        <h3>Thank you</h3>
        <p>Your message has been sent successfully. Carry on.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-primary-contrast">
        <h3>Uh Oh!</h3>
        <p>There has been an error. Please try again.</p>
        <p className="text-error small">
          {escapeHtml(error).substring(0, 200)}
        </p>
      </div>
    );
  }
  return (
    <form className="mx-auto" onSubmit={doSubmit}>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="first_name"
            id="floating_first_name"
            className="peer"
            placeholder=" "
            required
          />
          <label htmlFor="floating_first_name" className="">
            First name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="last_name"
            id="floating_last_name"
            className="peer"
            placeholder=" "
            required
          />
          <label htmlFor="floating_last_name" className="">
            Last name
          </label>
        </div>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="email"
          name="email"
          id="floating_email"
          className="peer"
          placeholder=" "
          required
        />
        <label htmlFor="floating_email" className="">
          Email address
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          name="phone"
          id="floating_phone"
          className="peer"
          placeholder=" "
        />
        <label htmlFor="floating_phone" className="">
          Phone number (123-456-7890)
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <textarea
          name="message"
          id="floating_message"
          className="peer"
          placeholder=" "
          required
        />
        <label htmlFor="floating_message" className="">
          Message
        </label>
      </div>

      <Button
        className="bg-accent hover:bg-accent-700 text-accent-contrast"
        type="submit"
      >
        <span className="icon w-6 h-6 inline-block mr-2  ">
          <Send />
        </span>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
