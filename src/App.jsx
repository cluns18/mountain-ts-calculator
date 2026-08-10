import React, { useState, useEffect } from 'react';
import './App.css';
import IntroSlide from './pages/IntroSlide';
import SPGarmentSelect from './pages/SPGarmentSelect';
import EmbGarmentSelect from './pages/EmbGarmentSelect';
import SPtshirtGarmentSelect from './pages/SPtshirtGarmentSelect';
import SPLongSleeveGarmentSelect from './pages/SPLongSleeveGarmentSelect';
import SPHoodieGarmentSelect from './pages/SPHoodieGarmentSelect';
import SPPoloGarmentSelect from './pages/SPPoloGarmentSelect';
import EmbSweatshirtGarmentSelect from './pages/EmbSweatshirtGarmentSelect';
import EmbPoloGarmentSelect from './pages/EmbPoloGarmentSelect';
import EmbHatGarmentSelect from './pages/EmbHatGarmentSelect';
import ColorSelect from './pages/ColorSelect';
import ArtworkSelect from './pages/ArtworkSelect';
import LocationSelect from './pages/LocationSelect';
import ColorCount from './pages/ColorCount';
import ThreadCount from './pages/ThreadCount';
import FinalQuote from './pages/FinalQuote';
import ThankYou from './pages/ThankYou';

function App() {
  const [currentSlide, setCurrentSlide] = useState('intro');
  const [slideHistory, setSlideHistory] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [selectedSPGarment, setSelectedSPGarment] = useState(null);
  const [selectedEmbGarment, setSelectedEmbGarment] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworkDescription, setArtworkDescription] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedSpecialInks, setSelectedSpecialInks] = useState([]);
  const [locationColorCounts, setLocationColorCounts] = useState({});
  const [locationThreadCounts, setLocationThreadCounts] = useState({});
  const [finalQuote, setFinalQuote] = useState(null);
  const [hasError, setHasError] = useState(false);

  const handleNext = () => {
    let nextSlide = '';
    let isValid = true;

    if (currentSlide === 'intro' && !selectedProject) {
      isValid = false;
    }
    else if (currentSlide === 'spGarment' && !selectedGarment) {
      isValid = false;
    }
    else if (currentSlide === 'embGarment' && !selectedGarment) {
      isValid = false;
    }
    else if ((currentSlide === 'spTshirtGarment' || currentSlide === 'spLongSleeveGarment' || currentSlide === 'spHoodieGarment' || currentSlide === 'spPoloGarment') && !selectedSPGarment) {
      isValid = false;
    }
    else if ((currentSlide === 'embSweatshirtGarment' || currentSlide === 'embPoloGarment' || currentSlide === 'embHatGarment') && !selectedEmbGarment) {
      isValid = false;
    }
    else if (currentSlide === 'colorSelect' && !selectedColor) {
      isValid = false;
    }
    else if (currentSlide === 'artworkSelect' && !(selectedArtwork || artworkDescription)) {
      isValid = false;
    }
    else if (currentSlide === 'locationSelect' && selectedLocation.length === 0) {
      isValid = false;
    }

    if (!isValid) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1000);
      return;
    }

    setHasError(false);

    if (currentSlide === 'intro') {
      nextSlide = selectedProject === 'screenPrinting' ? 'spGarment' : 'embGarment';
    }
    else if (currentSlide === 'spGarment' && selectedGarment) {
      if (selectedGarment.id === 'sptshirt') nextSlide = 'spTshirtGarment';
      else if (selectedGarment.id === 'splongsleeve') nextSlide = 'spLongSleeveGarment';
      else if (selectedGarment.id === 'sphoodie') nextSlide = 'spHoodieGarment';
      else if (selectedGarment.id === 'sppolo') nextSlide = 'spPoloGarment';
    }
    else if (currentSlide === 'embGarment' && selectedGarment) {
      if (selectedGarment.id === 'embsweatshirt') nextSlide = 'embSweatshirtGarment';
      else if (selectedGarment.id === 'embpolo') nextSlide = 'embPoloGarment';
      else if (selectedGarment.id === 'embhat') nextSlide = 'embHatGarment';
    }
    else if (currentSlide === 'spTshirtGarment' || currentSlide === 'spLongSleeveGarment' || currentSlide === 'spHoodieGarment' || currentSlide === 'spPoloGarment') {
      nextSlide = 'colorSelect';
    }
    else if (currentSlide === 'embSweatshirtGarment' || currentSlide === 'embPoloGarment' || currentSlide === 'embHatGarment') {
      nextSlide = 'colorSelect';
    }
    else if (currentSlide === 'colorSelect') {
      nextSlide = 'artworkSelect';
    }
    else if (currentSlide === 'artworkSelect') {
      nextSlide = 'locationSelect';
    }
    else if (currentSlide === 'locationSelect') {
      nextSlide = selectedProject === 'screenPrinting' ? 'colorCount' : 'threadCount';
    }
    else if (currentSlide === 'colorCount' || currentSlide === 'threadCount') {
      nextSlide = 'finalQuote';
    }
    else if (currentSlide === 'finalQuote') {
      nextSlide = 'thankYou';
    }

    if (nextSlide) {
      setSlideHistory([...slideHistory, currentSlide]);
      setCurrentSlide(nextSlide);
    }
  };

  const handlePrevious = () => {
    if (slideHistory.length > 0) {
      const previousSlide = slideHistory[slideHistory.length - 1];

      if (previousSlide === 'spGarment') setSelectedSPGarment(null);
      if (previousSlide === 'embGarment') setSelectedEmbGarment(null);
      if (previousSlide === 'intro') setSelectedGarment(null);
      if (previousSlide === 'locationSelect') {
        setSelectedSpecialInks([]);
        setLocationColorCounts({});
      }

      const newHistory = slideHistory.slice(0, -1);
      setCurrentSlide(previousSlide);
      setSlideHistory(newHistory);
    }
  };

  useEffect(() => {
    const stepMap = {
      intro: '1 - Project Type',
      spGarment: '2 - Garment Type',
      embGarment: '2 - Garment Type',
      spTshirtGarment: '3 - Garment Select',
      spLongSleeveGarment: '3 - Garment Select',
      spHoodieGarment: '3 - Garment Select',
      spPoloGarment: '3 - Garment Select',
      embSweatshirtGarment: '3 - Garment Select',
      embPoloGarment: '3 - Garment Select',
      embHatGarment: '3 - Garment Select',
      colorSelect: '4 - Color',
      artworkSelect: '5 - Artwork',
      locationSelect: '6 - Location',
      colorCount: '7 - Color Count',
      threadCount: '7 - Thread Count',
      finalQuote: '8 - Quote',
      thankYou: '9 - Confirmation'
    };

    const stepName = stepMap[currentSlide] || currentSlide;

    window.parent.postMessage(
      {
        event: 'calculator_slide_view',
        calcSlideName: currentSlide,
        calcStepName: stepName,
      },
      '*'
    );
  }, [currentSlide]);

  return (
    <div className={`slide-container ${hasError ? 'error-shake' : ''}`}>
      <div className='slide-page'>
        {currentSlide === 'intro' && (
          <IntroSlide
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onNext={handleNext}
          />
        )}
        {currentSlide === 'spGarment' && (
          <SPGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedGarment={selectedGarment}
            setSelectedGarment={setSelectedGarment}
          />
        )}
        {currentSlide === 'spTshirtGarment' && (
          <SPtshirtGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedSPGarment={selectedSPGarment}
            setSelectedSPGarment={setSelectedSPGarment}
          />
        )}
        {currentSlide === 'spLongSleeveGarment' && (
          <SPLongSleeveGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedSPGarment={selectedSPGarment}
            setSelectedSPGarment={setSelectedSPGarment}
          />
        )}
        {currentSlide === 'spHoodieGarment' && (
          <SPHoodieGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedSPGarment={selectedSPGarment}
            setSelectedSPGarment={setSelectedSPGarment}
          />
        )}
        {currentSlide === 'spPoloGarment' && (
          <SPPoloGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedSPGarment={selectedSPGarment}
            setSelectedSPGarment={setSelectedSPGarment}
          />
        )}
        {currentSlide === 'embGarment' && (
          <EmbGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedGarment={selectedGarment}
            setSelectedGarment={setSelectedGarment}
          />
        )}
        {currentSlide === 'embSweatshirtGarment' && (
          <EmbSweatshirtGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedEmbGarment={selectedEmbGarment}
            setSelectedEmbGarment={setSelectedEmbGarment}
          />
        )}
        {currentSlide === 'embPoloGarment' && (
          <EmbPoloGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedEmbGarment={selectedEmbGarment}
            setSelectedEmbGarment={setSelectedEmbGarment}
          />
        )}
        {currentSlide === 'embHatGarment' && (
          <EmbHatGarmentSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedEmbGarment={selectedEmbGarment}
            setSelectedEmbGarment={setSelectedEmbGarment}
          />
        )}
        {currentSlide === 'colorSelect' && (
          <ColorSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedSPGarment={selectedSPGarment}
            selectedEmbGarment={selectedEmbGarment}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        )}
        {currentSlide === 'artworkSelect' && (
          <ArtworkSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            setUploadedImage={setSelectedArtwork}
            setArtworkDescription={setArtworkDescription}
          />
        )}
        {currentSlide === 'locationSelect' && (
          <LocationSelect
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedGarment={selectedGarment}
            setSelectedLocation={setSelectedLocation}
          />
        )}
        {currentSlide === 'colorCount' && (
          <ColorCount
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedLocations={selectedLocation}
            setColorCounts={setLocationColorCounts}
          />
        )}
        {currentSlide === 'threadCount' && (
          <ThreadCount
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedLocations={selectedLocation}
            locationThreadCounts={locationThreadCounts}
            setLocationThreadCounts={setLocationThreadCounts}
          />
        )}
        {currentSlide === 'finalQuote' && (
          <FinalQuote
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedProject={selectedProject}
            selectedGarment={selectedGarment}
            selectedSPGarment={selectedSPGarment}
            selectedEmbGarment={selectedEmbGarment}
            selectedColor={selectedColor}
            selectedArtwork={selectedArtwork}
            artworkDescription={artworkDescription}
            selectedLocation={selectedLocation}
            locationColorCounts={locationColorCounts}
            selectedSpecialInks={selectedSpecialInks}
            locationThreadCounts={locationThreadCounts}
            setFinalQuote={setFinalQuote}
          />
        )}
        {currentSlide === 'thankYou' && (
          <ThankYou />
        )}
      </div>
      {hasError && <p className="error-message" style={{ position: 'absolute', bottom: '8px', left: 0, right: 0 }}>Please make a selection to proceed.</p>}
    </div>
  );
}

export default App;
