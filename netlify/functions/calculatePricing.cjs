const pricing = require("./pricing.cjs");

exports.handler = async (event) => {
    try {
        const { selectedProject, selectedGarmentCost, quantity, locationColorCounts, locationThreadCounts, garmentUnderbase } = JSON.parse(event.body);

        if (!selectedProject || !quantity) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
        }

        const garmentCost = pricing.formulas.blankGarmentCost(selectedGarmentCost);

        let decorationCost = 0;
        let totalFees = 0;

        if (selectedProject === "screenPrinting") {
            // A dark garment needs a white underbase before the colour inks, and that
            // base layer is a real screen on EVERY location. The garment colour carries
            // the flag (0 = light). This used to be ignored entirely, which billed every
            // dark garment at the light-garment rate.
            const needsUnderbase = Number(garmentUnderbase) === 1;

            const numColorsPerLocation = Object.values(locationColorCounts);
            const screensPerLocation = numColorsPerLocation.map(
                (numColors) => pricing.screensForLocation(numColors, needsUnderbase)
            );

            // Price each location up front. A null means the matrix cannot price that
            // many screens, and it is the ONLY gate. Summing first would let a null
            // coerce to 0 and quietly hand back a cheap quote, which is the exact
            // failure this fix exists to kill.
            const perLocation = screensPerLocation.map(
                (screens) => pricing.formulas.screenPrintingCost(screens, quantity, pricing.screenPrintingMatrix)
            );

            if (perLocation.some((cost) => cost === null)) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        totalQuote: 0,
                        pricePerItem: 0,
                        exceedsScreens: true,
                        screensRequired: Math.max(...screensPerLocation, 0),
                        maxScreens: pricing.maxScreens,
                        needsUnderbase,
                        recommendation: "dtf",
                    }),
                };
            }

            const totalScreens = screensPerLocation.reduce((sum, count) => sum + count, 0);

            decorationCost = perLocation.reduce((total, cost) => total + cost, 0);

            totalFees = (totalScreens * pricing.fees.screenFee) / quantity;
        }

        if (selectedProject === "embroidery") {
            const totalThreadCount = Object.values(locationThreadCounts).reduce((sum, count) => sum + count, 0);

            const baseEmbroideryPrice = pricing.formulas.embroideryCost(quantity, pricing.embroideryMatrix);

            const extraStitchCost = totalThreadCount > 5000 ? pricing.formulas.stitchPrice(totalThreadCount) : 0;

            totalFees = pricing.formulas.embroideryFees(quantity, pricing.fees.embroiderySetupFee);

            decorationCost = baseEmbroideryPrice + extraStitchCost;
        }

        const pricePerItem = garmentCost + decorationCost + totalFees;
        const totalQuote = pricePerItem * quantity;

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                totalQuote,
                pricePerItem,
                exceedsScreens: false,
                needsUnderbase: selectedProject === "screenPrinting" && Number(garmentUnderbase) === 1,
            }),
        };

    } catch (error) {
        console.error("Error in calculatePricing:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
