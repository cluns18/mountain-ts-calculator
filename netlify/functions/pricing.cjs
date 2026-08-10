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

const pricing = {
    screenPrintingMatrix: [
        { quantity: 50, prices: [1.89, 2.25, 2.70, 3.15, 3.60, 4.05, 4.50, 5.40, 6.30, 7.20] },
        { quantity: 100, prices: [1.80, 2.07, 2.34, 2.61, 2.88, 3.15, 3.42, 3.69, 4.14, 4.50] },
        { quantity: 200, prices: [1.62, 1.80, 1.98, 2.16, 2.52, 2.97, 3.24, 3.60, 3.96, 4.32] },
        { quantity: 500, prices: [1.35, 1.44, 1.53, 1.62, 1.71, 1.80, 1.89, 1.98, 2.07, 2.16] },
        { quantity: 2000, prices: [1.17, 1.35, 1.44, 1.53, 1.62, 1.71, 1.80, 1.89, 1.98, 2.07] },
        { quantity: 4000, prices: [0.90, 0.99, 1.08, 1.17, 1.26, 1.35, 1.44, 1.53, 1.62, 1.71] },
    ],
    embroideryMatrix: [
        { quantity: 12, price: 10 },
        { quantity: 18, price: 9.5 },
        { quantity: 24, price: 8 },
        { quantity: 36, price: 7.7 },
        { quantity: 50, price: 7.4 },
        { quantity: 72, price: 7 },
    ],
    fees: {
        screenFee: 18,
        embroiderySetupFee: 60,
    },
    formulas: {
        blankGarmentCost: (cost) => cost * 1.4,
        screenPrintingCost: (numColors, quantity, matrix) => {
            const entry = tierForQuantity(matrix, quantity);
            if (!entry) return 0;
            const index = Math.min(numColors - 1, entry.prices.length - 1);
            return entry.prices[index] || 0;
        },
        screenFees: (numColors) => numColors * 18,
        embroideryCost: (quantity, matrix) => {
            const entry = tierForQuantity(matrix, quantity);
            return entry ? entry.price : 0;
        },
        embroideryFees: (quantity, setupFee) => setupFee / quantity,
        stitchPrice: (stitchCount) => 6 + ((Math.max(stitchCount - 5000, 0) / 5000) * 1.50),
    },
};

module.exports = pricing;