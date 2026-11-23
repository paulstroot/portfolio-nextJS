<?php
// Copy this file to mail-config.php (gitignored) and fill in real values.
// In production, deploy.yml should generate mail-config.php from GitHub secrets
// instead of committing it.

define('SMTP2GO_API_KEY', 'your-smtp2go-api-key-here');

// Where contact-form submissions get delivered. Set on the server only —
// mail.php must never trust a "to" address sent by the client.
define('CONTACT_TO_EMAIL', 'you@example.com');
define('CONTACT_TO_NAME', 'Your Name');

// The envelope "from" address mail.php sends as. This must be an address/domain
// verified with SMTP2GO (not an arbitrary address the visitor typed in) or
// SMTP2GO will reject or flag the send. The visitor's own email goes in
// Reply-To instead, so replying still reaches them.
define('CONTACT_FROM_EMAIL', 'noreply@yourdomain.com');
