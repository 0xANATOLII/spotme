import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";
import { ArrowLeftCircleIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface CardProps {
  title: string;
  optionalValue?: string;
  images: string[]; 
  theme:ThemeSettingsDto;
}

const CarouselCard = ({ theme,title, optionalValue, images }: CardProps) => {
  const [current, setCurrent] = useState(0);
  const backend_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(()=>{
    console.log(images)
  },[])

  return (
<div className={`w-full max-w-sm ${theme.bgCard} rounded-2xl shadow-lg overflow-hidden mb-5`}>
  <div className="w-full">
    <Image
        src={`${backend_url}${images[current]}`}
      alt="Slide"
      width={400} 
      height={0}  

      className="w-full h-auto object-top object-cover max-h-100"
    />


{ images.length>1 ?
<div>
        <button
          onClick={prevSlide}
          className={`absolute left-2 top-1/2 -translate-y-1/2 ${theme.bgCard} bg-opacity-50 ${theme.fontCard} p-1 rounded-full w-7 h-7`}
        >
          <ArrowLeftIcon />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${theme.bgCard} bg-opacity-50 ${theme.fontCard} p-1 rounded-full w-7 h-7`}
        >
          <ArrowRightIcon />
        </button>
        <h1
        
         className={`text-xs absolute right-1/2 bottom-0 translate-x-1/2 -translate-y-0.5 bg-gray-200 rounded-md opacity-60 text-gray-900 pt-1 pb-1 pl-2 pr-2`}
             > 
            {current+1}/{images.length}
        </h1>
      
        </div>
: null
}
      
      </div>

      <div className="p-4 flex justify-around">
        <h2 className={`text-lg font-bold ${theme.fontCard}`}>{title}</h2>
        {optionalValue && (
          <p className={`text-sm ${theme.fontCard} mt-1`}>{optionalValue}</p>
        )}
      </div>
    </div>
  );
};

export default CarouselCard;
