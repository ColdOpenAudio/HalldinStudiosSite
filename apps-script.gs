const RECIPIENT_EMAIL = 'inquiries@crisismgmt.net';

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return createJsonResponse({ success: false, error: 'No data received.' });
    }

    const name = (e.parameter.name || '').trim();
    const email = (e.parameter.email || '').trim();
    const message = (e.parameter.message || '').trim();
    const source = (e.parameter.source || '').trim();

    if (!name || !email || !message) {
      return createJsonResponse({ success: false, error: 'Missing required form fields.' });
    }

    const subject = `New inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
      '',
      source ? `Submitted from: ${source}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject,
      body,
    });

    return createJsonResponse({ success: true, message: 'Your message has been delivered. Thank you!' });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message || 'Unexpected error.' });
  }
}

function doGet() {
  return createJsonResponse({ status: 'ok' });
}

function createJsonResponse(payload) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
