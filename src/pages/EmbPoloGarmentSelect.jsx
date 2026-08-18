import React, { useEffect } from 'react';
import NavBtn from '../components/NavBtn';
import poloGarments from '../garments/polos';

const garmentOptions = Object.values(poloGarments);

export default function EmbPoloGarmentSelect({ onNext, onPrevious, selectedEmbGarment, setSelectedEmbGarment }) {
    useEffect(() => {
        if (!selectedEmbGarment) setSelectedEmbGarment(garmentOptions[0]);
    }, []);

    const displayImage = selectedEmbGarment ? selectedEmbGarment.stockImage : garmentOptions[0].stockImage;
    const displayAlt = selectedEmbGarment ? selectedEmbGarment.name : garmentOptions[0].name;

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>Pick your polo</h1>
                <p className='mt-1 text-sm bodyColor'>Different weights, fits, and price points. Choose the one that works best.</p>
            </div>
            <div className='slide-content'>
                <div className='flex items-center gap-6 garment-layout'>
                    <div className='w-1/2 flex items-center justify-center garment-preview'>
                        <img src={displayImage} alt={displayAlt} className='garment-img' />
                    </div>
                    <div className='w-1/2 grid grid-cols-1 gap-2 garment-buttons'>
                        {garmentOptions.map((g) => (
                            <button
                                key={g.id}
                                className={`w-full py-3 px-5 rounded-lg cursor-pointer text-sm font-semibold transition duration-300 ${
                                    selectedEmbGarment && selectedEmbGarment.id === g.id ? 'btnColor' : 'btnInactive'
                                }`}
                                onClick={() => setSelectedEmbGarment(g)}
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
