import whiteLOG101removebg from '/assets/LOG101/BrightWhite-LOG101-removebg.png';
import black from '/assets/LOG101/Black-LOG101.jpeg';
import blueMist from '/assets/LOG101/BlueMist-LOG101.jpeg';
import brightWhite from '/assets/LOG101/BrightWhite-LOG101.jpeg';
import dieselGrey from '/assets/LOG101/DieselGrey-LOG101.jpg';
import electricBlue from '/assets/LOG101/ElectricBlue-LOG101.jpeg';
import gridironGreen from '/assets/LOG101/GridironGreen-LOG101.jpeg';
import navy from '/assets/LOG101/Navy-LOG101.jpeg';
import pinkCrush from '/assets/LOG101/PinkCrush-LOG101.jpeg';
import rogueGrey from '/assets/LOG101/RogueGrey-LOG101.jpg';
import signalRed from '/assets/LOG101/SignalRed-LOG101.jpeg';
import sparBlue from '/assets/LOG101/SparBlue-LOG101.jpeg';

const LOG101 = {
    id: 'LOG101',
    cost: 16.75,
    name: 'OGIO 101L',
    label: "OGIO 101L - Women's Jewel Polo",
    stockImage: whiteLOG101removebg,
    colors: [
        { name: 'Black', image: black, underbase: 1 },
        { name: 'Blue Mist', image: blueMist, underbase: 1 },
        { name: 'Bright White', image: brightWhite, underbase: 0 },
        { name: 'Diesel Grey', image: dieselGrey, underbase: 1 },
        { name: 'Electric Blue', image: electricBlue, underbase: 1 },
        { name: 'Gridiron Green', image: gridironGreen, underbase: 1 },
        { name: 'Navy', image: navy, underbase: 1 },
        { name: 'Pink Crush', image: pinkCrush, underbase: 1 },
        { name: 'Rogue Grey', image: rogueGrey, underbase: 1 },
        { name: 'Signal Red', image: signalRed, underbase: 1 },
        { name: 'Spar Blue', image: sparBlue, underbase: 1 },
    ],
};

export default LOG101;