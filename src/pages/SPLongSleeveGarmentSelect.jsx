import React, { useEffect } from 'react';
import NavBtn from '../components/NavBtn';
import longSleeveGarments from '../garments/longsleeves';

const sPGarmentOptions = Object.values(longSleeveGarments);

export default function SPLongSleeveGarmentSelect({ onNext, onPrevious, selectedSPGarment, setSelectedSPGarment }) {
    useEffect(() => {
        if (!selectedSPGarment) setSelectedSPGarment(sPGarmentOptions[0]);
    }, []);

    const displayImage = selectedSPGarment ? selectedSPGarment.stockImage : sPGarmentOptions[0].stockImage;
    const displayAlt = selectedSPGarment ? selectedSPGarment.name : sPGarmentOptions[0].name;

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>Pick your long sleeve</h1>
                <p className='mt-1 text-sm bodyColor'>Different weights, fits, and price points. Choose the one that works best.</p>
            </div>
            <div className='slide-content'>
                <div className='flex items-center gap-6 garment-layout'>
                    <div className='w-1/2 flex items-center justify-center garment-preview'>
                        <img src={displayImage} alt={displayAlt} className='garment-img' />
                    </div>
                    <div className='w-1/2 grid grid-cols-1 gap-2 garment-buttons'>
                        {sPGarmentOptions.map((g) => (
                            <button
                                key={g.id}
                                className={`w-full py-3 px-5 rounded-lg cursor-pointer text-sm font-semibold transition duration-300 ${
                                    selectedSPGarment && selectedSPGarment.id === g.id ? 'btnColor' : 'btnInactive'
                                }`}
                                onClick={() => setSelectedSPGarment(g)}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <NavBtn onClick={() => onNext()}>Next &rarr;</NavBtn>
            </div>
        </>
    );
}
