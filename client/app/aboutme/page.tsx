'use client'
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ThemeStateDto from "../DTOs/Theme-dto";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";

export default function Page() {
    const [isDark,setIsDark] = useState<boolean>(true);


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


    
    return(
        <>
        <NavBar themeColors={themeColors} themeState={themeState} />
        <div className="h-screen flex flex-col justify-center align-middle items-center ">

  
        <h1 className={`text-center ${themeColors.fontColor} `}>
            This is MVP version of the website.
            <br />
            Updates are coming !
        </h1>
       <h1 className={`text-3xl mt-5 text-center ${themeColors.fontColor} `}>
        ANATOLII POSTELNYK!
        
        </h1> 

        <div className="text-xs text-center text-gray-400 mt-5">
            P.S You can find me there !
            <br />
            Good Luck !
            </div>

        </div>
        
        </>
    )
}