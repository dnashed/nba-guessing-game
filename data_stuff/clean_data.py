from kaggle_dataset import KaggleNBADataset
import pandas as pd 
import json
import os
from pathlib import Path

class CleanNBAData:
    def __init__(self):
        self.kaggle_dataset = KaggleNBADataset()
    
    def load_and_clean_data(self, dataset_name: str) -> pd.DataFrame:
        data_path = self.kaggle_dataset.dataset_download("sumitrodatta/nba-aba-baa-stats")
        df1 = pd.read_csv(os.path.join(data_path, 'Advanced.csv'))
        df2 = pd.read_csv(os.path.join(data_path, 'Player Career Info.csv'))


        abbreviation_mapping = {
            'CHO': 'CHA',
            'BRK': 'BKN',
        }

        df1['team'] = df1['team'].replace(abbreviation_mapping)

        df1_current = df1[(df1['season'] == 2026) & (df1['lg'] == 'NBA') & (df1['team'] != '2TM')].copy()

        df1_current = df1_current.sort_values(by=['player_id', 'g'], ascending=[True, False])

        df1_current = df1_current.drop_duplicates(subset=['player_id'], keep='first')

        df2 = df2[['player_id', 'ht_in_in']]
        df2 = df2.drop_duplicates(subset=['player_id'])

        merged_df = pd.merge(df1_current, df2, left_on='player_id', right_on='player_id', how='inner')
        merged_df = merged_df[['player', 'player_id', 'team', 'age', 'pos', 'ht_in_in']]

        with open(Path(__file__).parent / 'nba_teams.json', 'r') as f:
            team_metadata = json.load(f)
        
        merged_df['conference'] = merged_df['team'].map(lambda abbr: team_metadata[abbr]['conference'] if abbr in team_metadata else None)
        merged_df['division'] = merged_df['team'].map(lambda abbr: team_metadata[abbr]['division'] if abbr in team_metadata else None)

        merged_df['height_ft'] = round(merged_df['ht_in_in'] / 12.0, 2)
        merged_df = merged_df.drop(columns=['ht_in_in'])

        print(merged_df)
        return merged_df    

CleanNBAData().load_and_clean_data("sumitrodatta/nba-aba-baa-stats")