import { useEffect, useState } from "react";
import ThemeStateDto from "../DTOs/Theme-dto";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";
import { BarsArrowUpIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import styles from './search.module.css';

interface SearchProp {
    prompt: string;
    handlePrompt: (value: string) => void;
    theme:ThemeSettingsDto;
    smartSearch:()=>void;
  }

const SearchBar = ( { prompt, handlePrompt,theme,smartSearch}:SearchProp ) =>{


    useEffect(() => {
    
      }, [theme.bgColor]);

    const [bigPrompt,setBigPrompt] = useState<boolean>(false);
    const threashhold = 50
    const word_limit = 250
    useEffect(()=>{
        setBigPrompt((prev)=> (prompt.length>threashhold))
    },[prompt])

    return(
        <>

            <div className={`${styles.box_shd_black}  p-3 w-90 ${bigPrompt?'min-h-32':''} ${theme.bgCard} rounded-3xl`}>

                <div className={` flex flex-row justify-between align-middle ${bigPrompt?'min-h-32':''} `}>


                                <textarea
                                className={`
                                    appearance-none border-none outline-none bg-transparent p-0 m-0 focus:ring-0
                                    text-xl ${theme.fontCard} w-full mr-2
                                    placeholder-gray-400
                                    `}
                                placeholder="Describe me a person ...."
                                maxLength={word_limit}
                                value={prompt}
                                onChange={(e) => handlePrompt(e.target.value)}
                                />

            <div className="flex justify-end">
        <button className={`flex justify-center align-middle items-center ${theme.bgColor} rounded-full h-12 w-12`}
        onClick={()=>{
            smartSearch();
        }}
        >
            
        <BarsArrowUpIcon className={`h-[90%] w-[90%] m-2  ${theme.fontColor} `} />
        </button>

        </div>

                </div>


                    { (prompt.length>=word_limit) ? 
                     <h1 className="text-red-400 text-center text-xs font-semibold">
                        Limit was reached
                        </h1>: null

                    }
            </div>
        
        
        </>
    )
}

export default SearchBar;