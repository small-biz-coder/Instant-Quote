import { useState, useEffect } from 'react';
import Maps from './Inputs/Maps';
import YardForm from './Inputs/YardForm';
import CustForm from './Inputs/CustForm';
import Results from './Outputs/Results';
import './App.css'

interface YardFormInput {
  trees: string;
  fence: string;
  grassCondition: string;
}
interface CustFormInput {
  name: string;
  email: string;
  phone: string;
}

interface TreePricing {
  [key: string]: number;
}

function App (): JSX.Element {
  const [mapValue, setMapValue] = useState<string>('');
  const [yardFormInput, setYardFormInput] = useState<YardFormInput>({
    trees: '',
    fence: '',
    grassCondition: ''
  });
  const [showYardForm, setShowYardForm] = useState<boolean>(false);
  const [showMapAPI, setShowMapAPI] = useState<boolean>(true);
  const [showCustForm, setShowCustForm] = useState<boolean>(false);
  const [custFormInput, setCustFormInput] = useState<CustFormInput>({
    name: '',
    email: '',
    phone:''
  });
  const [showResultsPage, setShowResultsPage] = useState<boolean>(false);
  const [estimatePrice, setEstimatePrice] = useState<number>(0);
  const [yardData, setYardData] = useState<number>(0)

  const handleInputFromMaps = (value: string): void => {
    setMapValue(value);
  };
  const handleYardFormInput = (data: YardFormInput): void => {
    setYardFormInput(data);
    setShowYardForm(false);
    setShowCustForm(true);
  };

  const openCustomerInfo = (data: number): void => {
    setShowYardForm(true);
    setShowMapAPI(false);
    setYardData(data);
  };
  const handleCustFormInput = (data: CustFormInput): void => {
    setCustFormInput(data);
    setShowCustForm(false);
    setShowResultsPage(true);
  };

  useEffect(() => {
    const treePricing: TreePricing = {
    '0': 0,
    '1': 50,
    '2': 70,
    '3': 90,
    '4': 110,
    '5 or more': 145
  };
  
    const treePrice = treePricing[yardFormInput.trees] || 0;
    const fencePrice = yardFormInput.fence === 'yes' ? 75 : 0;
    const yardPrice = yardData > 2000 ? yardData * 0.50 : yardData * 0.75;
    const total = treePrice + fencePrice + yardPrice;
    setEstimatePrice(total);
  }, [yardFormInput, yardData]);

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
          custAddress={mapValue}
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




