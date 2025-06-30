from google import genai
import os
import json

import shutil

dev =True
clean_ = True
class FileToCaption:
    def __init__(self):
        api_key = "AIzaSyCAg4F9hlfPhVJy7yoOf0-FiRbhmFBKgGU"
        self.client =  genai.Client(api_key=api_key)
        self.temp_imgs = None
        self.currentPicture = None
        self.celeb_file = "loaded_names.txt"


        self.celebs = self.get_names_4m_file()
        if self.celebs is None:
            self.celebs = []




    def getFilesInDir(self, test_images_dir="testImages"):
        self.temp_imgs  = [os.path.join(test_images_dir, file) for file in os.listdir(test_images_dir) if os.path.isfile(os.path.join(test_images_dir, file))]
        return self.temp_imgs
    
    def setCurrentPicture(self,path="defo"):
        if path == "defo":
            if self.temp_imgs != None and len(self.temp_imgs) != 0:
                
                flag = True
                ind = 0
                while(flag):
                    if ind == len(self.temp_imgs):
                        ind = 0
                    

                    print(f"This #{ind} file is about to be uploaded:\n{self.temp_imgs[ind]}")
                    out = input("Procceed >") 
                    if out == "s":
                        self.currentPicture =self.temp_imgs[ind]
                        print(f"New current file is : {self.currentPicture}")
                        break

                    if out =="ex":
                        flag = False
                        break
                    
                    ind +=1
            else:
                print("Nothinbg to set !")
        else:
            if not os.path.isfile(path):
                
                print("Given path doesnt exist !")
                return 
            else:
                self.currentPicture = path
                print(f"new file is : {self.currentPicture} ")
    
    def getCaption(self,path,prompt="Caption this image. Try to make as accurate caption as possible with explanation of each slight detail about a person. Describe how person looks like, what is wearing and doing. Very importan if there is not human on the picture return simpl NONE. Dont add any extra words just caption and please make it as short as 240chars"):
        my_file = self.client.files.upload(file=path)

        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[my_file, prompt],
        )

        print(response.text)
        return response.text
    
    def getCaptions(self,file_pathes,prompt="Caption this image just with a cuption dont add any additional text like ,,Here is a detailed caption,, and etc, just caption! Try to make as accurate caption as possible with explanation of each slight detail about a person. Describe how person looks like, what is wearing and doing. Very importan if there is not human on the picture return simpl NONE."):
    
        response_arr = {}

        ind = 1

        for fp in file_pathes:
            my_file = self.client.files.upload(file=fp)
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[my_file, prompt],
            )


            response_arr[fp] = response.text
            print(f"{ind}/{len(file_pathes)} done AI caption")
            ind+=1


        return response_arr
    
    # Makes a request to ask for the celebrities and returns an array of new celebrities that are not in the mainself.celeb
    def getCelebsArray(self):
        prompt = f"Give me a valid python array so i can just copy and paste your reply of first name and last name of modern celebrityes of the size 10. I want to use your output to save it as json array. So you should just reply as an array of strings. give me celebrities that are not in this array {self.celebs} "
        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
        )
        str_output = response.text
        if dev and not clean_:
            
            print(str_output)
            if input("dev check ? 0=denie ") == "0":
                return 
           
         

        str_output = extract_between_brackets(str_output)
        if dev and not clean_:
            print("-"+str_output+"-")


            if input("dev check cleaned up? 0=denie ") == "0":
                    return 

            print()

        return self.appendValidCelebs(str_output)
    def arrayValid(self,s):
        s = s.strip()
        if not s.startswith("[") or not s.endswith("]"):
            return False
        try:
            elements = s[1:-1].split(",")
            for el in elements:
                el = el.strip()
                if len(el) < 2 or el[0] != '"' or el[-1] != '"':
                    return False
            return True
        except:
            return False
    def appendValidCelebs(self,s):
        if not self.arrayValid(s):
            print("No celebs were added due to invalid array")
            return
        


        s = s.replace("\n","")
        mb_cebs = json.loads(s)
       

        added = 0
        final_array = []
        if dev and clean_:
            print(f"mb celeb : {mb_cebs}")
            print(f"main celebs : {self.celebs}")

        for l in mb_cebs:

            if l.lower()  not in self.celebs:
                self.celebs.append(l.lower())
                final_array.append(l.lower())
                added +=1
        print(f"{added} out of {len(mb_cebs)} were added")
        return final_array
    def get_names_4m_file(self,dest = "loaded"):
        print("LOADING !")
        
        full_path = os.path.join(dest, self.celeb_file)

        return load_array_from_file(full_path)
    def saveArray(self,dest = "loaded"):
        full_path = os.path.join(dest, self.celeb_file)
        save_array_to_file(self.celebs,full_path)
    def move_(self,path,dest="loaded"):
        shutil.move(path, dest)


#https://www.google.com/search?q=Sarah+Snyder

def extract_between_brackets(s):
    start = s.find('[')-1
    end = s.find(']')+1
    if start != -1 and end != -1 and start < end:
        return s[start:end]
    return "" 

def save_array_to_file(array, filename):
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(array, f)

def load_array_from_file(filename):
   
    path_toFile = os.path.join(os.path.dirname(__file__),filename)

    if not os.path.exists(path_toFile) or os.path.getsize(path_toFile) == 0:
        print("NONE NAMES WERE LOADEED")
        return []
    with open(path_toFile, "r", encoding="utf-8") as f:
        return json.load(f)