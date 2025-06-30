from flask import Flask, jsonify, request, abort, send_from_directory,send_file,make_response
from flask_cors import CORS
import os
import sys
import clip
import torch
from PIL import Image

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
#_CORE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
#print(_CORE_PATH)
_CELEB_PATH = os.path.join(os.path.dirname(__file__), 'celebrities')
print(_CELEB_PATH)
input()
#from talkToGemini import *

app = Flask(__name__)
_PORT = 5051

#_AI = FileToCaption()

# cloudflared tunnel --url http://localhost:5051

def handle_text_file(full_path_ref):
    directory = os.path.dirname(full_path_ref)
    filename_without_ext = os.path.splitext(os.path.basename(full_path_ref))[0]
    
    txt_path = os.path.join(directory, f"{filename_without_ext}.txt")

    if os.path.exists(txt_path):
  
        with open(txt_path, "r") as file:
            content = file.read()
        return content
    else:
        with open(txt_path, "w") as file:
            print("AI ONES AGAIN Not connected yet !")
            #text_to_save = _AI.getCaption(full_path_ref)
            #file.write(text_to_save)
        #return text_to_save
    

nams = 20
folders = []
for name in os.listdir(_CELEB_PATH):
    if nams == 0:
        break
    
    if os.path.isdir(os.path.join(_CELEB_PATH, name)):
        folders.append(name)
        nams-=1
print(folders)

images_pth=[]

celeb_path = {}
for ceb_fold in folders:    

    for f in os.listdir(os.path.join(_CELEB_PATH,ceb_fold)):
        if f.endswith(('.png', '.jpg', '.jpeg')):
            fold_ = os.path.join(_CELEB_PATH,ceb_fold)
            images_pth.append(os.path.join(fold_, f))
            if ceb_fold == "ap":
                continue
            if "reference" in f:
                full_path_ref =  os.path.join(fold_, f)
                parts = full_path_ref.split('/')
                result = '/'.join(parts[-2:])
                print('-'*40)
                capt = handle_text_file(full_path_ref)
                #print(f"CAPTION : {capt}")

                celeb_path[ceb_fold] = { 
                    "path" : "http://127.0.0.1:5051/images/"+result, 
                    "testPrompt":capt,
                }
print("{{{}}}"*20)
print(celeb_path)

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


image_embeddings = []
image_files = []

for path in images_pth:
    image = preprocess(Image.open(path)).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model.encode_image(image)
        embedding /= embedding.norm(dim=-1, keepdim=True)
    image_embeddings.append(embedding.cpu())
    image_files.append(path)

# Stack into a tensor
image_embeddings = torch.vstack(image_embeddings)


def search(query, top_k=5):
    with torch.no_grad():
        text = clip.tokenize([query]).to(device)
        text_features = model.encode_text(text)
        text_features /= text_features.norm(dim=-1, keepdim=True)

        similarities = (image_embeddings @ text_features.cpu().T).squeeze(1)
        best_indices = similarities.topk(top_k).indices
        best_values= similarities.topk(top_k).values

    pics = [image_files[i] for i in best_indices]
    print(best_values)



    search_data = {}
    for p in range(0,len(pics)):
    
        parts = pics[p].split('/')
        result = '/'.join(parts[-2:])
        
        parent_folder = os.path.basename(os.path.dirname(pics[p]))

        result = "/images/"+result
        search_data[result] = {"name":parent_folder}#,"similarity":best_values[p]}
        
    return search_data



@app.route('/images/<path:filename>')
def get_image(filename):
    #return send_from_directory(_CELEB_PATH, filename)
    response = make_response(send_from_directory(_CELEB_PATH, filename))
    response.headers['Cache-Control'] = 'public, max-age=31536000'  # 1 year
    return response

@app.route('/',methods=['GET'])
def listOfcelebs():
    return jsonify(celeb_path)


@app.route('/', methods=['POST'])
def searchWithAi():

    data = request.get_json()
    prompt = data.get('prompt', 'None')

    results = search(prompt)
    print(results)
    return results

if __name__ == '__main__':
    CORS(app)
    app.run(host='0.0.0.0', port=_PORT, debug=True)
