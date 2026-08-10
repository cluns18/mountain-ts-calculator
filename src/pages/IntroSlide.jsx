import React from 'react';
import NavBtn from '../components/NavBtn';

const MT_LOGO = 'https://cdn.shopify.com/s/files/1/0743/6907/3222/files/mountain-ts-logo.png?v=1786391679';

const IntroSlide = ({ selectedProject, setSelectedProject, onNext }) => {
    return (
        <>
            <div className='slide-header'>
                <img src={MT_LOGO} alt="Mountain T's" className='intro-logo' style={{ width: '150px', height: 'auto', margin: '0 auto 10px', display: 'block' }} />
                <h1 className='text-3xl font-bold headingColor'>Build Your Custom Order</h1>
                <p className='mt-1 text-sm bodyColor'>
                    A few quick steps and you get real pricing on the spot. No waiting on a callback.
                </p>
            </div>
            <div className='slide-content'>
                <div>
                    <h2 className='text-lg font-semibold headingColor mb-3 text-center'>What are we making?</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <button
                            className={`w-full py-3 px-5 rounded-xl cursor-pointer text-base font-semibold transition duration-300 ${
                                selectedProject === 'screenPrinting' ? 'btnColor' : 'btnInactive'
                            }`}
                            onClick={() => setSelectedProject('screenPrinting')}
                        >
                            Screen Printing
                        </button>
                        <button
                            className={`w-full py-3 px-5 rounded-xl cursor-pointer text-base font-semibold transition duration-300 ${
                                selectedProject === 'embroidery' ? 'btnColor' : 'btnInactive'
                            }`}
                            onClick={() => setSelectedProject('embroidery')}
                        >
                            Embroidery
                        </button>
                    </div>
                </div>
            </div>
            <div className='slide-nav nav-end'>
                <NavBtn onClick={onNext}>Next &rarr;</NavBtn>
            </div>
        </>
    );
};

export default IntroSlide;
