import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subjectLabels: Record<string, string> = {
      general: "General Inquiry",
      account: "Account Issue",
      device: "Device Information",
      rep: "Representative Inquiry",
      bug: "Bug Report",
      feature: "Feature Request",
    };

    const subjectLabel = subjectLabels[subject] || subject;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ReadyRep Support <support@medicalwysdom.ai>",
        to: ["customer_support@medicalwysdom.ai"],
        reply_to: email,
        subject: `[ReadyRep Support] ${subjectLabel} - from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #3B8EC4; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Support Ticket</h1>
            </div>
            <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Subject:</td>
                  <td style="padding: 8px 0; color: #111827;">${subjectLabel}</td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <h3 style="color: #374151; margin: 0 0 8px;">Message:</h3>
              <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
              Sent from ReadyRep Support Portal
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
