// pages/login.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';
import axios from 'axios';  // Import axios for making HTTP requests
import { useRouter } from 'next/router';  // Import useRouter for redirecting the user

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      localStorage.setItem('token', response.data.token);  // Store the token securely
      router.push('/dashboard');  // Redirect to dashboard on successful login
    } catch (error) {
      if (error.response && error.response.data) {
        // Display error message from server
        alert(error.response.data.message);
      } else {
        // General error handling
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <main className="w-full h-screen bg-white flex flex-col items-center justify-center">
      <img src="Assets/images/sli_logo.png" alt="logo sli" className="w-36 mb-8" />

      <h2 className="font-noto-sans text-2xl font-bold text-maroc-red mb-6">Bienvenue !</h2>

   

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 space-y-4 p-8 rounded-lg"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
        }}
      >
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1">Email</label>
          <input
            {...register('email', { required: "Ce champ est obligatoire" })}
            type="email"
            className="p-2 border font-noto-sans font-bold rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100"
            placeholder="Adresse e-mail"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1">Mot de passe</label>
          <input
            {...register('password', { required: "Ce champ est obligatoire" })}
            type="password"
            className="p-2 font-noto-sans font-bold border rounded focus:outline-none focus:border-maroc-red focus:ring-1 focus:ring-maroc-red focus:ring-opacity-100"
            placeholder="Mot de passe"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="font-noto-sans font-bold bg-maroc-red hover:bg-red-700 text-white p-2 rounded-xl w-full mt-4"
        >
          Connexion
        </button>
      </form>

      <div>
        <Link href="/">
          <button className="font-noto-sans font-bold text-white bg-maroc-red rounded-xl p-3 text-large mt-10">
            Retour à l'accueil 
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Login;
