# Email Setup Guide for Contact Form

## Overview
The contact form sends emails to `ismoilkhon.bakhromov@mail.ru` using Gmail SMTP.

## Environment Variables Setup

Add the following variables to your `.env.local` file:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "LSL School Contact Form"
   - Copy the generated 16-character password

3. **Use the App Password**:
   - Set `EMAIL_USER` to your Gmail address
   - Set `EMAIL_PASS` to the generated app password

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords, not your main Gmail password
- The app password is specific to this application

## Testing

1. Fill out the contact form on the website
2. Submit the form
3. Check `ismoilkhon.bakhromov@mail.ru` for the email
4. Verify all form data is included in the email

## Email Template

The email includes:
- Contact information (name, email, phone, subject)
- Message content
- Timestamp and source information
- Professional HTML formatting

## Troubleshooting

If emails are not sending:
1. Check environment variables are set correctly
2. Verify Gmail app password is valid
3. Check server logs for error messages
4. Ensure Gmail account has SMTP access enabled
