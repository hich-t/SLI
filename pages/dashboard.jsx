import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { jsPDF } from "jspdf";
import { useRouter } from 'next/router';
import axios from 'axios';  // Assuming axios is used for HTTP requests

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const { register, handleSubmit } = useForm();

  const calculatePrice = (weight) => {
    if (!user || !user.rate_table) return 0;

    const roundedWeight = Math.ceil(weight);
    console.log('Rounded weight:', roundedWeight);  // Log the rounded weight

    // Convert the rate table keys into a format that can be compared with the roundedWeight
    const rateKeys = Object.keys(user.rate_table).map(key => {
        const [min, max] = key.split('-').map(num => parseInt(num, 10));
        return { min, max: max || min };  // If max is undefined (e.g., "1kg"), use min as max
    });

    console.log('Rate keys:', rateKeys);  // Log the rate keys

    // Find the rate that matches the roundedWeight
    const matchingRateKey = rateKeys.find(rateKey => roundedWeight >= rateKey.min && roundedWeight <= rateKey.max);

    console.log('Matching rate key:', matchingRateKey);  // Log the matching rate key

    if (matchingRateKey) {
        const keyString = matchingRateKey.max === matchingRateKey.min
            ? `${matchingRateKey.min}kg`
            : `${matchingRateKey.min}-${matchingRateKey.max}kg`;
        const price = parseFloat(user.rate_table[keyString]);
        console.log('Price:', price);  // Log the price
        return price;
    }

    return 0;  // Return 0 if no match is found
};

  
  const [price, setPrice] = useState(0);  // Initialize price state

  const handleWeightChange = (e) => {
    const weight = e.target.value;
    console.log('Weight:', weight);  // Log the weight value

    const calculatedPrice = calculatePrice(weight);
    setPrice(calculatedPrice);
    console.log('Price:', calculatedPrice);
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Validate token and fetch user info
    axios.post('/api/auth/validate-token', { token })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error(error);
        router.push('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, setPrice]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const generatePDF = (formData) => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(formData, null, 2), 10, 10);
    const pdfData = doc.output('datauristring');
    setPdfs(prevPdfs => [...prevPdfs, pdfData]);
  };

  const onSubmit = (data) => {
    generatePDF(data);
    setModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full h-screen bg-white flex flex-col items-center">
      <div className="font-noto-sans h-28 flex items-center justify-between w-full shadow-custom-red text-maroc-red bg-white top-0 px-6 sm:px-20">
        <div className="invisible">
          <button className="font-noto-sans font-bold text-white bg-maroc-red p-2 rounded-xl">Placeholder</button>
        </div>
        <div className="flex-grow flex justify-center">
          <img src="Assets/images/sli_logo.png"  alt="logo SLI" className="w-28"/>
        </div>
        <div>
          <button onClick={handleLogout} className="font-noto-sans font-bold text-white bg-maroc-red p-2 rounded-xl">Déconnexion</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-4 rounded-lg w-1/3">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4">Close</button>
            <div className="flex justify-center mb-4">
              <img src="Assets/images/sli_logo_seul.png" alt="SLI Logo" className="w-24" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="sender">Expéditeur</label>
                <input {...register('sender', { required: true, value: user?.company_name })} placeholder="Expéditeur" className="p-2 rounded border" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="senderAddress">Adresse Expéditeur</label>
                <input {...register('senderAddress', { required: true, value: user?.address })} placeholder="Adresse Expéditeur" className="p-2 rounded border" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="senderPhone">Téléphone expéditeur</label>
                <input {...register('senderPhone', { required: true, value: user?.phone })} placeholder="Téléphone expéditeur" className="p-2 rounded border" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="recipientAddress">Adresse destinataire</label>
                <input {...register('recipientAddress')} placeholder="Adresse destinataire" className="p-2 rounded border" required />
              </div>
              <div className="flex flex-col">
                <label htmlFor="recipientCountry">Pays destinataire</label>
                <input {...register('recipientCountry')} placeholder="Pays destinataire" className="p-2 rounded border" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="recipientPhone">Téléphone destinataire</label>
                <input {...register('recipientPhone')} placeholder="Téléphone destinataire" className="p-2 rounded border" />
              </div>

              <div className="flex flex-col">
      <label htmlFor="packageWeight">Poids du colis (en Kg)</label>
      <div className="flex items-center space-x-2">
        <input
          {...register('packageWeight')}
          placeholder="Poids du colis"
          className="p-2 rounded border"
          required
          onChange={handleWeightChange}
        />
        <span className="text-lg font-bold">Price: {price} MAD</span>
      </div>
    </div>
              <div className="flex justify-center mt-4">
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
