import { useState } from 'react'
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Box,
  Typography,
  Button
} from '@mui/material'
import SearchBar from './components/SearchBar'
import GenreFilter from './components/GenreFilter'
import AnimeGrid from './components/AnimeGrid'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
})

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const handleSearch = () => {
    setSearchQuery(searchInput)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Anime Recommender
          </Typography>
          
          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <SearchBar 
              value={searchInput}
              onChange={setSearchInput}
              onKeyDown={handleInputKeyDown}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ height: 56 }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <GenreFilter
              selectedGenres={selectedGenres}
              onChange={setSelectedGenres}
            />
          </Box>

          <AnimeGrid 
            searchQuery={searchQuery}
            selectedGenres={selectedGenres}
          />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
