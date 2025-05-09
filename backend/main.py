from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
import os
from dotenv import load_dotenv
import logging
from langchain_core.documents import Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the anime data
try:
    anime = pd.read_csv('anime_with_emotions.csv')
    logger.info(f"Loaded anime data with {len(anime)} entries")
except FileNotFoundError:
    raise Exception("anime_with_emotions.csv not found. Please make sure the file exists in the backend directory.")

# Initialize the vector database
try:
    # Load the tagged synopses, one document per line
    logger.info("Loading tagged synopses...")
    with open('tagged_syn.txt', encoding='utf-8') as f:
        lines = f.readlines()
    documents = [Document(page_content=line.strip()) for line in lines if line.strip()]
    logger.info(f"Loaded {len(documents)} documents")
    
    # Create the vector database
    logger.info("Creating vector database...")
    db_anime = Chroma.from_documents(
        documents,
        embedding=OpenAIEmbeddings()
    )
    logger.info("Vector database created successfully")
except Exception as e:
    logger.error(f"Failed to initialize vector database: {str(e)}")
    raise Exception(f"Failed to initialize vector database: {str(e)}")

class SearchRequest(BaseModel):
    query: Optional[str] = None
    genres: Optional[List[str]] = None

def get_recommendations(query: str, top_k: int = 10) -> pd.DataFrame:
    """Get anime recommendations based on a text query."""
    try:
        logger.info(f"Getting recommendations for query: {query}")
        # Get similar documents from the vector database
        recs = db_anime.similarity_search(query, k=50)
        logger.info(f"Found {len(recs)} similar documents")
        
        # Extract MAL IDs from the recommendations
        anime_list = []
        for i in range(0, len(recs)):
            try:
                mal_id = int(recs[i].page_content.strip('"').split()[0])
                anime_list.append(mal_id)
            except (ValueError, IndexError) as e:
                logger.warning(f"Failed to parse MAL ID from document: {recs[i].page_content[:100]}...")
                continue
        
        logger.info(f"Extracted {len(anime_list)} MAL IDs")
        
        # Get the anime data for the recommended IDs
        recommendations = anime[anime["MAL_ID"].isin(anime_list)].head(top_k)
        logger.info(f"Returning {len(recommendations)} recommendations")
        return recommendations
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@app.post("/api/anime")
async def search_anime(request: SearchRequest):
    filtered_df = anime.copy()
    
    # Filter by genres if provided
    if request.genres and len(request.genres) > 0:
        genre_mask = filtered_df['Genres'].apply(
            lambda x: any(genre in x for genre in request.genres)
        )
        filtered_df = filtered_df[genre_mask]
    
    # Get recommendations if query is provided
    if request.query:
        try:
            recommendations = get_recommendations(request.query)
            # Merge with genre filtered results if genres were provided
            if request.genres and len(request.genres) > 0:
                recommendations = recommendations[recommendations['MAL_ID'].isin(filtered_df['MAL_ID'])]
            filtered_df = recommendations
        except Exception as e:
            logger.error(f"Error processing recommendations: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing recommendations: {str(e)}")
    
    # Convert to list of dictionaries
    results = filtered_df.head(20).to_dict('records')
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 