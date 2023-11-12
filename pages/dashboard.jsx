import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { jsPDF } from "jspdf";
import { useRouter } from 'next/router';
import axios from 'axios';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [shipmentType, setShipmentType] = useState('Colis');
  const [numberOfParcels, setNumberOfParcels] = useState(1);
  const [parcelWeights, setParcelWeights] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { register, handleSubmit, setValue, getValues } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.post('/api/auth/validate-token', { token })
    .then(response => {
      const userData = response.data.user;
  
      userData.parcel_pricing = JSON.parse(userData.parcel_pricing);
      userData.pallet_pricing = JSON.parse(userData.pallet_pricing);
  
      setUser(userData);
  
      console.log("Parsed parcel pricing:", userData.parcel_pricing);
      console.log("Parsed pallet pricing:", userData.pallet_pricing);
    })
    .catch(error => {
      console.error(error);
      router.push('/login');
    })
    .finally(() => {
      setLoading(false);
    });
  
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const calculatePrice = (weights) => {
    if (!user) return 0;
  
    let price = 0;
    if (shipmentType === 'Colis') {
      const pricing = Object.entries(user.parcel_pricing).reduce((acc, [key, value]) => {
        acc[parseFloat(key)] = value;
        return acc;
      }, {});
  
      for (const weight of weights) {
        const weightKeys = Object.keys(pricing).sort((a, b) => a - b);
        let applicableWeight = weightKeys.find(key => weight <= key);
  
        if (!applicableWeight) {
          applicableWeight = weightKeys[weightKeys.length - 1]; 
        }
  
        price += pricing[applicableWeight] || 0;
      }
    } else {
      const pricing = user.pallet_pricing;
      const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
      let additionalCostPerKg = pricing['base_price'];
      
      if (totalWeight > 70) {
        const weightRanges = Object.keys(pricing).filter(k => k.includes('-') || k.includes('+'));
        const applicableRange = weightRanges.find(range => {
          const [min, max] = range.split('-').map(Number);
          return totalWeight >= min && (!max || totalWeight <= max);
        });
        additionalCostPerKg = applicableRange ? pricing[applicableRange] : pricing['base_price'];
        price = pricing['base_price'] + (additionalCostPerKg * (totalWeight - 70));
      } else {
        price = pricing['base_price'];
      }
    }
  
    return price;
  };
  
  
  useEffect(() => {
    if (!user) return;
  
    if (shipmentType === 'Colis') {
      setParcelWeights([0.5]); 
    } else {
      setParcelWeights([70]); 
    }
  }, [user, shipmentType]);
  
  
  useEffect(() => {
    if (user && parcelWeights.some(weight => weight > 0)) {
      setTotalPrice(calculatePrice(parcelWeights));
    }
  }, [parcelWeights, user, shipmentType]);
  
  const handleShipmentTypeChange = (e) => {
    const newShipmentType = e.target.value;
    setShipmentType(newShipmentType);
  
    let defaultWeight;
    if (newShipmentType === 'Colis') {
      defaultWeight = 0.5; 
    } else {
      defaultWeight = 70; 
    }
  
    setParcelWeights([defaultWeight]);
    setTotalPrice(calculatePrice([defaultWeight]));
  };
  

  const handleNumberOfParcelsChange = (e) => {
    const numParcels = Number(e.target.value);
    setNumberOfParcels(numParcels);
    const updatedWeights = Array(numParcels).fill(0.5).map((_, i) => parcelWeights[i] || 0.5);
    setParcelWeights(updatedWeights);
    setTotalPrice(calculatePrice(updatedWeights));
  };
  

  const handleWeightChange = (index, e) => {
    let newWeight = Number(e.target.value);
  
    newWeight = Math.max(0.5, newWeight); 
    if (shipmentType === 'Colis') {
      newWeight = Math.min(newWeight, 70); 
    } else if (shipmentType === 'Palette') {
      newWeight = Math.min(newWeight, 1500); 
    }
  
    const updatedWeights = [...parcelWeights];
    updatedWeights[index] = newWeight;
    setParcelWeights(updatedWeights);
  
    setTotalPrice(calculatePrice(updatedWeights));
  };
  

  const generatePDF = async (formData) => {
    const doc = new jsPDF();
  
    const logoUrl = '/Assets/images/sli_logo.png'; 
  
    const logoWidth = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth / 2) - (logoWidth / 2); // Centering the logo
  
    doc.addImage(logoUrl, 'PNG', logoX, 10, logoWidth, logoWidth);
  
    const fieldLabels = {
      sender: 'Expéditeur',
      senderAddress: 'Adresse Expéditeur',
      senderPhone: 'Téléphone Expéditeur',
      recipientAddress: 'Adresse Destinataire',
      recipientCountry: 'Pays Destinataire',
      recipientPhone: 'Téléphone Destinataire',
      shipmentType: 'Type d\'Envoi',
      numberOfParcels: 'Nombre de Colis',
      parcelWeights: 'Poids des Colis',
      totalPrice: 'Prix Total'
    };
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
  
    let yOffset = 70; 
  
    Object.entries(formData).forEach(([key, value], index) => {
      const label = fieldLabels[key] || key;
      doc.setTextColor(255, 0, 0); 
      doc.text(`${label}:`, 15, yOffset + 10 * index);
      doc.setTextColor(0, 0, 0); 
      doc.text(`${Array.isArray(value) ? value.join(', ') : value}`, 50, yOffset + 10 * index); 
      yOffset += 10; 
    });
  
    
    const pdfData = doc.output('datauristring');
    setPdfs(prevPdfs => [...prevPdfs, pdfData]);
  };
  
  
  

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      totalPrice: calculatePrice(parcelWeights),  
      parcelWeights: parcelWeights.map(weight => Number(weight))
    };
    generatePDF(formattedData);
    setModalOpen(false);
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleBlur = (index, e) => {
    let value = Number(e.target.value);
  
    if (shipmentType === 'Colis') {
      value = Math.max(0.5, Math.min(value, 70));
    } else if (shipmentType === 'Palette') {
      value = Math.max(70, Math.min(value, 1500));
    }
  
    const updatedWeights = [...parcelWeights];
    updatedWeights[index] = value;
    setParcelWeights(updatedWeights);
  
    e.target.value = value;
  };
  

  return (
    <main className="w-full h-screen bg-white flex flex-col items-center">
      <div className="font-noto-sans h-28 flex items-center justify-between w-full shadow-custom-red text-maroc-red bg-white top-0 px-6 sm:px-20">
        <div className="invisible">
          <button className="font-noto-sans font-bold text-white bg-maroc-red p-2 rounded-xl">Placeholder</button>
        </div>
        <div className="flex-grow flex justify-center">
          <img src="Assets/images/sli_logo.png" alt="logo SLI" className="w-28"/>
        </div>
        <div>
          <button onClick={handleLogout} className="font-noto-sans font-bold text-white bg-maroc-red p-2 rounded-xl">Déconnexion</button>
        </div>
      </div>

      {isModalOpen && (
  <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="modal-content bg-white p-6 rounded-lg w-2/3 max-w-4xl">
      <div className="flex flex-row justify-between items-center mb-4">
      <img className="w-24" src="Assets/images/sli_logo_seul.png" alt="logo sli" />
      <button onClick={() => setModalOpen(false)} className="button font-noto-sans font-black text-maroc-red m-4">Fermer</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex flex-col mb-4">
            <label htmlFor="sender">Expéditeur</label>
            <input {...register('sender', { required: true, value: user?.company_name })} placeholder="Expéditeur" className="p-2 rounded border" required />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="senderAddress">Adresse Expéditeur</label>
            <input {...register('senderAddress', { required: true, value: user?.address })} placeholder="Adresse Expéditeur" className="p-2 rounded border" required />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="senderPhone">Téléphone expéditeur</label>
            <input {...register('senderPhone', { required: true, value: user?.phone })} placeholder="Téléphone expéditeur" className="p-2 rounded border" required />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="recipientAddress">Adresse destinataire</label>
            <input {...register('recipientAddress')} placeholder="Adresse destinataire" className="p-2 rounded border" required />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="recipientCountry">Pays destinataire</label>
            <input {...register('recipientCountry')} placeholder="Pays destinataire" className="p-2 rounded border" />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="recipientPhone">Téléphone destinataire</label>
            <input {...register('recipientPhone')} placeholder="Téléphone destinataire" className="p-2 rounded border" />
          </div>
        </div>
        
        <div>
          <div className="flex flex-col mb-4">
            <label>Type d'envoi</label>
            <div className="flex">
              <label className="mr-2">
                <input {...register('shipmentType')} type="radio" value="Colis" checked={shipmentType === 'Colis'} onChange={handleShipmentTypeChange} />
                Colis
              </label>
              <label>
                <input {...register('shipmentType')} type="radio" value="Palette" checked={shipmentType === 'Palette'} onChange={handleShipmentTypeChange} />
                Palette
              </label>
            </div>
          </div>

          {shipmentType === 'Colis' && (
            <div className="flex flex-col mb-4">
              <label htmlFor="numberOfParcels">Nombre de colis</label>
              <select {...register('numberOfParcels')} onChange={handleNumberOfParcelsChange} className="p-2 rounded border">
                {[...Array(10).keys()].map(n => (
                  <option key={n} value={n + 1}>{n + 1}</option>
                ))}
              </select>
            </div>
          )}
          {Array.from({ length: shipmentType === 'Colis' ? numberOfParcels : 1 }, (_, i) => (
  <div key={i} className="flex flex-col mb-4">
    <label htmlFor={`parcelWeight${i}`}>{`Poids ${shipmentType === 'Colis' ? `Colis ${i + 1}` : 'Palette'} (en kg)`}</label>
    <input 
      {...register(`parcelWeights[${i}]`)} 
      placeholder="Poids en kg" 
      type="number" 
      step="0.1" 
      min={shipmentType === 'Colis' ? 0.5 : 70}
      max={shipmentType === 'Colis' ? 70 : 1500}
      onChange={(e) => handleWeightChange(i, e)} 
      onBlur={(e) => handleBlur(i, e)}  
      className="p-2 rounded border" 
      required 
    />
    {shipmentType === 'Colis' && (
      <div className="text-red-600 text-xs mt-1">
        Poids maximum 70 kg
      </div>
    )}
  </div>
))}



          <div className="text-lg font-bold mt-4">
            <p>Prix total: {totalPrice} MAD</p>
          </div>
        </div>
        
        <div className="col-span-2 flex justify-end mt-4">
          <button type="submit" className="font-noto-sans font-bold text-white bg-maroc-red p-2 rounded-xl">Confirmer envoi</button>
        </div>
      </form>
    </div>
  </div>
)}



      <div className="font-noto-sans text-xl h-72 flex flex-col justify-center items-center">
        <h1 className="font-noto-sans font-bold text-maroc-red">Bienvenue dans votre espace client, {user?.company_name}</h1>
        <button onClick={() => setModalOpen(true)} className="font-noto-sans font-bold text-white bg-maroc-red p-4 rounded-xl m-4">Créer une étiquette d'envoi</button>
      </div>

      <div>
        {pdfs.map((pdfData, index) => (
          <div key={index} className="mb-2">
            <a href={pdfData} download={`etiquette${index + 1}.pdf`}>Download Etiquette {index + 1}</a>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
