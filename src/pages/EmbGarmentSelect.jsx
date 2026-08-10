import React, { useEffect } from 'react';
import NavBtn from '../components/NavBtn';
import sweatshirtImage from '/assets/sweatshirtembgarment.png';
import poloImage from '/assets/poloembgarment.png';
import hatImage from '/assets/hatembgarment.png';

const garmentOptions = [
    { id: 'embsweatshirt', name: 'Sweatshirt', image: sweatshirtImage },
    { id: 'embpolo', name: 'Polo', image: poloImage },
    { id: 'embhat', name: 'Hat', image: hatImage },
];

export default function EmbGarmentSelect({ onNext, onPrevious, selectedGarment, setSelectedGarment }) {
    useEffect(() => {
        if (!selectedGarment) setSelectedGarment(garmentOptions[0]);
    }, []);

    const displayImage = selectedGarment ? selectedGarment.image : garmentOptions[0].image;
    const displayAlt = selectedGarment ? selectedGarment.name : garmentOptions[0].name;

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>What Are We Embroidering?</h1>
                <p className='mt-1 text-sm bodyColor'>Choose your garment type and we'll show you the options.</p>
            </div>
            <div className='slide-content'>
                <div className='flex items-center gap-6 garment-layout'>
                    <div className='w-1/2 flex items-center justify-center garment-preview'>
                        <img src={displayImage} alt={displayAlt} className='garment-img' />
                    </div>
                    <div className='w-1/2 grid grid-cols-1 gap-3 garment-buttons'>
                        {garmentOptions.map((garment) => (
                            <button
                                key={garment.name}
                                className={`w-full py-3 px-5 rounded-lg cursor-pointer text-base font-semibold transition duration-300 ${
                                    selectedGarment && selectedGarment.id === garment.id ? 'btnColor' : 'btnInactive'
                                }`}
                                onClick={() => setSelectedGarment(garment)}
                            >
                                {garment.name}
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
