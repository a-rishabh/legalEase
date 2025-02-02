import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyBqPCUXQcPMLI9BMXi_nTMPyylZa8uqSgY")  # Replace with your actual API key

# Create a model instance
model = genai.GenerativeModel("gemini-1.5-flash")

# Generate content
response = model.generate_content("Explain how AI works")

# Print the response
print(response.text)