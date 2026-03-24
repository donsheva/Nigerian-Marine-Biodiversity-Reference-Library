import json
from pathlib import Path

project_folder = Path("Nigeria_Marine_Biodiversity_Reference_Library")
data_folder = project_folder / "data"
data_folder.mkdir(parents=True, exist_ok=True)

species_file = data_folder / "species_database.json"

species_list = []

# Helper function
def add_species(id, sci, common, group, habitat, location, iucn, markers):
    species_list.append({
        "id": id,
        "scientific_name": sci,
        "common_name": common,
        "group": group,
        "habitat": habitat,
        "location": location,
        "endemism": "Gulf of Guinea",
        "iucn_status": iucn,
        "markers": markers,
        "sequence_available": False,
        "ncbi_accession": "",
        "bold_id": "",
        "image": "",
        "notes": ""
    })

# Fish
add_species(1,"Ethmalosa fimbriata","Bonga shad","Fish","Lagoon","Lagos Lagoon","LC",["12S","COI"])
add_species(2,"Pseudotolithus typus","Longneck croaker","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(3,"Pseudotolithus elongatus","Cassava croaker","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(4,"Lutjanus goreensis","Gorean snapper","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(5,"Pteroscion peli","Boe drum","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(6,"Sardinella aurita","Round sardinella","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(7,"Sardinella maderensis","Madeiran sardinella","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(8,"Caranx hippos","Crevalle jack","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(9,"Scomberomorus tritor","West African Spanish mackerel","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])
add_species(10,"Trachinotus teraia","African pompano","Fish","Marine","Gulf of Guinea","LC",["12S","COI"])

# Macrobenthos
add_species(50,"Tympanotonos fuscatus","Mangrove periwinkle","Gastropod","Mangrove","Niger Delta","LC",["COI"])
add_species(51,"Pachymelania aurita","Mangrove snail","Gastropod","Mangrove","Lagos Lagoon","LC",["COI"])
add_species(52,"Callinectes amnicola","Lagos lagoon crab","Crustacean","Estuarine","Lagos Lagoon","LC",["COI"])
add_species(53,"Uca tangeri","Fiddler crab","Crustacean","Intertidal","Gulf of Guinea","LC",["COI"])
add_species(54,"Crassostrea gasar","Mangrove oyster","Bivalve","Mangrove","Niger Delta","LC",["COI"])
add_species(55,"Tagelus adansonii","Razor clam","Bivalve","Estuarine","Gulf of Guinea","LC",["COI"])

# Meiofauna
add_species(100,"Halalaimus sp.","Free living nematode","Nematode","Sediment","Lagos Lagoon","DD",["18S"])
add_species(101,"Enoplus sp.","Marine nematode","Nematode","Sediment","Gulf of Guinea","DD",["18S"])
add_species(102,"Chromadorita sp.","Marine nematode","Nematode","Sediment","Lagos Lagoon","DD",["18S"])
add_species(103,"Oncholaimus sp.","Predatory nematode","Nematode","Sediment","Niger Delta","DD",["18S"])

# Marine mammals
add_species(200,"Trichechus senegalensis","African manatee","Mammal","Lagoon","Lagos Lagoon","VU",["COI"])
add_species(201,"Sousa teuszii","Atlantic humpback dolphin","Mammal","Marine","Gulf of Guinea","CR",["COI"])

# Sea turtles
add_species(250,"Chelonia mydas","Green sea turtle","Turtle","Marine","Gulf of Guinea","EN",["COI"])
add_species(251,"Eretmochelys imbricata","Hawksbill turtle","Turtle","Marine","Gulf of Guinea","CR",["COI"])

# Save database
with open(species_file,"w") as f:
    json.dump(species_list,f,indent=4)

print("Species database created successfully.")
print(f"Total species: {len(species_list)}")
print(f"Location: {species_file}")