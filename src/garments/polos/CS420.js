import whiteCS420removebg from '/assets/CS420/White-CS420-removebg.png';
import black from '/assets/CS420/Black-CS420.jpeg';
import charcoal from '/assets/CS420/Charcoal-CS420.jpeg';
import darkNavy from '/assets/CS420/DarkNavy-CS420.jpeg';
import lightGrey from '/assets/CS420/LightGrey-CS420.jpeg';
import red from '/assets/CS420/Red-CS420.jpeg';
import royal from '/assets/CS420/Royal-CS420.jpeg';
import safetyYellow from '/assets/CS420/SafetyYellow-CS420.jpeg';
import white from '/assets/CS420/White-CS420.jpeg';

const CS420 = {
    id: 'CS420',
    cost: 13.99,
    name: 'CornerStone 420 Polo',
    label: 'CornerStone 420 Polo',
    stockImage: whiteCS420removebg,
    colors: [
        { name: 'Black', image: black, underbase: 1 },
        { name: 'Charcoal', image: charcoal, underbase: 1 },
        { name: 'Dark Navy', image: darkNavy, underbase: 1 },
        { name: 'Light Grey', image: lightGrey, underbase: 1 },
        { name: 'Red', image: red, underbase: 1 },
        { name: 'Royal', image: royal, underbase: 1 },
        { name: 'Safety Yellow', image: safetyYellow, underbase: 1 },
        { name: 'White', image: white, underbase: 0 },
    ],
};

export default CS420;