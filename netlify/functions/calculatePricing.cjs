const pricing = require("./pricing.cjs");

exports.handler = async (event) => {
    try {
        const { selectedProject, selectedGarmentCost, quantity, locationColorCounts, locationThreadCounts } = JSON.parse(event.body);

        if (!selectedProject || !quantity) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
        }

        const garmentCost = pricing.formulas.blankGarmentCost(selectedGarmentCost);

        let decorationCost = 0;
        let totalFees = 0;

        if (selectedProject === "screenPrinting") {
            const numColorsPerLocation = Object.values(locationColorCounts);
            const totalScreens = numColorsPerLocation.reduce((sum, count) => sum + count, 0);

            decorationCost = numColorsPerLocation.reduce((total, numColors) => {
                return total + pricing.formulas.screenPrintingCost(numColors, quantity, pricing.screenPrintingMatrix);
            }, 0);

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
            body: JSON.stringify({ totalQuote, pricePerItem }),
        };

    } catch (error) {
        console.error("Error in calculatePricing:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
