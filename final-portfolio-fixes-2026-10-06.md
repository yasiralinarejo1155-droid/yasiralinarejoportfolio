# Final portfolio fixes

## What will change
- Remove the mouse-following ring and dot while keeping restrained button and card feedback.
- Add a visible Feedback destination to desktop navigation, the mobile menu, contact area, and footer.
- Refine the existing feedback area with the requested heading, six clearly labeled project-highlight cards when no approved reviews exist, and an accessible approved-review carousel with auto-slide, pause, arrows, dots, and swipe.
- Add both KIU research projects to the central portfolio data, group them under “Featured AI & Research Projects,” and use truthful captures of their live sites when available.
- Add a compact “Yasir AI Assistant” launcher and responsive chat panel. Its deterministic answers will be generated from the same portfolio data used by the site, with working actions for services, projects, contact, and feedback.
- Preserve the existing sections, visual system, contact details, and project list.

## Feedback delivery
- Keep strict validation in both the form and server function, spam checks, pending moderation, and public reads limited to approved reviews.
- Save every accepted review before attempting email delivery.
- Connect the fixed feedback template to Lovable’s managed app-email service once a sender domain is configured. The project currently has no email domain, so email delivery cannot be truthfully enabled until that setup is completed; the form will clearly distinguish saved feedback from emailed feedback.

## Verification
- Check the full desktop and mobile flows: navigation, all feedback buttons, review submission states, approved/highlight carousel controls and swipe behavior, KIU links and cards, chatbot answers/actions, and absence of the custom cursor.
- Confirm the current build and security checks remain healthy.
