from supabase import create_client, Client
import pandas as pd 
from clean_data import CleanNBAData
import numpy as np
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

url: str = os.getenv('SUPABASE_URL')
key: str = os.getenv('SUPABASE_SERVICE_KEY')

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set")

supabase: Client = create_client(url, key)

critical_columns = ['player', 'team', 'height_ft', 'age', 'pos', 'conference', 'division']

print("Fetching and cleaning NBA player data...")
players_df = CleanNBAData().load_and_clean_data("sumitrodatta/nba-aba-baa-stats")
players_df_clean = players_df.dropna(subset=critical_columns)

players_data = players_df_clean.replace({np.nan: None}).to_dict(orient='records')

print(f"Found {len(players_data)} players to upload")

# clear existing data
print("Clearing existing player data...")
supabase.table("players").delete().neq("player_id", "").execute()

# upload new data
print("Uploading new player data to Supabase...")
response = supabase.table("players").insert(players_data).execute()

print(f"Successfully uploaded {len(players_data)} players!")
print(f"Timestamp: {response}")

