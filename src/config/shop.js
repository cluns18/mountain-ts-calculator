// Mountain T's - calculator shop config
// Duplicated from the Olive Branch Growth base calculator. Pricing logic + garment data
// are kept as-is; only branding, recipients, and theme tokens change here.
//
// Palette derived from the LIVE Shopify homepage (05cdqh-u6.myshopify.com), which is the
// source of truth per the calculator-build skill. Those tokens are Flagstaff-derived:
//   --color-bg #F2EDE0 (bone)  --color-text #15140F (basalt)
//   --color-accent #2F5233 (ponderosa green)  --color-ember #A34A22 (bark ember)
const SHOP_CONFIG = {
    // Matches the EXISTING registry file obg-mail-api/shops/mountaints.json, which the
    // mountain-ts-quote-request lead form already uses. One kit, so calculator quotes and
    // form leads arrive in the same branding. Do not create a second 'mountain-ts' entry.
    shop_id: 'mountaints',
    shop_name: "Mountain T's",
    shop_email: 'info@mountaints.com', // lead notifications land here
    shop_owner_email: 'info@mountaints.com', // owner copy (Tim + Sarah share this inbox)
    shop_phone: '928-913-0881',
    owner_name: 'Tim Hager',
    shop_address: '2 S Beaver St, Suite 141, Flagstaff, AZ 86001',

    accent_color: '#2F5233', // ponderosa green (primary)
    accent_deep: '#203A24',  // deep ponderosa (email headers)
    clay_color: '#A34A22',   // bark ember (CTA accent)
    bg_color: '#F2EDE0',     // bone (light theme)
    card_color: '#FFFFFF',
    ink_color: '#15140F',    // basalt
};

export default SHOP_CONFIG;
