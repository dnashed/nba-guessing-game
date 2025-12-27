import os 
import kagglehub
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

class KaggleNBADataset:
    def __init__(self):
        self.api_token = os.getenv('NBA_TOKEN')
        if not self.api_token:
            raise ValueError("NBA_TOKEN environment variable not set.")
        
    def dataset_download(self, dataset_name: str):
        path = kagglehub.dataset_download("sumitrodatta/nba-aba-baa-stats")
        return path

