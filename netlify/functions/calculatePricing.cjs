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

            // The ceiling is a PRESS constraint, so it is checked per location: the
            // press runs one location at a time and has a fixed number of stations.
            // A 6-colour front plus a 6-colour back is two runnable jobs, not an
            // unrunnable 12-station one.
            const overCeiling = screensPerLocation.some(
                (screens) => screens > pricing.maxScreens || screens < 1
            );

            if (overCeiling) {
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

            // Tim's sheet charges the first screen at the base rate and every other
            // screen at the additional rate, regardless of which side it lands on, so
            // the whole job prices off ONE total screen count rather than per location.
            const totalScreens = screensPerLocation.reduce((sum, count) => sum + count, 0);

            decorationCost = pricing.formulas.screenPrintingCost(
                totalScreens, quantity, pricing.screenPrintingMatrix
            );

            if (decorationCost === null) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        totalQuote: 0, pricePerItem: 0, exceedsScreens: true,
                        screensRequired: totalScreens, maxScreens: pricing.maxScreens,
                        needsUnderbase, recommendation: "dtf",
                    }),
                };
            }

            totalFees = pricing.formulas.screenFees(totalScreens, pricing.fees.screenFee) / quantity;
        }

        if (selectedProject === "embroidery") {
            const totalThreadCount = Object.values(locationThreadCounts).reduce((sum, count) => sum + count, 0);

            const baseEmbroideryPrice = pricing.formulas.embroideryCost(quantity, pricing.embroideryMatrix);

            // Overage past the included stitch count, priced per 1,000 at this
            // quantity band's own rate off Tim's sheet.
            const extraStitchCost = pricing.formulas.stitchPrice(
                totalThreadCount, quantity, pricing.embroideryMatrix, pricing.includedStitches
            );

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
