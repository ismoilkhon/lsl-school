import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      // Fallback: Just log the data and return success for testing
      console.log('📧 Contact Form Submission (Resend not configured):', {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message received! (Email service not configured - check server logs)',
          note: 'To enable email sending, add RESEND_API_KEY to .env.local'
        },
        { status: 200 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'LSL School <onboarding@resend.dev>', // Use Resend's default verified domain
      to: ['12ghost28bi998@gmail.com'], // Use verified Resend email address
      subject: `Contact Form: ${subject || 'New Message from LSL School Website'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E40AF; border-bottom: 2px solid #1E40AF; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          </div>
          
          <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #1E40AF; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0369a1; font-size: 14px;">
              <strong>Sent from:</strong> LSL School Website Contact Form<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Handle specific domain verification errors
      const errorObj = error as any; // Type assertion for Resend error object
      if (errorObj.statusCode === 403 && errorObj.error?.includes('domain is not verified')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email service configuration issue. Please contact the administrator.',
            details: 'Domain verification required for email sending'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
