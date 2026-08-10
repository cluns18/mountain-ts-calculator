import React, { useState, useEffect } from 'react';
import NavBtn from '../components/NavBtn';
import tshirtGarments from '../garments/tshirts';
import longSleeveGarments from '../garments/longsleeves';
import hoodieGarments from '../garments/hoodies';
import poloGarments from '../garments/polos';
import hatGarments from '../garments/hats';

export default function ColorSelect({ onNext, onPrevious, selectedSPGarment, selectedEmbGarment, selectedColor, setSelectedColor }) {
    const garmentData = selectedSPGarment
        ? (tshirtGarments[selectedSPGarment.id] || longSleeveGarments[selectedSPGarment.id] || hoodieGarments[selectedSPGarment.id] || poloGarments[selectedSPGarment.id])
        : selectedEmbGarment
        ? (hoodieGarments[selectedEmbGarment.id] || poloGarments[selectedEmbGarment.id] || hatGarments[selectedEmbGarment.id])
        : null;

    if (!garmentData) {
        return <div className='headingColor text-center p-6'>No garment selected.</div>;
    }

    const [selectedImage, setSelectedImage] = useState(garmentData.colors[0]?.image);

    useEffect(() => {
        if (!selectedColor && garmentData.colors.length > 0) {
            setSelectedColor(garmentData.colors[0]);
            setSelectedImage(garmentData.colors[0].image);
        }
    }, []);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedImage(color.image);
    };

    return (
        <>
            <div className='slide-header' style={{ padding: '16px 24px 4px' }}>
                <h1 className='text-2xl font-bold headingColor'>Pick Your Color</h1>
                <p className='bodyColor' style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                    {selectedColor ? selectedColor.name : 'Tap a swatch to preview.'}
                </p>
            </div>
            <div className='slide-content' style={{ justifyContent: 'flex-start', gap: '8px', padding: '0 20px' }}>
                {/* Garment preview image */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <img
                        src={selectedImage}
                        alt={selectedColor?.name || 'Selected Color'}
                        className='color-img'
                        style={{ maxHeight: '200px', margin: '0 auto' }}
                    />
                </div>

                {/* Color swatch grid */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    gap: '5px',
                    padding: '4px 0',
                    overflowY: 'auto',
                    flex: '1 1 auto',
                    minHeight: 0,
                }}>
                    {garmentData.colors.map((color) => {
                        const isSelected = selectedColor?.name === color.name;
                        return (
                            <button
                                key={color.name}
                                onClick={() => handleColorSelect(color)}
                                title={color.name}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '50%',
                                    border: isSelected ? '3px solid #2F5233' : '2px solid rgba(21,20,15,0.18)',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    background: 'transparent',
                                    transition: 'all 0.15s ease',
                                    outline: isSelected ? '2px solid rgba(47,82,51,0.4)' : 'none',
                                    outlineOffset: '2px',
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={color.image}
                                    alt={color.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <NavBtn onClick={onNext}>Next &rarr;</NavBtn>
            </div>
        </>
    );
}
