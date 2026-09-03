// ─────────────────────────────────────────────────────────────────────────────
// Mountain T's pricing — Tim Hager's own 2026 rate sheet
//
// Source: "SILKSCREENING PRICE LIST 2026" (emailed 2026-09-01, image saved at
// ~/Projects/mountain-ts/reference/SILKSCREENING_PRICE_LIST_2026.jpg). This
// replaces the OBG stand-in matrix the calculator shipped with.
//
// TWO THINGS THE SHEET DOES NOT SAY, decided here and isolated as constants so
// they are one-line reversible. Both are flagged to Tim:
//
//  1. The multiplier column (1-11 x2.5 … over-575 x1.70) is EMBROIDERY ONLY.
//     Its bands match the embroidery table exactly, including "OVER 575", which
//     the screen table has no equivalent of. Checked numerically: embroidery
//     cost x multiplier lands within cents of the retail matrix this calculator
//     already used (4.50x2=9.00 vs 9.50; 4.00x1.95=7.80 vs 8.00). Applying it to
//     screen print instead gives $7.90/pc for one colour at 24 pieces, which is
//     roughly 4x the going rate, so it plainly is not meant for that table.
//     => Screen rates are used verbatim. Embroidery is cost x multiplier.
//
//  2. The sheet lists no setup or screen fee. We KEEP the existing $18/screen
//     and $60 embroidery setup rather than assume his rates are all-in, because
//     under-quoting costs Tim money and over-quoting only costs a lead. Impact
//     is bounded: +$0.75/pc at 24 pieces, +$0.13/pc at 144. Flip
//     RATES_INCLUDE_SETUP to true if Tim says the rates are all-in.
//
// The 1-23 screen band ($5.40 base / $1.65 addl) is deliberately NOT in the
// matrix. Mountain T's advertises and enforces a 24-piece screen-print minimum,
// and Tim asked on 2026-09-01 to stop courting sub-minimum work. Omitting the
// band makes quoting under 24 structurally impossible rather than merely
// discouraged.
// ─────────────────────────────────────────────────────────────────────────────

const RATES_INCLUDE_SETUP = false;

// Select the highest qty-threshold tier an order qualifies for (volume pricing).
// The matrix is ascending by `quantity`. The previous code used Array.find(),
// which returns the FIRST match and therefore always picked the smallest, most
// expensive tier (so volume discounts never applied, and orders below the
// smallest tier got $0). Walk from the top down; floor to the first tier.
const tierForQuantity = (matrix, quantity) => {
    for (let i = matrix.length - 1; i >= 0; i--) {
        if (quantity >= matrix[i].quantity) return matrix[i];
    }
    return matrix[0];
};

// A dark garment needs a white underbase laid down before the colour inks will
// read, and that base layer burns a real screen. The sheet prices by SCREEN
// count, not by how many colours the customer names, so a 3-colour design on
// black is a 4-screen job. Garment colours carry an `underbase` flag:
// 0 = light enough to print straight onto, 1 = needs the base layer.
const screensForLocation = (numColors, needsUnderbase) => numColors + (needsUnderbase ? 1 : 0);

// Physical press stations. The sheet has no colour ceiling (it just keeps
// charging the additional-colour rate), but a press does. Past this we withhold
// the quote and recommend DTF rather than price a job the shop cannot run.
const MAX_SCREENS_PER_LOCATION = 10;

const pricing = {
    // Tim's SCREEN COST table, used verbatim as the per-piece print charge.
    //   base = "1 COLOR 1 SIDE"
    //   addl = "EA. ADDITIONAL COLOR" (identical on his sheet to
    //          "EA. ADDITIONAL SIDE EA. COLOR", so one rate covers both)
    // His top band reads "289-575"; every other band is contiguous, so 289 is a
    // typo for 288 and is entered as 288 to avoid leaving 288 unpriced.
    // The sheet stops at 575. Orders above that fall through to this same tier,
    // which is his cheapest published rate, so a large job is never under-quoted.
    screenPrintingMatrix: [
        { quantity: 24,  base: 4.05, addl: 1.10 },
        { quantity: 48,  base: 3.25, addl: 1.00 },
        { quantity: 72,  base: 2.50, addl: 0.85 },
        { quantity: 144, base: 1.45, addl: 0.55 },
        { quantity: 288, base: 1.30, addl: 0.50 },
    ],

    // Tim's EMBROIDERY COST table x his multiplier column, resolved to retail.
    //   price      = "Base $ Per Unit" x multiplier
    //   perThousand = "Extra Stitches Per 1000" x multiplier
    // His 1-11 band is omitted: embroidery MOQ stays at 12, both because that is
    // the current behaviour and because he asked to de-emphasise very small runs.
    // "over 575" carries a multiplier (1.70) but no base, so the 288-575 base is
    // extended into it.
    embroideryMatrix: [
        { quantity: 12,  price: 9.00, perThousand: 1.50 },
        { quantity: 24,  price: 7.80, perThousand: 1.27 },
        { quantity: 48,  price: 6.75, perThousand: 1.05 },
        { quantity: 72,  price: 5.37, perThousand: 0.93 },
        { quantity: 144, price: 4.86, perThousand: 0.81 },
        { quantity: 288, price: 4.46, perThousand: 0.79 },
        { quantity: 576, price: 4.34, perThousand: 0.77 },
    ],

    fees: {
        screenFee: RATES_INCLUDE_SETUP ? 0 : 18,
        embroiderySetupFee: RATES_INCLUDE_SETUP ? 0 : 60,
    },

    // Stitch count the base per-unit rate is assumed to cover before the
    // per-1000 overage kicks in. The sheet does not state it; 5,000 is the
    // figure the calculator already used. Confirm with Tim.
    includedStitches: 5000,

    formulas: {
        blankGarmentCost: (cost) => cost * 1.4,

        // Tim prices the FIRST screen at the base rate and EVERY other screen at
        // the additional rate, whether that screen is another colour on the same
        // side or the first colour on a new side. So the charge is driven by the
        // total screen count across the whole job, not per location:
        //   base + (totalScreens - 1) x addl
        // The old code priced each location independently and summed, which
        // charged a second base rate for every extra location. On a 2-location,
        // 2-colour job at 24 pieces that was $10.30/pc against Tim's $7.35.
        screenPrintingCost: (totalScreens, quantity, matrix) => {
            const entry = tierForQuantity(matrix, quantity);
            if (!entry) return 0;
            if (totalScreens < 1) return null;
            return entry.base + (totalScreens - 1) * entry.addl;
        },

        screenFees: (totalScreens, screenFee) => totalScreens * screenFee,

        embroideryCost: (quantity, matrix) => {
            const entry = tierForQuantity(matrix, quantity);
            return entry ? entry.price : 0;
        },

        embroideryFees: (quantity, setupFee) => setupFee / quantity,

        // Overage on stitches past the included count, charged per 1,000 at the
        // band's own rate. Prorated rather than rounded up to a whole thousand.
        stitchPrice: (stitchCount, quantity, matrix, includedStitches) => {
            const entry = tierForQuantity(matrix, quantity);
            if (!entry) return 0;
            const over = Math.max(stitchCount - includedStitches, 0);
            return (over / 1000) * entry.perThousand;
        },
    },
};

pricing.screensForLocation = screensForLocation;
pricing.maxScreens = MAX_SCREENS_PER_LOCATION;
pricing.RATES_INCLUDE_SETUP = RATES_INCLUDE_SETUP;

module.exports = pricing;
