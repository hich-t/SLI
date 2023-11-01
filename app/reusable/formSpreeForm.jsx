import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const FormspreeForm = () => {
  const [state, handleSubmit] = useForm("xqkvnvgy");
  if (state.succeeded) {
      return (
          <div className="flex flex-col items-center">
              <img className="w-24 mb-5" src="Assets/images/sli_logo_seul.png" alt="logo SLI" />
              <p className="font-noto-sans text-maroc-red font-black">
                  Merci pour votre message !
              </p>
          </div>
      );
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <h2 className="text-2xl font-noto-sans text-maroc-red font-bold mb-5">Nous Contacter</h2>
      
      <input id="objet"         style={{ color: 'black' }}
 type="text" name="objet" placeholder="Objet" className="w-full p-2 mb-4 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100" />
      <ValidationError prefix="Objet" field="objet" errors={state.errors} />
      
      <div className="flex justify-between gap-2 mb-4">
        <input id="nom"          style={{ color: 'black' }}
 type="text" name="nom" placeholder="Nom" className="w-[49%] p-2 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100" />
        <ValidationError prefix="Nom" field="nom" errors={state.errors} />
        
        <input id="prenom"         style={{ color: 'black' }}
 type="text" name="prenom" placeholder="Prénom" className="w-[49%] p-2 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100" />
        <ValidationError prefix="Prénom" field="prenom" errors={state.errors} />
      </div>
      
      <div className="flex justify-between gap-2 mb-4">
        <input id="entreprise"         style={{ color: 'black' }}
 type="text" name="entreprise" placeholder="Entreprise" className="w-[49%] p-2 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100" />
        <ValidationError prefix="Entreprise" field="entreprise" errors={state.errors} />
        
        <input id="email" type="email"          style={{ color: 'black' }}
 name="email" placeholder="Email" className="w-[49%] p-2 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100" />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>
      
      <textarea id="requete"         style={{ color: 'black' }}
 name="requete" placeholder="Votre Requête" className="w-full p-2 h-32 mb-4 border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100"></textarea>
      <ValidationError prefix="Requête" field="requete" errors={state.errors} />
      
      <button type="submit" disabled={state.submitting} className="p-2 bg-maroc-red text-white rounded hover:bg-blue-600">
        Envoyer
      </button>
    </form>
  );
};

export default FormspreeForm;
