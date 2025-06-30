import Image from "next/image";
import { useEffect, useState } from "react";
import CarouselCard from "./Card";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";
import CarouselPeople from "../DTOs/CarouselPeople";
import { BoldIcon, BoltIcon, LightBulbIcon } from "@heroicons/react/24/outline";

interface CarouselProps {
    loading:boolean,
    theme:ThemeSettingsDto,
    images: CarouselPeople[]; // Array of image URLs
    setPrompt:(value: string)=>void;
}

const BigAutoCarousel = ({ loading, theme,images,setPrompt }: CarouselProps) => {
  const [current, setCurrent] = useState(1);
  const backend_url = process.env.NEXT_PUBLIC_SERVER_URL || "";
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-90 flex flex-col justify-center align-middle items-center">
          <h1 className={`font-semibold text-xl mb-3 uppercase  ${theme.fontColor} `}>
            Dataset of People 
        </h1>

    <div className={`w-full max-w-sm ${theme.bgCard} rounded-2xl shadow-lg overflow-hidden`}>
      
         <div className="relative h-100 w-full" onClick={()=>{
          let value_ = images[current].testPrompt.toString()
          if(value_.length<=250){
            setPrompt(value_);
          }else{
            setPrompt(value_.substring(0,249))
          }
          
          }} >
            <Image
            src={`${backend_url}${images[current].image}`}
            alt="Slide"
            fill
            className="object-cover"
            />

        </div>

        

         {/* <CarouselCard theme={theme} title={"Click to see sample prompt"} images={[images[current]]} />
       




     Prev Button 
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        &#8592;
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        &#8594;
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
      */}
    </div>

    <h1 className="m-2 flex justify-center align-middle items-center text-gray-400 font-extralight text-xs " > 
            

    <BoltIcon  className="text-amber-300" style={{width:"15px",height:"15px"}} />Click the picture to see a sample prompt!
    </h1>

    </div>
  );
};

export default BigAutoCarousel;
