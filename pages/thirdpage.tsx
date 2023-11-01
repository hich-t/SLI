"use client";
import { useForm } from 'react-hook-form';
import FormSpreeForm from "../app/reusable/formSpreeForm";

const ThirdPage = () => {

    const handleClick = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
    }

    return (
        <main className="w-full h-screen flex flex-col">
            <div className="w-full h-[65%] md:h-[80%] bg-white flex">
                <div className="hidden md:block w-[35%]">
                    <img className="shadow-custom-red w-full h-full object-cover object-[67%]" 
                        src="Assets/images/contact.jpeg" alt="" />
                </div>
                <div className="w-full md:w-[65%] flex items-center justify-center mx-4 md:mx-0">
                    <FormSpreeForm />
                </div>
            </div>

            <div 
            style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset" }}
            className="w-full h-[35%] md:h-[20%] bg-white shadow-custom-red flex items-center justify-around">
            
            <img className="w-24 " src="Assets/images/sli_logo.png" alt="logo SLI" />

            <p className="font-noto-sans font-normal text-maroc-red font-large">
                Adresse : xxxxxxxxxxxx<br />
                Tel : 00 000 0000 0000<br />
                Email : xxxxxx@xxxxx.co
            </p>
            
            <p 
            onClick={handleClick}
            className="hidden md:block font-noto-sans font-bold cursor-pointer text-maroc-red">
            Retour en haut
            </p>

            </div>
        </main>
    );
}

export default ThirdPage;
