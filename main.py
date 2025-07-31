
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

sentence_a = "How do I make pancakes?"
sentence_b = "What is the process to cook pancakes?"


embeddings = model.encode([sentence_a, sentence_b])
similarity = util.cos_sim(embeddings[0], embeddings[1])
print("Similarity score:", similarity)