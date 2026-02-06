import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import './Input styles/maps-forms.css';

interface MapContentProps {
  address: string;
  onAreaCalculated: (area: number) => void;
}
interface MapsInnerProps {
  onInputChange: (value: string) => void;
  onFormOpen: (area: number) => void;
}
interface MapsProps {
  onInputChange: (value: string) => void;
  onFormOpen: (area: number) => void;
}

function MapContent({ address, onAreaCalculated }: MapContentProps): null {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');
  const [_drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  
  useEffect(() => {
    if (address && map) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results) => {
        if (results && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          map.setZoom(19);
        }
      });
    }
  }, [address, map]);

  // Calculate total area - moved to useEffect
  useEffect(() => {
    if (polygons.length === 0) {
      onAreaCalculated(0);
      return;
    }
    
    const totalArea = polygons.reduce((sum, poly) => {
      const area = window.google.maps.geometry.spherical.computeArea(poly.getPath());
      return sum + area;
    }, 0);
    const squareYards = Math.round(totalArea * 1.196);
    onAreaCalculated(squareYards);
  }, [polygons, onAreaCalculated]);

  // Initialize drawing manager
  useEffect(() => {
    if (!map || !drawing) return;

    const newDrawingManager = new drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        fillColor: '#00FF00',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#00FF00',
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    newDrawingManager.setMap(map);
    setDrawingManager(newDrawingManager);

    // Listen for polygon completion
    window.google.maps.event.addListener(newDrawingManager, 'polygoncomplete', (poly: google.maps.Polygon) => {
      // Add new polygon to array
      setPolygons(prevPolygons => [...prevPolygons, poly]);
      
      // Stop drawing mode after completing polygon
      newDrawingManager.setDrawingMode(null);

      // Recalculate when this polygon is edited
      window.google.maps.event.addListener(poly.getPath(), 'set_at', () => {
        setPolygons(prevPolygons => [...prevPolygons]); // Trigger re-render
      });

      window.google.maps.event.addListener(poly.getPath(), 'insert_at', () => {
        setPolygons(prevPolygons => [...prevPolygons]); // Trigger re-render
      });

      // Allow deleting polygon by right-clicking
      window.google.maps.event.addListener(poly, 'rightclick', () => {
        poly.setMap(null);
        setPolygons(prevPolygons => prevPolygons.filter(p => p !== poly));
      });
    });

    return () => {
      if (newDrawingManager) {
        newDrawingManager.setMap(null);
      }
      // Clean up all polygons
      polygons.forEach(poly => poly.setMap(null));
    };
  }, [map, drawing]);
  
  return null;
}

function MapsInner({ onInputChange, onFormOpen }: MapsInnerProps): JSX.Element {
  const [userAddress, setUserAddress] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [yardArea, setYardArea] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    
    const autoComplete = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'name'],
      componentRestrictions: { country: 'us' },
      types: ['address']
    });
    
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace();
      setSelectedPlace(place);
      setUserAddress(place.formatted_address || '');
      onInputChange(place.formatted_address || '');
    });
  }, [places, onInputChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newAddress = e.target.value;
    setUserAddress(newAddress);
    onInputChange(newAddress);
  };

  const clearInput = (): void => {
    setUserAddress('');
    setSelectedPlace(null);
    setYardArea(0);
    onInputChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAreaCalculated = (area: number): void => {
    setYardArea(area);
  };

  const startForm = (): void => {
  	if(yardArea > 0) {
  		onFormOpen(yardArea);
  	} else {
  		alert('Find your address, and draw your yard first.')
  	}
  }


  return (
    <>
      <h1>GreenScape Lawn Care</h1>
      <p className="tag-line">
      	Professional lawn care services tailored to your property
      </p>
      <h2>What will my lawn care cost?</h2>
      <p>
        1. Enter your street address<br/><br/>
        2. Trace your yard on the map<br/><br/>
        <strong>3. Get your free estimate instantly!</strong>
      </p>
      <label className="input-form">
      	<div className="input-cont">
        <input
          ref={inputRef}
          value={userAddress}
          onChange={handleChange}
          placeholder="Enter your Address"
          required
        />
        {userAddress && (
        	<button
        		type="button"
        		onClick={clearInput}
        		className="x-button"
        	>
        		<span className="line-1"></span>
        		<span className="line-2"></span>
        	</button>
        	)}
        </div>
      </label>
      
      <Map
        defaultCenter={{ lat: 40.7989736, lng: -76.8621935 }}
        defaultZoom={7}
        mapTypeId="hybrid"
        style={{ width: '100%', height: '500px'}}
      >
        {selectedPlace && <MapContent address={userAddress} onAreaCalculated={handleAreaCalculated} />}
      </Map>
      <div className="edit-yard">
      	<strong>Start Your Estimate by Outlining Your Yard</strong>
      	<p>After you've found your property on the map, draw a line around your yard, using the polygon, found
      	 on the top center of the map. Click on the polygon, then move the cross to a 
      	 corner of your yard and a line will appear as you move your mouse. 
      	 Move to the next corner, click on it, and keep doing this around your yard 
      	 until you get back to your starting point. Repeat this step if your yard is 
      	 not connected all the way, drawing multiple areas. If you need to delete an 
      	 area, just right click on that area. Edit a completed area by clicking and 
      	 dragging on one of the circle connecting points.</p>
      	 <span>Your yard's size: "{yardArea ? yardArea.toLocaleString() : 0} sq yds"</span>
	      	<button onClick={startForm}>Next</button>
      </div>
    </>
  );
}

function Maps({ onInputChange, onFormOpen }: MapsProps): JSX.Element {
  return (
  	<div className="maps-cont">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <MapsInner onInputChange={onInputChange} onFormOpen={onFormOpen} />
        </APIProvider>
    </div>
  	);
}

export default Maps;