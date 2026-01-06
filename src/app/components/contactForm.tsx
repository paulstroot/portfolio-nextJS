"use client";
import { escapeHtml } from "@/app/utilities/sanitize";
import { Button } from "flowbite-react";
import { useState, type FormEvent } from "react";
import Send from "./icons/send.js";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  type FormValues = {
    first_name?: FormDataEntryValue;
    last_name?: FormDataEntryValue;
    email?: FormDataEntryValue;
    phone?: FormDataEntryValue;
    message?: FormDataEntryValue;
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidPhone = (value: string) => /^(\d{3}-\d{3}-\d{4})$/.test(value);

  const validate = (values: FormValues) => {
    const errors: Record<string, string> = {};
    const first = String(values.first_name ?? "").trim();
    const last = String(values.last_name ?? "").trim();
    const email = String(values.email ?? "").trim();
    const phone = String(values.phone ?? "").trim();
    const message = String(values.message ?? "").trim();
    if (!first) errors.firstname = "First name is required.";
    if (!last) errors.lastname = "Last name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (phone && !isValidPhone(phone)) {
      errors.phone = "Phone must be in the format 123-456-7890.";
    }
    if (!message) {
      errors.message = "Message is required.";
    } else if (message.length < 5) {
      errors.message = "Message must be at least 5 characters.";
    }
    return errors;
  };

  const validateField = (name: string, value: string) => {
    const current: Record<string, string> = { ...validationErrors };
    switch (name) {
      case "first_name": {
        if (!value.trim()) current.firstname = "First name is required.";
        else delete current.firstname;
        break;
      }
      case "last_name": {
        if (!value.trim()) current.lastname = "Last name is required.";
        else delete current.lastname;
        break;
      }
      case "email": {
        if (!value.trim()) current.email = "Email is required.";
        else if (!isValidEmail(value.trim()))
          current.email = "Enter a valid email address.";
        else delete current.email;
        break;
      }
      case "phone": {
        if (value.trim() && !isValidPhone(value.trim()))
          current.phone = "Phone must be 123-456-7890.";
        else delete current.phone;
        break;
      }
      case "message": {
        if (!value.trim()) current.message = "Message is required.";
        else if (value.trim().length < 5)
          current.message = "Message must be at least 5 characters.";
        else delete current.message;
        break;
      }
      default:
        break;
    }
    setValidationErrors(current);
  };

  const doSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setHasSubmittedOnce(true);
    setIsSubmitting(true);
    event.preventDefault(); // Prevent default browser form submission

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries()) as FormValues;

    const errors = validate(formValues);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

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
      <div
        className="text-primary-contrast"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3>Thank you</h3>
        <p>Your message has been sent successfully. Carry on.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="text-primary-contrast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <h3>Uh Oh!</h3>
        <p>There has been an error. Please try again.</p>
        <p className="text-error small">
          {escapeHtml(error).substring(0, 200)}
        </p>
      </div>
    );
  }
  return (
    <form
      className={`mx-auto ${hasSubmittedOnce ? "submitted" : ""}`}
      onSubmit={doSubmit}
      noValidate
    >
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="first_name"
            id="floating_first_name"
            className={`peer ${
              validationErrors.firstname ? "invalid" : "valid"
            }`}
            placeholder=" "
            required
            aria-invalid={validationErrors.firstname ? "true" : "false"}
            aria-describedby={
              validationErrors.firstname ? "firstname-error" : undefined
            }
            onBlur={(e) => validateField("first_name", e.target.value)}
          />
          {validationErrors.firstname && (
            <span
              id="firstname-error"
              className="error-message"
              role="alert"
              aria-live="assertive"
            >
              {validationErrors.firstname}
            </span>
          )}
          <label htmlFor="floating_first_name" className="">
            First name
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="last_name"
            id="floating_last_name"
            className={`peer ${
              validationErrors.lastname ? "invalid" : "valid"
            }`}
            placeholder=" "
            required
            aria-invalid={validationErrors.lastname ? "true" : "false"}
            aria-describedby={
              validationErrors.lastname ? "lastname-error" : undefined
            }
            onBlur={(e) => validateField("last_name", e.target.value)}
          />
          {validationErrors.lastname && (
            <span
              id="lastname-error"
              className="error-message"
              role="alert"
              aria-live="assertive"
            >
              {validationErrors.lastname}
            </span>
          )}
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
          className={`peer ${validationErrors.email ? "invalid" : "valid"}`}
          placeholder=" "
          required
          aria-invalid={validationErrors.email ? "true" : "false"}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
          onBlur={(e) => validateField("email", e.target.value)}
        />
        {validationErrors.email && (
          <span
            id="email-error"
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            {validationErrors.email}
          </span>
        )}
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
          className={`peer ${validationErrors.phone ? "invalid" : "valid"}`}
          placeholder=" "
          aria-invalid={validationErrors.phone ? "true" : "false"}
          aria-describedby={validationErrors.phone ? "phone-error" : undefined}
          onBlur={(e) => validateField("phone", e.target.value)}
        />
        {validationErrors.phone && (
          <span
            id="phone-error"
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            {validationErrors.phone}
          </span>
        )}
        <label htmlFor="floating_phone" className="">
          Phone number (123-456-7890)
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <textarea
          name="message"
          id="floating_message"
          className={`peer ${validationErrors.message ? "invalid" : "valid"}`}
          placeholder=" "
          required
          aria-invalid={validationErrors.message ? "true" : "false"}
          aria-describedby={
            validationErrors.message ? "message-error" : undefined
          }
          onBlur={(e) => validateField("message", e.target.value)}
        />
        {validationErrors.message && (
          <span
            id="message-error"
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            {validationErrors.message}
          </span>
        )}
        <label htmlFor="floating_message" className="">
          Message
        </label>
      </div>

      <Button
        className="bg-accent hover:bg-accent-700 text-accent-contrast"
        type="submit"
        onClick={() => setHasSubmittedOnce(true)}
      >
        <span className="icon w-6 h-6 inline-block mr-2  ">
          <Send />
        </span>
        {isSubmitting ? (
          <>
            <span className="sr-only">Sending message, please wait</span>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
