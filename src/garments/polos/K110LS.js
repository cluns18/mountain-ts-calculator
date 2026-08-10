import whiteK110LSremovebg from '/assets/K110LS/White-K110LS-removebg.png';
import deepBlack from '/assets/K110LS/DeepBlack-K110LS.jpg';
import graphite from '/assets/K110LS/Graphite-K110LS.jpg';
import richRed from '/assets/K110LS/RichRed-K110LS.jpg';
import riverBlueNavy from '/assets/K110LS/RiverBlueNavy-K110LS.jpg';
import trueRoyal from '/assets/K110LS/TrueRoyal-K110LS.jpg';
import white from '/assets/K110LS/White-K110LS.jpg';

const K110LS = {
    id: 'K110LS',
    cost: 10.49,
    name: 'Port Authority K110LS',
    label: 'Port Authority K110LS - Dry Zone Micro-Mesh Long Sleeve Polo',
    stockImage: whiteK110LSremovebg,
    colors: [
        { name: 'Deep Black', image: deepBlack, underbase: 1 },
        { name: 'Graphite', image: graphite, underbase: 1 },
        { name: 'Rich Red', image: richRed, underbase: 1 },
        { name: 'River Blue Navy', image: riverBlueNavy, underbase: 1 },
        { name: 'True Royal', image: trueRoyal, underbase: 1 },
        { name: 'White', image: white, underbase: 0 },
    ],
};

export default K110LS;