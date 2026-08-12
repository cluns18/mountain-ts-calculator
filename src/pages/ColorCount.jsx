import React, { useState, useEffect } from 'react';
import NavBtn from '../components/NavBtn';

// The screen-print matrix is 10 columns wide, so 10 screens per location is
// the ceiling. A dark garment spends one of those on the white underbase. Past
// the ceiling we stop quoting screen print and point at DTF, which has no screen
// limit and needs no underbase.
const MAX_SCREENS = 10;

export default function ColorCount({ onNext, onPrevious, selectedLocations, selectedColor, setColorCounts }) {
    const needsUnderbase = Number(selectedColor?.underbase) === 1;
    const maxColors = needsUnderbase ? MAX_SCREENS - 1 : MAX_SCREENS;

    const [colorCounts, setLocalColorCounts] = useState({});

    useEffect(() => {
        const defaultCounts = {};
        selectedLocations.forEach(location => {
            if (!colorCounts[location]) defaultCounts[location] = 1;
        });
        if (Object.keys(defaultCounts).length > 0) setLocalColorCounts(prev => ({ ...prev, ...defaultCounts }));
    }, [selectedLocations]);

    const handleColorChange = (location, value) => {
        setLocalColorCounts((prev) => ({ ...prev, [location]: Math.min(Math.max(value, 1), maxColors) }));
    };

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>How Many Ink Colors?</h1>
                <p className='mt-1 text-sm bodyColor'>Each color requires a separate screen, which factors into pricing.</p>
            </div>
            <div className='slide-content'>
                <div>
                    <h2 className='text-xl font-semibold headingColor'>Colors Per Location</h2>
                    <p className='text-sm bodyColor mt-2 mb-4'>Let us know how many colors are in each design.</p>

                    {needsUnderbase && (
                        <div style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.22)', borderRadius: '8px', padding: '9px 12px', marginBottom: '12px' }}>
                            <p className='text-sm' style={{ margin: 0, lineHeight: 1.45 }}>
                                <strong>{selectedColor?.name}</strong> is a dark garment, so we lay down a white
                                underbase first to keep your colors bright. That base uses one screen, which
                                leaves you {maxColors} ink colors. Need more? Ask us about <strong>DTF</strong>,
                                it prints full color with no screen limit.
                            </p>
                        </div>
                    )}

                    {selectedLocations.map((location) => (
                        <div key={location} className='mt-4 text-left'>
                            <label className='text-lg font-semibold bodyColor'>{location}</label>
                            <div className='flex items-center gap-4 mt-2'>
                                <input
                                    type='number' min='1' max={maxColors}
                                    value={colorCounts[location] || 1}
                                    onChange={(e) => handleColorChange(location, parseInt(e.target.value) || 1)}
                                    className='w-20 p-2 border-b-2 text-center text-lg bg-transparent focus:outline-none'
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                />
                                <input type='range' min='1' max={maxColors} value={colorCounts[location] || 1}
                                    onChange={(e) => handleColorChange(location, parseInt(e.target.value))} className='w-full cursor-pointer' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <NavBtn onClick={() => { setColorCounts(colorCounts); onNext(); }}>Next &rarr;</NavBtn>
            </div>
        </>
    );
}
