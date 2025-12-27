from supabase import create_client, Client
import pandas as pd 
from clean_data import CleanNBAData
import numpy as np
from pathlib import Path

cwd = Path.cwd()

print(cwd)

url: str = 'https://mrqvyyymfqldnmzxmkmh.supabase.co'
key: str = 'sb_publishable_k1OMCjHx0QOduqAGl2eHqg_06yAqajD'
supabase: Client = create_client(url, key)

critical_columns = ['player', 'team', 'height_ft', 'age', 'pos', 'conference', 'division']

players_df = CleanNBAData().load_and_clean_data("sumitrodatta/nba-aba-baa-stats")
players_df_clean = players_df.dropna(subset=critical_columns)

players_data = players_df_clean.replace({np.nan: None}).to_dict(orient='records')

response = supabase.table("players").upsert(players_data).execute()

