import whiteOG105removebg from '/assets/OG105/BrightWhite-OG105-removebg.png';
import blacktop from '/assets/OG105/Blacktop-OG105.jpg';
import brightWhite from '/assets/OG105/BrightWhite-OG105.jpg';
import dieselGrey from '/assets/OG105/DieselGrey-OG105.jpg';
import electricBlue from '/assets/OG105/ElectricBlue-OG105.jpg';
import navy from '/assets/OG105/Navy-OG105.jpg';

const OG105 = {
    id: 'OG105',
    cost: 20,
    name: 'OGIO 105 Long Sleeve Polo',
    label: 'OGIO 105 - Caliber2.0 Long Sleeve Polo',
    stockImage: whiteOG105removebg,
    colors: [
        { name: 'Blacktop', image: blacktop, underbase: 1 },
        { name: 'Bright White', image: brightWhite, underbase: 0 },
        { name: 'Diesel Grey', image: dieselGrey, underbase: 1 },
        { name: 'Electric Blue', image: electricBlue, underbase: 1 },
        { name: 'Navy', image: navy, underbase: 1 },
    ],
};

export default OG105;