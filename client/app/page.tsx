'use client'
import Image from "next/image";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import ThemeStateDto from "./DTOs/Theme-dto";
import SearchBar from "./components/SearchBar";
import ThemeSettingsDto from "./DTOs/Theme-settings.dto";
import CarouselCard from "./components/Card";
import Feed from "./components/Feed";
import BigAutoCarousel from "./components/BigCarusel";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import CarouselPeople from "./DTOs/CarouselPeople";
import CardPeople from "./DTOs/CardPeople";
import axios from 'axios';

// cloudflared tunnel --url http://localhost:5051

export default function Home() {

  const [isDark,setIsDark] = useState<boolean>(true);
  const [prompt,setPrompt] = useState<string>("");

  const [celebs,setCelebs] = useState<CarouselPeople[]>();

  const [loading,setLoading] = useState<boolean>(true);

  const bs = [
    {
     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-fuGwFteswgZvS2r-Zw42Rigq6EjE3sbdNA&s",
      testPrompt:"",
    },
    {
    image:"https://media.istockphoto.com/id/1145618475/photo/villefranche-on-sea-in-evening.jpg?s=612x612&w=0&k=20&c=vQGj6uK7UUVt0vQhZc9yhRO_oYBEf8IeeDxGyJKbLKI=",
    testPrompt:"",
  },
  {
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSclZ6eDm8ouvmLvSQCIGzyXrQkkRBluCvhAQ&s",
  testPrompt:"",
  }  ,

  ]


 const [findings,setFindings] = useState<CardPeople[]>();

 const smartSearch = async ()=>{

    try {
      const backend_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

      const response = await fetch(backend_url+"", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
  
      const data = await response.json();

      const people: CardPeople[] = Object.entries(data).map(([image, value]) => ({
        image,
        name: (value as any).name,
      }));
      
      console.log(people);

      setFindings(people)

      window.scrollBy({
        top: 100,
        behavior: "smooth",
      })

    } catch (error) {
      console.error("Error:", error);
    }

  
 };
 
  const handlePrompt = (value:string) => {

      setPrompt(value);
  };


  const themeState:ThemeStateDto ={
    isDarkMode:isDark,
    toggleTheme: ()=> setIsDark((prev)=>!prev),
  };



  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#111" : "#fff";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isDark]);

  


  const themeColors:ThemeSettingsDto = {
    bgColor: isDark ? "bg-black" : "bg-white",
    bgCard: isDark ?  "bg-white" :"bg-black" ,
    fontColor: isDark ? "text-white" : "text-black",
    fontCard: isDark ? "text-black" : "text-white",

  }


  useEffect(()=>{
    //
    const backend_url = process.env.NEXT_PUBLIC_SERVER_URL || "";

    fetch(backend_url+"/list")
    .then((res) => res.json())
    .then((data: Record<string, string>) => {
      const formatted: CarouselPeople[] = Object.entries(data).map(
        ([_, value]) => ({
          image: (value as any).path,
          testPrompt: (value as any).testPrompt,
        })
      );
      setCelebs(formatted);
      console.log(formatted)

      setLoading(false)

    })
    .catch((err) => console.error(err));
  },[])

  return (
    <>
    <div className=" ">
    <NavBar themeState={themeState} themeColors={themeColors}/>

    <div className="min-h-[90vh] pt-20 flex flex-col justify-around align-middle items-center mb-1 ">
         
    <BigAutoCarousel
    theme={themeColors}
        images={loading?bs:celebs??bs }

      setPrompt={setPrompt}
      loading = {loading}
      />

<div>
          <h1 className={`${themeColors.fontColor} mt-2  mx-auto text-center text-2xl font-semibold  tracking-[0.3px] mb-2 `}>
          Try it out yourself !
          </h1>

          <SearchBar  prompt={prompt} handlePrompt={handlePrompt} theme={themeColors} smartSearch={smartSearch} />
          </div>
    </div>


    {/* FEED */}
    <div className="flex justify-center mb-10 min-h-[20vh]">

      <Feed theme={themeColors} people={findings ?? null}  />
      
    </div>

    <div className={`fixed bottom-0  w-full flex justify-center h-10 align-middle items-center ${themeColors.bgCard} `}>

      <h1 className={`${themeColors.fontCard} cursor-pointer underline w-full flex align-middle items-center justify-center`}
      onClick={() => window.open("https://www.linkedin.com/in/anatolii-postelnyk-940930233", "_blank")} 
      >
        Powered by Anatolii Postelnyk <PaperClipIcon className={`cursor-pointer h-5 ml-1`}  />
      </h1>

    </div>


    </div>
    </>
  );
}
