import React, { useState, useEffect, useCallback } from 'react';
import NavBtn from '../components/NavBtn';
import calculateFinalQuote from '../utils/functions';
import { throttle } from 'lodash';
import SHOP_CONFIG from '../config/shop';

const GARMENT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const HAT_GARMENTS = ['embhat'];

export default function FinalQuote({
    onNext, onPrevious, selectedProject, selectedGarment,
    selectedSPGarment, selectedEmbGarment, selectedColor,
    selectedArtwork, artworkDescription, locationColorCounts,
    selectedSpecialInks, locationThreadCounts, selectedLocation, setFinalQuote
}) {
    const isHat = selectedGarment?.id && HAT_GARMENTS.includes(selectedGarment.id);
    const sizes = isHat ? null : GARMENT_SIZES;
    // MOQ must match the FLOOR OF THE PRICING MATRIX, not the shop's advertised minimum.
    // tierForQuantity() falls through to matrix[0] for anything below the smallest tier, so a
    // quantity under the floor silently gets quoted the floor's per-unit rate (under-quoting).
    // Screen print matrix floor = 50, embroidery matrix floor = 12 (netlify/functions/pricing.cjs).
    // Mountain T's advertises a 24-pc screen print minimum; the 24-49 band has no rate in this
    // matrix, so those orders route to the quote form instead of getting an invented price.
    const MOQ = selectedProject === 'screenPrinting' ? 50 : 12;
    const SHOP_MIN = selectedProject === 'screenPrinting' ? 24 : 12;

    const garmentLabel = selectedSPGarment?.label || selectedSPGarment?.name || selectedEmbGarment?.label || selectedEmbGarment?.name || selectedGarment?.name || '';
    const colorName = typeof selectedColor === 'object' && selectedColor !== null ? selectedColor.name : selectedColor || '';
    const locationList = selectedLocation?.length > 0 ? selectedLocation.join(', ') : '';

    const [sizeBreakdown, setSizeBreakdown] = useState(
        isHat ? null : Object.fromEntries(GARMENT_SIZES.map(s => [s, 0]))
    );
    const [quantity, setQuantity] = useState(MOQ);
    const [pricePerItem, setPricePerItem] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    // Backstop for a job needing more screens than the matrix prices. ColorCount
    // caps the picker so this should be unreachable from the UI, but the pricing
    // function is a public endpoint and a wrong number is worse than no number.
    const [exceedsScreens, setExceedsScreens] = useState(false);
    const [screenInfo, setScreenInfo] = useState({ screensRequired: 0, maxScreens: 0 });
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '' });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [pricingRevealed, setPricingRevealed] = useState(false);

    const handleSizeChange = (size, delta) => {
        const current = sizeBreakdown[size] || 0;
        const val = Math.max(0, current + delta);
        const updated = { ...sizeBreakdown, [size]: val };
        setSizeBreakdown(updated);
        const total = Object.values(updated).reduce((sum, v) => sum + v, 0);
        if (total > 0) setQuantity(total);
    };

    const fetchQuote = useCallback(throttle(async (qty) => {
        const quote = await calculateFinalQuote(
            selectedGarment, qty,
            { selectedProject, selectedSPGarment, selectedEmbGarment, selectedColor, locationColorCounts, selectedSpecialInks, locationThreadCounts }
        );

        setExceedsScreens(!!quote.exceedsScreens);
        if (quote.exceedsScreens) setScreenInfo({ screensRequired: quote.screensRequired, maxScreens: quote.maxScreens });
        // Re-bind so a withheld quote reads as 0 rather than throwing on undefined.
        const pricePerItem = Number(quote.pricePerItem) || 0;
        const totalQuote = Number(quote.totalQuote) || 0;
        setPricePerItem(parseFloat(pricePerItem.toFixed(2)));
        setTotalPrice(parseFloat(totalQuote.toFixed(2)));
        setFinalQuote({ pricePerItem: parseFloat(pricePerItem.toFixed(2)), totalPrice: parseFloat(totalQuote.toFixed(2)), quantity: qty });
    }, 200), [selectedProject, selectedGarment, selectedSPGarment, selectedEmbGarment, selectedColor, locationColorCounts, selectedSpecialInks, locationThreadCounts, setFinalQuote]);

    useEffect(() => { fetchQuote(quantity); }, [quantity, fetchQuote]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\d{10}$|^\d{3}-\d{3}-\d{4}$|^\(\d{3}\)\s\d{3}-\d{4}$|^\+\d{1,3}\d{7,14}$/.test(phone.replace(/\s/g, ''));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
    };

    useEffect(() => {
        const errors = {};
        if (formData.name.trim() === '') errors.name = 'Name is required';
        if (formData.email.trim() === '') errors.email = 'Email is required';
        else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
        if (formData.phone.trim() === '') errors.phone = 'Phone number is required';
        else if (!validatePhone(formData.phone)) errors.phone = 'Please enter a valid phone number';
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }, [formData]);

    const handleSubmit = async () => {
        if (!isFormValid) return;
        setIsSubmitting(true);

    const sizeBreakdownString = sizeBreakdown
        ? Object.entries(sizeBreakdown)
            .filter(([, qty]) => qty > 0)
            .map(([size, qty]) => `${size} × ${qty}`)
            .join('&nbsp;&nbsp;·&nbsp;&nbsp;')
        : 'N/A (hat)';

    // --- Format ink/thread details ---
    const inkDetails = selectedProject === 'screenPrinting'
        ? Object.entries(locationColorCounts)
            .map(([loc, count]) => `${loc}: ${count} color${count !== 1 ? 's' : ''}`)
            .join(', ') || 'Standard'
        : Object.entries(locationThreadCounts)
            .map(([loc, count]) => `${loc}: ${count} thread${count !== 1 ? 's' : ''}`)
            .join(', ') || 'Standard';

    // --- Artwork status ---
    const artworkUploaded = selectedArtwork && !selectedArtwork.startsWith('pending:');
    const pendingFilename = selectedArtwork && selectedArtwork.startsWith('pending:')
        ? selectedArtwork.slice('pending:'.length)
        : null;

    // --- One payload -> central OBG mail service (obg-mail-api on Vercel) ---
    // shop_id selects this shop's brand kit (colors, logo, recipients, copy) from the mail
    // service registry. No EmailJS, no secrets in this front end. Override URL via env.
    const payload = {
        shop_id: SHOP_CONFIG.shop_id,
        customer: { name: formData.name, email: formData.email, company: formData.company || 'N/A', phone: formData.phone },
        quote: {
            project: selectedProject === 'screenPrinting' ? 'Screen Printing' : 'Embroidery',
            garment_name: garmentLabel,
            color: colorName,
            locations: locationList || 'None',
            ink_details: inkDetails,
            special_inks: selectedSpecialInks.length > 0 ? selectedSpecialInks.join(', ') : 'None',
            size_breakdown: sizeBreakdownString,
            quantity,
            price_per_item: pricePerItem.toFixed(2),
            total_price: totalPrice.toFixed(2),
            artwork_status: artworkUploaded
                ? `Uploaded: ${selectedArtwork}`
                : pendingFilename ? `Upload incomplete: ${pendingFilename}` : 'No file uploaded',
            artwork_description: artworkDescription || 'No description provided',
        },
    };

    try {
        const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT || 'https://obg-mail-api.vercel.app/api/send_quote';
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Send failed (${res.status})`);

        window.parent.postMessage(
            { event: 'calculator_submission', totalQuote: totalPrice.toFixed(2), pricePerItem: pricePerItem.toFixed(2), quantity },
            '*'
        );
        onNext();
    } catch (error) {
        console.error('Quote submission failed:', error);
        alert('Error submitting project. Please try again.');
    }

        setIsSubmitting(false);
    };

    const belowMOQ = quantity < MOQ;

    return (
        <>
            <div className='slide-header' style={{ padding: '8px 24px 2px' }}>
                <h1 className='text-2xl font-bold headingColor' style={{ marginBottom: '1px', fontSize: '1.15rem' }}>Finalize your order</h1>
                <p className='bodyColor' style={{ fontSize: '0.7rem', color: '#3A342A' }}>
                    {garmentLabel}{colorName ? ` - ${colorName}` : ''}
                </p>
            </div>
            <div className='slide-content final-quote-content'>
                {/* Running counter pill + MOQ */}
                <div className='text-center mb-1'>
                    <div className='counter-pill' style={{
                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(47,82,51,0.15)', border: '1px solid rgba(47,82,51,0.3)',
                        borderRadius: '999px', padding: '5px 16px',
                    }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#15140F', fontWeight: 600 }}>{quantity} Items</span>
                        <span style={{ width: '1px', height: '12px', background: 'rgba(21,20,15,0.18)' }}></span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.8rem', color: '#2F5233', fontWeight: 700 }}>${pricePerItem.toFixed(2)}/ea</span>
                    </div>
                    {belowMOQ && (
                        <p style={{ color: '#A34A22', fontSize: '0.7rem', fontFamily: "'DM Sans', sans-serif", marginTop: '4px', lineHeight: 1.45 }}>
                            Instant pricing starts at {MOQ} pieces.
                            {SHOP_MIN < MOQ && (
                                <> Our shop minimum is {SHOP_MIN} for screen printing, so for {SHOP_MIN}-{MOQ - 1} pieces give us a call at 928-913-0881 and we will price it for you.</>
                            )}
                        </p>
                    )}
                </div>

                {/* Size selectors */}
                {sizes ? (
                    <div style={{ marginBottom: '10px', display: pricingRevealed ? 'none' : 'block' }}>
                        <div className='size-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                            {sizes.map((size) => {
                                const qty = sizeBreakdown[size] || 0;
                                const isActive = qty > 0;
                                return (
                                    <div key={size} className='text-center size-cell' style={{
                                        background: isActive ? 'rgba(21,20,15,0.08)' : 'rgba(21,20,15,0.03)',
                                        borderRadius: '6px', padding: '6px 2px 4px',
                                        border: isActive ? '2px solid #2F5233' : '2px solid rgba(21,20,15,0.12)',
                                        transition: 'all 0.2s ease',
                                    }}>
                                        <div className='size-label' style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.6rem', color: '#15140F', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{size}</div>
                                        <div className='flex items-center justify-center gap-0.5'>
                                            <button className='size-btn' onClick={() => handleSizeChange(size, -1)} style={{ width: '16px', height: '16px', borderRadius: '3px', border: '1px solid rgba(21,20,15,0.18)', background: 'rgba(21,20,15,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#15140F', padding: 0, lineHeight: 1 }}>-</button>
                                            <input className='size-input' type='number' style={{ width: '38px', textAlign: 'center', border: '1px solid rgba(21,20,15,0.18)', borderRadius: '3px', padding: '1px 2px', fontSize: '0.7rem', fontFamily: "'Poppins', sans-serif", fontWeight: 700, background: 'rgba(21,20,15,0.04)', color: '#15140F' }} value={qty} onChange={(e) => { const v = parseInt(e.target.value) || 0; setSizeBreakdown(prev => { const u = { ...prev, [size]: Math.max(0, v) }; const t = Object.values(u).reduce((s, x) => s + x, 0); if (t > 0) setQuantity(t); return u; }); }} min='0' max='1000' />
                                            <button className='size-btn' onClick={() => handleSizeChange(size, 1)} style={{ width: '16px', height: '16px', borderRadius: '3px', border: '1px solid rgba(47,82,51,0.3)', background: 'rgba(47,82,51,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#15140F', padding: 0, lineHeight: 1 }}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='mb-4 text-center'>
                        <label className='text-lg font-semibold headingColor block mb-3'>Quantity</label>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '6px',
                                    background: 'rgba(21,20,15,0.04)', border: '1px solid rgba(21,20,15,0.14)',
                                    color: '#15140F', cursor: 'pointer', fontSize: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >-</button>
                            <span className='headingColor text-2xl font-bold' style={{ minWidth: '48px', textAlign: 'center' }}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(5000, quantity + 1))}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '6px',
                                    background: 'rgba(47,82,51,0.25)', border: '1px solid rgba(47,82,51,0.3)',
                                    color: '#15140F', cursor: 'pointer', fontSize: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >+</button>
                        </div>
                    </div>
                )}

                {/* Light contrast breakdown card */}
                {!pricingRevealed ? (
                    <div className='light-card' style={{
                        background: '#F2EDE0', borderRadius: '10px', padding: '10px 12px', textAlign: 'center',
                    }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2F5233', marginBottom: '2px' }}>Almost There</p>
                        <h3 style={{ color: '#15140F', fontSize: '0.9rem', fontWeight: '700', fontFamily: "'Poppins', sans-serif", marginBottom: '2px' }}>
                            See Your Full Breakdown
                        </h3>
                        <p style={{ color: '#57503F', fontSize: '0.65rem', fontFamily: "'DM Sans', sans-serif", marginBottom: '8px', lineHeight: 1.35 }}>
                            Drop your info to see the full size-by-size breakdown and total.
                        </p>

                        <div className='form-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '6px' }}>
                            <input type='text' name='name' placeholder='Your Name *' value={formData.name} onChange={handleChange} style={inputStyle} />
                            <input type='text' name='company' placeholder='Company (optional)' value={formData.company} onChange={handleChange} style={inputStyle} />
                            <input type='email' name='email' placeholder='Your Best Email *' value={formData.email} onChange={handleChange} style={inputStyle} />
                            <input type='tel' name='phone' placeholder='Phone Number *' value={formData.phone} onChange={handleChange} style={inputStyle} />
                        </div>

                        <button
                            onClick={() => { if (isFormValid && !belowMOQ) setPricingRevealed(true); }}
                            style={{
                                background: isFormValid && !belowMOQ ? '#2F5233' : '#6B6455',
                                color: '#FFFFFF', border: 'none', borderRadius: '999px',
                                padding: '7px 22px', fontSize: '0.72rem', fontWeight: '600',
                                fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
                                cursor: isFormValid && !belowMOQ ? 'pointer' : 'not-allowed',
                                transition: 'all 0.25s ease',
                                opacity: isFormValid && !belowMOQ ? 1 : 0.5,
                            }}
                            onMouseEnter={(e) => { if (isFormValid && !belowMOQ) { e.target.style.background = '#203A24'; e.target.style.transform = 'translateY(-1px)'; } }}
                            onMouseLeave={(e) => { e.target.style.background = '#2F5233'; e.target.style.transform = 'translateY(0)'; }}
                        >
                            See Your Full Breakdown
                        </button>
                    </div>
                ) : (
                    <div className='light-card' style={{ background: '#F2EDE0', borderRadius: '10px', padding: '14px', animation: 'fadeIn 0.4s ease' }}>
                        {/* Price highlights */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <div className='text-center'>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#57503F', marginBottom: '1px' }}>Per Item</div>
                                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#15140F' }}>${pricePerItem.toFixed(2)}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(21,20,15,0.1)', alignSelf: 'stretch' }} />
                            <div className='text-center'>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#57503F', marginBottom: '1px' }}>Total Quote</div>
                                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#2F5233' }}>${totalPrice.toFixed(2)}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(21,20,15,0.1)', alignSelf: 'stretch' }} />
                            <div className='text-center'>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#57503F', marginBottom: '1px' }}>Total Items</div>
                                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#15140F' }}>{quantity}</div>
                            </div>
                        </div>

                        {/* Breakdown table with inline +/- */}
                        {sizes && sizeBreakdown && (
                            <div style={{ marginBottom: '8px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(21,20,15,0.1)' }}>
                                            <th style={{ padding: '3px 0', textAlign: 'left', color: '#57503F', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Size</th>
                                            <th style={{ padding: '3px 0', textAlign: 'center', color: '#57503F', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Qty</th>
                                            <th style={{ padding: '3px 0', textAlign: 'right', color: '#57503F', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizes.map(size => {
                                            const qty = sizeBreakdown[size] || 0;
                                            return (
                                                <tr key={size} style={{ borderBottom: '1px solid rgba(21,20,15,0.06)' }}>
                                                    <td style={{ padding: '4px 0', color: '#15140F', fontWeight: 500 }}>{size}</td>
                                                    <td style={{ padding: '4px 0', textAlign: 'center' }}>
                                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <button onClick={() => handleSizeChange(size, -1)} style={{ width: '18px', height: '18px', borderRadius: '3px', border: '1px solid rgba(21,20,15,0.15)', background: 'rgba(21,20,15,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#15140F', padding: 0, lineHeight: 1 }}>-</button>
                                                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, color: qty > 0 ? '#15140F' : '#57503F' }}>{qty}</span>
                                                            <button onClick={() => handleSizeChange(size, 1)} style={{ width: '18px', height: '18px', borderRadius: '3px', border: '1px solid rgba(47,82,51,0.3)', background: 'rgba(47,82,51,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: '#2F5233', padding: 0, lineHeight: 1 }}>+</button>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '4px 0', textAlign: 'right', color: qty > 0 ? '#15140F' : '#57503F', fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>${(qty * pricePerItem).toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: '#57503F', textAlign: 'center', lineHeight: 1.4, marginBottom: '8px' }}>
                            Local pickup price. Submit to inquire about shipping. Estimate may vary slightly on final approval.
                        </p>

                        <div className='text-center'>
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting || belowMOQ}
                                style={{
                                    background: (isFormValid && !belowMOQ) ? '#2F5233' : '#6B6455',
                                    color: '#FFFFFF', border: 'none', padding: '8px 28px', borderRadius: '999px',
                                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                    cursor: (isFormValid && !belowMOQ) ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.25s ease',
                                    opacity: (isFormValid && !belowMOQ) ? 1 : 0.5,
                                }}
                                onMouseEnter={(e) => { if (isFormValid && !belowMOQ) { e.target.style.background = '#203A24'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(47,82,51,0.3)'; } }}
                                onMouseLeave={(e) => { e.target.style.background = '#2F5233'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                            >
                                {isSubmitting ? 'Sending...' : 'Save & Send to Me'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <div></div>
            </div>
        </>
    );
}

const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '1px solid rgba(21,20,15,0.2)',
    borderRadius: '6px',
    padding: '6px 9px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 400,
    color: '#15140F',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};
