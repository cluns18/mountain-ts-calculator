const calculateFinalQuote = async (selectedGarment, quantity, { 
    selectedProject,
    selectedColor,
    selectedSPGarment, 
    selectedEmbGarment, 
    locationColorCounts, 
    locationThreadCounts 
}) => {
    if (!selectedGarment || !quantity) return { totalQuote: 0, pricePerItem: 0, exceedsScreens: false };

    const response = await fetch('/.netlify/functions/calculatePricing', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            selectedProject,
            selectedGarmentCost: selectedSPGarment?.cost || selectedEmbGarment?.cost || 0,
            quantity,
            locationColorCounts,
            locationThreadCounts,
            // Garment shade drives the white underbase, which costs a screen.
            // 0 = light. Hat colours carry no flag but hats are embroidery only,
            // so they never reach the screen-print branch.
            garmentUnderbase: selectedColor?.underbase ?? 0
        })
    });

    const { totalQuote, pricePerItem, exceedsScreens, screensRequired, maxScreens } = await response.json();
    return { totalQuote, pricePerItem, exceedsScreens: !!exceedsScreens, screensRequired, maxScreens };
};

export default calculateFinalQuote;