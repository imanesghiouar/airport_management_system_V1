import pandas as pd
import json

# 1. Load your training data
# Using train.csv as it contains the full list of labels
df = pd.read_csv('train.csv')

# 2. Extract unique pairs of Label and Class
# We sort by Labels to keep the JSON organized
mapping_df = df[['Labels', 'Classes']].drop_duplicates().sort_values('Labels')

# 3. Create the dictionary
# Note: JSON keys must be strings, so we convert the numeric Label
mapping = {str(row['Labels']): row['Classes'] for _, row in mapping_df.iterrows()}

# 4. Save to mapping.json
with open('class_mapping.json', 'w') as f:
    json.dump(mapping, f, indent=4)

print("✅ mapping.json has been created successfully!")
print(f"Total classes found: {len(mapping)}")