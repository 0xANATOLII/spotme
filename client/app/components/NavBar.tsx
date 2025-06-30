'use client'
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, MoonIcon, SunIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ThemeStateDto from "../DTOs/Theme-dto";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";
import Link from "next/link";

interface NavBarSpec {
    themeState:ThemeStateDto;
    themeColors:ThemeSettingsDto ;
}

const NavBar = ({themeState,themeColors}:NavBarSpec)=>{
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          setShowNavbar(false); 
        } else {
          setShowNavbar(true); 
        }
        setLastScrollY(window.scrollY);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);
  
    return (
      <nav
        className={`fixed top-0 left-0 w-full ${ themeColors.bgCard } shadow-md transition-transform duration-300 z-50 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

          <div className="text-xl font-bold " >
           
            <div className="relative w-30 h-10 flex justify-center items-center overflow-hidden">
               <Link href="/">
                { themeState.isDarkMode ? 
                <Image className="overflow-hidden" src="/logo.png" alt="Logo" width={200} height={200} />
                :
                <Image className="overflow-hidden" src="/inverted_logo.png" alt="Logo" width={200} height={200} />
                
                }   
                </Link>
                </div>
          </div>
  
 
          <div className="flex items-center space-x-4">
         {/*
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MagnifyingGlassIcon className={`h-6 w-6 ${themeColors.fontCard}`} />
            </button>
            */}

            <button className="p-2 hover:bg-gray-100 rounded-full">
                <Link href="/aboutme">
              <UserIcon className={`h-6 w-6 ${themeColors.fontCard}`} />
                </Link>
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full" onClick={themeState.toggleTheme}>
                { themeState.isDarkMode ?
                     <SunIcon className="h-6 w-6 text-gray-700" />
                    :
                    <MoonIcon className="h-6 w-6 text-white" />
                }
            </button>

         
          </div>
        </div>
      </nav>
    );
}

export default NavBar;