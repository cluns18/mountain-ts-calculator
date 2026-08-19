import React, { useEffect } from 'react';
import NavBtn from '../components/NavBtn';
import tshirtImage from '/assets/tshirtspgarment.png';
import longSleeveImage from '/assets/longsleevespgarment.png';
import hoodieImage from '/assets/hoodiespgarment.png';
import poloImage from '/assets/polospgarment.png';

const garmentOptions = [
    { id: 'sptshirt', name: 'T-Shirt', image: tshirtImage },
    { id: 'splongsleeve', name: 'Long Sleeve', image: longSleeveImage },
    { id: 'sphoodie', name: 'Hoodie', image: hoodieImage },
    { id: 'sppolo', name: 'Polo', image: poloImage },
];

export default function SPGarmentSelect({ onNext, onPrevious, selectedGarment, setSelectedGarment }) {
    useEffect(() => {
        if (!selectedGarment) setSelectedGarment(garmentOptions[0]);
    }, []);

    const displayImage = selectedGarment ? selectedGarment.image : garmentOptions[0].image;
    const displayAlt = selectedGarment ? selectedGarment.name : garmentOptions[0].name;

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>What Are We Printing On?</h1>
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
                                    selectedGarment && selectedGarment.name === garment.name ? 'btnColor' : 'btnInactive'
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
