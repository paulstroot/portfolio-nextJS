import { escapeHtml } from "@/app/utilities/sanitize"
import { NextResponse } from "next/server"
import SMTP2GOApi from "smtp2go-nodejs"

const apikey = process.env.SMTP2GO_API_KEY

// Validate email format
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email) && email.length <= 254 // RFC 5321 limit
}

// Validate and sanitize input
const validateContactInput = (data: {
	to?: { email?: string; name?: string }
	from?: { email?: string; name?: string }
	subject?: string
	text?: string
	html?: string
}) => {
	const errors: string[] = []

	// Validate 'to' field
	if (!data.to || typeof data.to !== "object") {
		errors.push("Missing or invalid 'to' field")
	} else {
		if (!data.to.email || typeof data.to.email !== "string") {
			errors.push("Missing or invalid 'to.email' field")
		} else if (!isValidEmail(data.to.email)) {
			errors.push("Invalid 'to.email' format")
		}
		// Name is optional but should be a string if provided
		if (data.to.name !== undefined && typeof data.to.name !== "string") {
			errors.push("Invalid 'to.name' field type")
		}
	}

	// Validate 'from' field
	if (!data.from || typeof data.from !== "object") {
		errors.push("Missing or invalid 'from' field")
	} else {
		if (!data.from.email || typeof data.from.email !== "string") {
			errors.push("Missing or invalid 'from.email' field")
		} else if (!isValidEmail(data.from.email)) {
			errors.push("Invalid 'from.email' format")
		}
	}

	// Validate 'subject' field
	if (!data.subject || typeof data.subject !== "string") {
		errors.push("Missing or invalid 'subject' field")
	} else if (data.subject.length > 255) {
		errors.push("Subject exceeds maximum length (255 characters)")
	}

	// Validate 'text' field
	if (!data.text || typeof data.text !== "string") {
		errors.push("Missing or invalid 'text' field")
	} else if (data.text.length > 100000) {
		// Reasonable limit for email body
		errors.push("Text body exceeds maximum length")
	}

	// HTML is optional but should be validated if provided
	if (data.html !== undefined) {
		if (typeof data.html !== "string") {
			errors.push("Invalid 'html' field type")
		} else if (data.html.length > 100000) {
			errors.push("HTML body exceeds maximum length")
		}
	}

	return { isValid: errors.length === 0, errors }
}

export async function POST(req: Request) {
	try {
		const body = await req.json()

		// Validate input
		const validation = validateContactInput(body)
		if (!validation.isValid) {
			return NextResponse.json(
				{ error: "Validation failed", details: validation.errors },
				{ status: 400 }
			)
		}

		if (!apikey) {
			return NextResponse.json(
				{ error: "Missing SMTP2GO_API_KEY environment variable" },
				{ status: 500 }
			)
		}

		// Sanitize and escape all text fields to prevent XSS
		const sanitizedTo = {
			email: body.to.email.trim().toLowerCase(), // Normalize email
			name: body.to.name ? escapeHtml(String(body.to.name).trim().substring(0, 100)) : undefined, // Limit name length and escape HTML
		}

		const sanitizedFrom = {
			email: body.from.email.trim().toLowerCase(), // Normalize email
		}

		const sanitizedSubject = escapeHtml(String(body.subject).trim().substring(0, 255))

		// Escape HTML in text body (already escaped on client, but escape again for security)
		const sanitizedText = escapeHtml(String(body.text).trim())

		// If HTML is provided, it should be sanitized with a proper HTML sanitizer
		// For now, we'll reject HTML emails or require proper sanitization
		// In production, consider using DOMPurify or similar
		let sanitizedHtml: string | undefined
		if (body.html) {
			// WARNING: HTML emails are a security risk if not properly sanitized
			// For now, we'll escape it as plain text to be safe
			// In production, use a proper HTML sanitizer like DOMPurify
			sanitizedHtml = escapeHtml(String(body.html).trim())
		}

		const api = SMTP2GOApi(apikey)

		const mailService = api
			.mail()
			.to(sanitizedTo.email)
			.from(sanitizedFrom.email)
			.subject(sanitizedSubject)
			.text(sanitizedText)

		// Only add HTML if it was provided and sanitized
		if (sanitizedHtml) {
			mailService.html(sanitizedHtml)
		}

		const result = await api.client().consume(mailService)

		return NextResponse.json({ ok: true, result }, { status: 200 })
	} catch (err: unknown) {
		console.error("/api/contact error:", err)
		// Don't expose internal error details to client
		return NextResponse.json(
			{ error: "Failed to send email. Please try again later." },
			{ status: 500 }
		)
	}
}
