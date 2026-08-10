import React, { useState } from 'react';
import NavBtn from '../components/NavBtn';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export default function ArtworkSelect({ onNext, onPrevious, setUploadedImage, setArtworkDescription }) {
    const [imageFile, setImageFile] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImageFile(file);
        setUploadedImage(`pending:${file.name}`);

        // Unique path per upload so two customers with the same filename never collide or overwrite.
        const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
        const uniquePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const storageRef = ref(storage, uniquePath);
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setUploadedImage(downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <>
            <div className='slide-header'>
                <h1 className='text-3xl font-bold headingColor'>Add Your Artwork</h1>
                <p className='mt-1 text-sm bodyColor'>
                    Upload a file or describe what you have in mind. We can work with either.
                </p>
            </div>
            <div className='slide-content'>
                <div className='text-left space-y-4'>
                    <div>
                        <label className='block text-base font-semibold headingColor mb-2'>Upload Design File</label>
                        <p className='text-xs bodyColor mb-2'>Supported formats: JPG, PNG, PDF, AI, EPS, SVG</p>
                        <input
                            type='file'
                            accept='image/*,.pdf,.ai,.eps,.svg'
                            onChange={handleFileUpload}
                            className='w-full text-sm'
                        />
                        {imageFile && (
                            <p className='text-xs bodyColor mt-2'>
                                <span className='font-semibold'>Uploaded:</span> {imageFile.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='block text-base font-semibold headingColor mb-2'>Or Describe Your Design</label>
                        <p className='text-xs bodyColor mb-2'>Tell us about your design, colors, and layout.</p>
                        <textarea
                            placeholder='Describe your design in detail...'
                            onChange={(e) => setArtworkDescription(e.target.value)}
                            className='w-full p-3 border-2 rounded-lg h-24 resize-none transition text-sm'
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </div>
                </div>
            </div>
            <div className='slide-nav'>
                <NavBtn onClick={onPrevious} direction='prev'>&larr; Prev</NavBtn>
                <NavBtn onClick={onNext}>Next &rarr;</NavBtn>
            </div>
        </>
    );
}
