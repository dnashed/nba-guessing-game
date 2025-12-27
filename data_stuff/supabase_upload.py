from supabase import create_client, Client
import pandas as pd 
from clean_data import CleanNBAData
import numpy as np
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

cwd = Path.cwd()
print(cwd)

url: str = os.getenv('SUPABASE_URL')
key: str = os.getenv('SUPABASE_KEY')

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

supabase: Client = create_client(url, key)

critical_columns = ['player', 'team', 'height_ft', 'age', 'pos', 'conference', 'division']

players_df = CleanNBAData().load_and_clean_data("sumitrodatta/nba-aba-baa-stats")
players_df_clean = players_df.dropna(subset=critical_columns)

players_data = players_df_clean.replace({np.nan: None}).to_dict(orient='records')

response = supabase.table("players").upsert(players_data).execute()

