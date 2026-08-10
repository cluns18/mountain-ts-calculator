const calculateFinalQuote = async (selectedGarment, quantity, { 
    selectedProject, 
    selectedSPGarment, 
    selectedEmbGarment, 
    locationColorCounts, 
    locationThreadCounts 
}) => {
    if (!selectedGarment || !quantity) return { totalQuote: 0, pricePerItem: 0 };

    const response = await fetch('/.netlify/functions/calculatePricing', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            selectedProject,
            selectedGarmentCost: selectedSPGarment?.cost || selectedEmbGarment?.cost || 0,
            quantity,
            locationColorCounts,
            locationThreadCounts
        })
    });

    const { totalQuote, pricePerItem } = await response.json();
    return { totalQuote, pricePerItem };
};

export default calculateFinalQuote;