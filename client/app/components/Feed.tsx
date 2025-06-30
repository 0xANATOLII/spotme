import { useEffect } from "react";
import ThemeSettingsDto from "../DTOs/Theme-settings.dto";
import CarouselCard from "./Card";
import CarouselPeople from "../DTOs/CarouselPeople";
import CardPeople from "../DTOs/CardPeople";



interface FeedParams{
theme:ThemeSettingsDto;
people:CardPeople[] | null;
}
const Feed = ({theme,people}:FeedParams) =>{


    //upon requst gon searhc
    useEffect(()=>{
        console.log(people);
    },[people])

    if(!people)
        return(<>
        <div className={`mt-5 text-xs ${theme.fontColor}`}>
        Searched people will appeare here !
      
        </div>
        </>)


    return (
        <>
        <div className="flex flex-col w-full justify-center align-middle items-center">
        <h1 className="text-3xl mb-5 text-center">
            People were found :
            <div className="text-xs text-center text-gray-400 ">
            Some people might appear more than once
            </div>
        </h1>
        {people.map((item, index) => (
        <CarouselCard key={index} theme={theme} title={item.name} optionalValue={(index+1)+'/'+people.length} images={[item.image]} />
        ))}
        </div>

        
        </>
    )
}

export default Feed;