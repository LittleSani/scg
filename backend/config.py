# Expanded set of relationships
RELATIONSHIPS = ["on", "under", "inside", "left of", "right of", "wearing", "holding", "next to"]

# More detailed semantic likelihoods
SEMANTIC_LIKELIHOOD = {
    ("person", "horse"): ["on"],
    ("person", "car"): ["inside"],
    ("car", "road"): ["on"],
    ("person", "bicycle"): ["on"],
    ("bottle", "table"): ["on"],
    ("laptop", "table"): ["on"],
    ("cup", "table"): ["on"],
    ("person", "hat"): ["wearing"],
    ("person", "backpack"): ["wearing"],
    ("person", "handbag"): ["holding"],
    ("person", "suitcase"): ["holding"],
}
