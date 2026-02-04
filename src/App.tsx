import { useState, useEffect } from 'react';
import Maps from './Inputs/Maps';
import YardForm from './Inputs/YardForm';
import CustForm from './Inputs/CustForm';
import Results from './Outputs/Results';
import EmailForm from './Outputs/EmailForm';
import './App.css'

function App () {
  const [mapValue, setMapValue] = useState('');
  const [yardFormInput, setYardFormInput] = useState({});
  const [showYardForm, setShowYardForm] = useState(false);
  const [showMapAPI, setShowMapAPI] = useState(true);
  const [showCustForm, setShowCustForm] = useState(false);
  const [custFormInput, setCustformInput] = useState({});
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [estimatePrice, setEstimatePrice] = useState(0);
  const [yardData, setYardData] = useState(0)

  const handleInputFromMaps = (value) => {
    setMapValue(value);
  };
  const handleYardFormInput = (data) => {
    setYardFormInput(data);
    setShowYardForm(false);
    setShowCustForm(true);
  };

  const openCustomerInfo = (data) => {
    setShowYardForm(true);
    setShowMapAPI(null);
    setYardData(data);
  };
  const handleCustFormInput = (data) => {
    setCustformInput(data);
    setShowCustForm(false);
    setShowResultsPage(true);
  };

  useEffect(() => {
    const treePricing = {
    '0': 0,
    '1': 50,
    '2': 70,
    '3': 90,
    '4': 110,
    '5 or more': 145
  };
  
    const treePrice = treePricing[yardFormInput.trees] || 0;
    const fencePrice = yardFormInput.fence === 'yes' ? 75 : 0;
    // const yardPrice = () => {
    //   if (yardData )
    // }
    const total = treePrice + fencePrice +
    (yardData > 2000 ? yardData * .50 : yardData * .75);
    setEstimatePrice(total);
  }, [yardFormInput]);

  return (
    <div className="container">
      {showMapAPI && (
        <Maps
          onInputChange={handleInputFromMaps}
          onFormOpen={openCustomerInfo}
       />
        )}
       {showYardForm && (
          <YardForm
            appData={handleYardFormInput}
         />
        )}
       {showCustForm && (
        <CustForm
          custData={handleCustFormInput}
          />
        )}
       {showResultsPage && (
        <Results
          estimatePrice={estimatePrice}
          yardData={yardData}
          custInfo={custFormInput}
          onSendEmail={showResultsPage}
          />
        )}
    </div>
    )
}

export default App;




// inputs:
// address,
// gate,
// how many trees,
// have you been mowing it yourself or,
// is another company currently doing it,
// what is your yards current condition (bad, medium, average, great)

// after address is entered, use satellite image to draw on map, 
// and transfer that input to a number(sq. yd.)
// *sq. ft. by whatever price you use, and add $50 a tree, 
// plus $75 for a fence.
// return this number with multiple choices, 
// based on how often yard is mowed, and how much fertilizer goes into it.




