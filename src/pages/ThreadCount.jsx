import React, { useEffect } from 'react';
import NavBtn from '../components/NavBtn';

export default function ThreadCount({ onNext, onPrevious, selectedLocations, locationThreadCounts, setLocationThreadCounts }) {
    useEffect(() => {
        const defaultCounts = {};
        selectedLocations.forEach(location => {
            if (!locationThreadCounts[location]) defaultCounts[location] = 6000;
        });
        if (Object.keys(defaultCounts).length > 0) setLocationThreadCounts(prev => ({ ...prev, ...defaultCounts }));
    }, [selectedLocations, setLocationThreadCounts, locationThreadCounts]);

    const handleThreadCountChange = (location, value) => {
        const newValue = Math.min(Math.max(value, 6000), 25000);
        if (locationThreadCounts[location] !== newValue) {
            setLocationThreadCounts((prev) => ({ ...prev, [location]: newValue }));
        }
    };

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>How Detailed Is Your Design?</h1>
                <p className='mt-1 text-sm bodyColor'>
                    Most small designs run 6,000 to 10,000 stitches. Larger or more detailed work goes up to 25,000. Your best estimate works.
                </p>
            </div>
            <div className='slide-content'>
                <div>
                    {selectedLocations.map((location) => (
                        <div key={location} className='mt-4 text-left'>
                            <label className='text-lg font-semibold headingColor'>{location}</label>
                            <div className='flex items-center gap-4 mt-2'>
                                <input
                                    type='number' min='6000' max='25000' step='1000'
                                    value={locationThreadCounts[location] || 6000}
                                    onChange={(e) => handleThreadCountChange(location, Number(e.target.value))}
                                    className='w-24 p-2 border-b-2 text-center text-lg bg-transparent focus:outline-none'
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                />
                                <input type='range' min='6000' max='25000' step='1000'
                                    value={locationThreadCounts[location] || 6000}
                                    onChange={(e) => handleThreadCountChange(location, Number(e.target.value))}
                                    className='w-full cursor-pointer' />
                                <span className='text-lg bodyColor whitespace-nowrap'>{(locationThreadCounts[location] || 6000).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <NavBtn onClick={onNext}>Next &rarr;</NavBtn>
            </div>
        </>
    );
}
