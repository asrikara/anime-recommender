import { useState } from 'react';
import {
  Paper,
  Typography,
  Chip,
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';

// Common anime genres
const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
  'Supernatural', 'Thriller', 'Psychological', 'Demons', 'Magic',
  'Military', 'Music', 'Parody', 'Police', 'School', 'Shounen',
  'Shoujo', 'Seinen', 'Josei', 'Space', 'Vampire'
];

interface GenreFilterProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

const GenreFilter = ({ selectedGenres, onChange }: GenreFilterProps) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filter by Genres
      </Typography>
      
      <Autocomplete
        multiple
        options={GENRES}
        value={selectedGenres}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select genres..."
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
            />
          ))
        }
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
    </Paper>
  );
};

export default GenreFilter; 