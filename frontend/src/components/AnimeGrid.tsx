import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface Anime {
  MAL_ID: number;
  Name: string;
  Score: string;
  Genres: string;
  anger: number;
  disgust: number;
  fear: number;
  sadness: number;
  happiness: number;
  neutral: number;
  surprise: number;
  sypnopsis?: string;
}

interface AnimeGridProps {
  searchQuery: string;
  selectedGenres: string[];
}

const AnimeGrid = ({ searchQuery, selectedGenres }: AnimeGridProps) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/anime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: searchQuery,
            genres: selectedGenres,
          }),
        });
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [searchQuery, selectedGenres]);

  const getEmotionData = (anime: Anime) => [
    { subject: 'Anger', A: anime.anger * 100 },
    { subject: 'Disgust', A: anime.disgust * 100 },
    { subject: 'Fear', A: anime.fear * 100 },
    { subject: 'Sadness', A: anime.sadness * 100 },
    { subject: 'Happiness', A: anime.happiness * 100 },
    { subject: 'Neutral', A: anime.neutral * 100 },
    { subject: 'Surprise', A: anime.surprise * 100 },
  ];

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {animeList.map((anime) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={anime.MAL_ID}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              onClick={() => setSelectedAnime(anime)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {anime.Name}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Rating
                    value={parseFloat(anime.Score) || 0}
                    precision={0.5}
                    readOnly
                    max={10}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {anime.Score !== 'Unknown' ? `Score: ${anime.Score}` : 'Score: N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {anime.Genres.split(', ').map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getEmotionData(anime)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Emotions"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!selectedAnime} onClose={() => setSelectedAnime(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedAnime?.Name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedAnime?.sypnopsis || 'No description available.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAnime(null)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnimeGrid; 