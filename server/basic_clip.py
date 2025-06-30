import clip
import torch
from PIL import Image
import os
import os
import sys
import matplotlib.pyplot as plt
from PIL import Image


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
_CORE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
print(_CORE_PATH)
_CELEB_PATH = os.path.join(_CORE_PATH, 'celebrities')

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
for ceb_fold in folders:    
    for f in os.listdir(os.path.join(_CELEB_PATH,ceb_fold)):
        if f.endswith(('.png', '.jpg', '.jpeg')):
            fold_ = os.path.join(_CELEB_PATH,ceb_fold)
            images_pth.append(os.path.join(fold_, f))



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

    return [image_files[i] for i in best_indices]

prompt = input("Give me your prompt: ")

results = search(prompt)
print(results)
def show_images(image_paths, titles=None):
    import matplotlib.pyplot as plt
    from PIL import Image

    n = len(image_paths)
    plt.figure(figsize=(3 * n, 4))

    for i, path in enumerate(image_paths):
        img = Image.open(path)
        plt.subplot(1, n, i + 1)
        plt.imshow(img)
        plt.axis('off')
        if titles:
            plt.title(titles[i], fontsize=12)

    plt.tight_layout()
    plt.show()


show_images(results)

