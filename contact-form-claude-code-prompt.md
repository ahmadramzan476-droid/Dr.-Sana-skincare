# Contact Form — Claude Code Prompt

Paste this prompt into Claude Code to add a professional contact form to the website.

---

## THE PROMPT

```
Add a professional contact form to my website's contact section. Here are the full requirements:

## FORM FIELDS

1. **Full Name** (required)
   - Text input
   - Placeholder: "Your Full Name"

2. **Phone Number** (required)
   - Tel input
   - Placeholder: "+92 3XX XXXXXXX"
   - Add basic Pakistan phone number validation (11 digits starting with 03, or with +92)

3. **Email Address** (optional)
   - Email input
   - Placeholder: "your@email.com"

4. **Service Interested In** (required)
   - Dropdown select with these options:
     - "Select a Service" (default/disabled)
     - General Consultation
     - Botox & Fillers
     - Laser Hair Removal
     - HydraFacial
     - RF Microneedling
     - Chemical Peel
     - PRP Hair Treatment
     - Exosome Therapy
     - HIFU Skin Tightening
     - Acne / Scar Treatment
     - Skin Brightening / Glow Drip
     - Thread Lift
     - Other

5. **Preferred Day** (optional)
   - Dropdown select with these options:
     - "Any Available Day" (default)
     - Monday
     - Tuesday
     - Wednesday
     - Thursday
     - Saturday

   Note: Do NOT include Friday or Sunday since the clinic is closed on those days.

6. **Preferred Time Slot** (optional)
   - Radio buttons or dropdown:
     - Morning (11:00 AM – 2:00 PM)
     - Evening (4:00 PM – 8:00 PM)
     - No Preference

7. **Message** (optional)
   - Textarea
   - Placeholder: "Tell us about your concern or any questions you have..."
   - Max 500 characters with character counter

## FORM BEHAVIOR

- **Submission method:** Use one of these approaches (pick whichever works with the existing tech stack):
  - Option A: EmailJS (client-side email sending, no backend needed)
  - Option B: Formspree (form endpoint service)
  - Option C: Web3Forms (free form API)
  - Option D: If the site already has a backend/API, use that

- **On submit:**
  - Show a loading spinner on the submit button
  - Disable the button to prevent double submission
  - On success: show a green success message — "Thank you! We've received your appointment request. Our team will contact you within 24 hours to confirm."
  - On error: show a red error message — "Something went wrong. Please try again or contact us directly at +92 318 5161027"
  - Clear the form after successful submission

- **Validation:**
  - Validate all required fields before submission
  - Show inline error messages below each invalid field (red text)
  - Highlight invalid fields with a red border
  - Don't submit until all required fields are valid
  - Phone number: accept formats like 03185161027, 0318-5161027, +923185161027, +92 318 5161027

## DESIGN REQUIREMENTS

- Match the existing website's design system (colors, fonts, border-radius, spacing)
- Do NOT use any AI slop patterns:
  - No gradient text on form labels
  - No glassmorphism on the form container (unless the site already uses it consistently)
  - No purple-blue gradients
  - No floating blobs or particles behind the form
  - No excessive animations or hover effects
  - No emoji as field icons
- Keep it clean, professional, and medical/clinical looking
- Use proper spacing between fields (16px minimum gap)
- Labels should be above the fields, not floating/inside
- Submit button should be full-width or at least prominent
- Make it fully responsive (mobile-first)

## LAYOUT

Place the contact form in the contact section with this layout:

**Desktop (side by side):**
```
[    Contact Form    ] | [  Clinic Info Card  ]
[                    ] | [  Address           ]
[                    ] | [  Phone / WhatsApp   ]
[                    ] | [  Timings            ]
[                    ] | [  Google Map Embed    ]
```

**Mobile (stacked):**
```
[    Contact Form    ]
[  Clinic Info Card  ]
[  Google Map Embed  ]
```

## CLINIC INFO CARD (beside the form)

Display this info next to the form:

**Aesthetic Evolution Skincare & Laser Clinic**

📍 2nd Floor, Plaza 13, Lane A, Sector F, DHA Phase 1, Rawalpindi

📞 +92 318 5161027 (make it a clickable tel: link)

💬 WhatsApp: +92 318 5161027 (link to: https://api.whatsapp.com/send?phone=+923185161027&text=Hi,%20I%20would%20like%20to%20book%20an%20appointment)

🕐 Clinic Hours:
- Mon – Thu: 11:00 AM – 2:00 PM & 4:00 PM – 8:00 PM
- Saturday: 1:00 PM – 8:00 PM
- Fri & Sun: Closed

## ACCESSIBILITY

- All inputs must have proper <label> elements (not just placeholder text)
- Use semantic HTML: <form>, <fieldset>, <legend> where appropriate
- Add aria-required="true" on required fields
- Add aria-invalid="true" on fields with errors
- Submit button should have clear text like "Request Appointment" not just "Submit"
- Tab order should flow naturally through the form
- Form should be keyboard-navigable

## SPAM PROTECTION

Add basic spam protection:
- Honeypot field (hidden field that bots fill but humans don't)
- Basic rate limiting (disable submit for 30 seconds after submission)
- Optional: Add a simple math captcha if bot spam is a concern (e.g., "What is 3 + 5?")

## AFTER IMPLEMENTATION

1. Show me all the files you created or modified
2. Tell me if I need to sign up for any service (EmailJS, Formspree, etc.) and what keys/IDs to add
3. Test the form validation by explaining what happens when I submit with empty required fields
4. Make sure the form doesn't break any existing page layout or styling
```
