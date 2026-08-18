import React from 'react';

const MT_LOGO = 'https://cdn.shopify.com/s/files/1/0743/6907/3222/files/mountain-ts-logo.png?v=1786391679';

export default function ThankYou() {
    return (
        <>
            <div className='slide-header'>
                <img src={MT_LOGO} alt="Mountain T's" style={{ width: '120px', height: 'auto', margin: '0 auto 10px', display: 'block' }} />
                <h1 className='text-3xl font-bold headingColor'>You're all set</h1>
                <p className='mt-1 text-sm bodyColor'>
                    We've got everything we need. Your quote details are on the way to your inbox.
                </p>
            </div>
            <div className='slide-content'>
                <div className='p-6 rounded-lg' style={{ background: 'rgba(21,20,15,0.04)', border: '1px solid rgba(21,20,15,0.08)' }}>
                    <p className='text-base bodyColor mb-4'>
                        We'll be in touch soon to confirm the details and get things rolling.
                    </p>
                    <p className='text-base headingColor font-semibold'>
                        Questions? Reach out anytime:
                    </p>
                    <p className='mt-2 text-lg'>
                        <a href='mailto:hello@olivebranchgrowth.com' className='headingColor hover:opacity-80 transition font-semibold underline'>
                            hello@olivebranchgrowth.com
                        </a>
                    </p>
                </div>
                <p className='mt-6 text-sm bodyColor text-center'>
                    Keep an eye on your email for your full quote breakdown.
                </p>
            </div>
            <div className='slide-nav nav-end'>
            </div>
        </>
    );
}
