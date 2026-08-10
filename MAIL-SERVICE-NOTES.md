# Email now routes through the central mail service

As of 2026-05-27 this base calculator no longer uses EmailJS. On submit, `FinalQuote.jsx`
POSTs one payload to the central OBG mail service (`obg-mail-api` on our Vercel), which sends
the customer auto-reply and the shop lead notification, branded per shop. See the
`calculator-build` skill and `~/Projects/obg-mail-api`.

- `src/config/shop.js` -> `shop_id` selects the brand kit in `obg-mail-api/shops/<id>.json`.
  Base default is `obg`. Duplicating this calc: change `shop_id` and add that shop's registry file.
- Endpoint override: `VITE_QUOTE_ENDPOINT` (default `https://obg-mail-api.vercel.app/api/send_quote`).
- The original EmailJS version is preserved on the `legacy-emailjs` branch.

## CUTOVER STATUS: DONE (2026-05-27)
The mail service is live (`https://obg-mail-api.vercel.app/api/send_quote`) and `shops/obg.json`
is registered, so this base's `shop_id: 'obg'` resolves. PR #19 merged to main and deployed to
Chris's Netlify (`obg-calculator.netlify.app`); a live test quote from the deployed page sent
both emails successfully. Nothing left to sequence here.
