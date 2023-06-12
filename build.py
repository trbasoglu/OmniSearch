import json
import string
import shutil
import os 

def modify_manifest(letter:str):
    fp = open("src/manifest.json","r")
    manifest_json = json.load(fp)
    fp.close()
    manifest_json["name"] = f"OmniSearch({letter})"
    manifest_json["omnibox"]["keyword"] = letter
    manifest_json["description"] = f"Search on fav website using the '{letter}' keyword"
    fp = open(f"build/{letter}/manifest.json","w")
    json.dump(manifest_json,fp)
    fp.close()

def create_build(letter:str):
    if not os.path.exists("build"):
        os.mkdir("build")  
    shutil.copytree("src", f"build/{letter}/")
    modify_manifest(letter)
    shutil.make_archive(f"build/OmniSearchFor_{letter}","zip",f"build/{letter}")
    shutil.rmtree(f"build/{letter}")
    
if __name__ == "__main__":
    for letter in list(string.ascii_lowercase):
        create_build(letter)