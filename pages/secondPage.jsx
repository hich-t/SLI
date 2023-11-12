const SecondPage = () => {
    return(
        <main className='w-full h-screen flex flex-col sm:flex-row relative'>
            <div className="w-full h-screen sm:w-[65%] bg-white flex flex-col items-center justify-center p-4">

                <img className="w-24 sm:w-28 mb-2 sm:mb-0 sm:mt-8" src="Assets/images/sli_logo.png" alt="logo sli" />

                <p className="m-4 sm:m-12 text-large sm:text-2xl text-justify font-noto-sans text-maroc-red font-bold">
                SLI se positionne comme votre partenaire privilégié pour tous vos besoins de transport. En tant qu'intermédiaire entre vous et les transporteurs, notre mission est de vous garantir une qualité de service irréprochable tout en vous faisant bénéficier de tarifs avantageux.<br />
                Avec SLI, assurez-vous d'une expérience fluide, efficace et économique, sans compromis sur la qualité !
                </p>

                <p className="m-4 text-lg sm:text-xl text-justify font-noto-sans text-maroc-red font-normal">
                    Parmi Nos partenaires : 
                </p>
                <div 
                style={{ borderRadius: "10px", boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
                className="flex items-center mb-10 sm:mb-5">
                    <img className="w-10 sm:w-14 m-2 sm:m-4" src="Assets/images/logo_dhl.webp" alt="logo dhl" />
                    <img className="w-10 sm:w-14 m-2 sm:m-4" src="Assets/images/logo_fedex.jpeg" alt="logo fedex" />
                    <img className="w-10 sm:w-14 m-2 sm:m-4" src="Assets/images/logo_ups.png" alt="logo ups" />
                </div>
                <div className="font-noto-sans text-[20px] sm:text-[25px] text-maroc-red flex flex-col items-center animate-blink">
                <p>Contactez-Nous</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </div>
            </div>
            <div className="hidden sm:block sm:w-[35%]">
            <img src="Assets/images/logistics1.jpeg" alt="Man in warehouse" className="shadow-custom-red w-full h-full object-cover object-[67%]"/>
            </div>
        </main>
    )
}

export default SecondPage;
