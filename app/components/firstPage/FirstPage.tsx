

const FirstPage = () => {

    return (
        <main className="w-full h-screen relative">
          <video
            style={{width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay
            muted
            loop
          >
            <source src="Assets/video/SLI_videoBg.mp4" />
          </video>
    
          <div className=" text-white flex-col absolute top-[10%] left-[60%] animate-fadeIn">
            <img className="w-52 animate-fadeIn" src="Assets/images/sli_logo_seul.png" alt="logo sli" />
            <p className="font-noto-sans font-bold text-white text-4xl mt-10 animate-fadeIn">
                Votre partenaire privilégié
            </p>
            
          </div>
    
          <div className="font-noto-sans text-[25px] text-white flex flex-col items-center left-[50%] absolute bottom-[120px] translate-x-[-50%] animate-blink">
            <p>Découvrez Nous</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </main>
      );
    };
    
    export default FirstPage;
