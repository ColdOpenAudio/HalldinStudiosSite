Halldin Studios - Consulting & Music Production Website
------------------------------------------------------

This repository hosts a static marketing site for CrisisMgmt. The contact form integrates with
Google Apps Script so inquiries send email to the team without running your own backend.

## Project Structure

- `index.html` – Marketing page markup and client-side enhancements (contact form handling, copy-to-clipboard helper).
- `style.css` – Styling for the landing page.
- `apps-script.gs` – Sample Google Apps Script to relay form submissions to email.

## Connecting the Contact Form to Email

1. **Create the Apps Script project**
   - Visit [script.google.com](https://script.google.com) and create a new project.
   - Replace the default code with the contents of `apps-script.gs`.
   - Update the `RECIPIENT_EMAIL` constant with the inbox that should receive submissions (e.g., `inquiries@crisismgmt.net`).

2. **Deploy the Web App**
   - In Apps Script, choose <kbd>Deploy</kbd> → <kbd>New deployment</kbd>.
   - Select **Web app**, set **Execute as** to *Me*, and **Who has access** to *Anyone*.
   - Deploy and copy the generated Web App URL.

3. **Wire the frontend to the Web App**
   - In `index.html`, locate the `<form class="contact-form">` element near the Contact section.
   - Replace the placeholder value in the `data-endpoint` attribute with the Web App URL from the previous step.
   - Publish the updated site—no additional hosting configuration is required because the form posts directly to Google.

4. **Test the integration**
   - Submit the form from the published site.
   - Confirm that a success message appears on-page and that the email arrives in your inbox.

## Additional Notes

- The contact script falls back to a friendly error if the endpoint is missing or returns an error.
- Visitors can copy the direct email address using the provided “Copy” button if they prefer traditional email.
- Host the static assets (`index.html`, `style.css`, and any media) on any static hosting provider such as GitHub Pages, Netlify, or Cloudflare Pages.
