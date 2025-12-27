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
        # i mean yah id wanna merge these two...prob sort them first then merge right? 
        # well, what data do i actually want? 
        # i want: NAME, TEAM, CONFERENCE, DIVISION, HEIGHT, AGE, POSITION 
        # so from Advanced, we take player, team, x, x, x, age, x, pos 
        # from Player Career Info, we take ht_in_in (prob convert this) and wt (in pounds i think)
        # seems kinda hard to find CONFERENCE, DIVISION...maybe let's just make a static one since it rarely, if ever, changes...
        # also need a way to filter for ONLY CURRENT PLAYERS
        # prob in ADVANCED, just filter so that season is equal to a certain number (2026 in our case) and lg is equal to NBA
        # now i just need to get the NUMBER + HEIGHT
        
        # Example cleaning steps


        df1_current = df1[(df1['season'] == 2026) & (df1['lg'] == 'NBA') & (df1['team'] != '2TM')].copy()

        df1_current = df1_current.sort_values(by=['player_id', 'g'], ascending=[True, False])

        df1_current = df1_current.drop_duplicates(subset=['player_id'], keep='first')

        df2 = df2[['player_id', 'ht_in_in']]
        df2 = df2.drop_duplicates(subset=['player_id'])

        # Merge the dataframes on a common column (assuming 'Player' is the common column)
        merged_df = pd.merge(df1_current, df2, left_on='player_id', right_on='player_id', how='inner')
        merged_df = merged_df[['player', 'player_id', 'team', 'age', 'pos', 'ht_in_in']]

        # ok now that we have our json, we need to add the conference/division stuff 
        with open(Path(__file__).parent / 'nba_teams.json', 'r') as f:
            team_metadata = json.load(f)
        
        merged_df['conference'] = merged_df['team'].map(lambda abbr: team_metadata[abbr]['conference'] if abbr in team_metadata else None)
        merged_df['division'] = merged_df['team'].map(lambda abbr: team_metadata[abbr]['division'] if abbr in team_metadata else None)

        # good, now all we need to do is convert the height from inches to feet + inches

        # whats the best way to do this?

        merged_df['height_ft'] = round(merged_df['ht_in_in'] / 12.0, 2)
        merged_df = merged_df.drop(columns=['ht_in_in'])

        print(merged_df)
        return merged_df    

CleanNBAData().load_and_clean_data("sumitrodatta/nba-aba-baa-stats")