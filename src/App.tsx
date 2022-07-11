import React, { useDeferredValue, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  List,
  ListSubheader,
  CircularProgress,
} from "@mui/material";
import { useGetAnimeQuery, MediaStatus, useGenresQuery } from "./graphql/generated";
import sortByDate from "./util/sortByDate";
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
function App() {
  const [search, setSearch] = useState("");
  const { data: genres } = useGenresQuery();
  const [genre, setGenre] = useState("All Genres");
  const [isAdult, setIsAdult] = useState<0 | 1 | "All Rating">("All Rating");
  const [status, setStatus] = useState<MediaStatus | "All">("All");
  const deferredSearch = useDeferredValue(search);
  const { loading, error, data } = useGetAnimeQuery({
    variables: {
      page: 1,
      perPage: 30,
      search: deferredSearch || undefined,
      isAdult: isAdult === "All Rating" ? undefined : Boolean(isAdult),
      status: status === "All" ? undefined : status,
      genre: genre === "All Genres" ? undefined : genre,
    },
  });
  const sortedData = sortByDate(data?.Page?.media?.filter(notEmpty) || []);
  return (
    <Container>
      <TextField
        label="Search"
        value={search}
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        helperText="Type at least three characters for best results..."
        margin="normal"
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <FormControl>
          <InputLabel id="Maturity">Maturity</InputLabel>
          <Select
            labelId="Maturity"
            id="dematur"
            value={isAdult}
            label="Maturity"
            onChange={(e) => setIsAdult(e.target.value as 0 | 1 | "All Rating")}>
            <MenuItem value="All Rating">All Rating</MenuItem>
            <MenuItem value={1}>Adult</MenuItem>
            <MenuItem value={0}>General</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="genres">Genres</InputLabel>
          <Select labelId="genres" id="dematur" value={genre} label="Genres" onChange={(e) => setGenre(e.target.value)}>
            <MenuItem value="All Genres">All Genres</MenuItem>
            {genres?.genres?.map((genre) => (
              <MenuItem value={genre!} key={genre!}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="Status">Status</InputLabel>
          <Select
            labelId="Status"
            id="destatus"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as MediaStatus | "All")}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value={MediaStatus.Releasing}>{MediaStatus.Releasing}</MenuItem>
            <MenuItem value={MediaStatus.Cancelled}>{MediaStatus.Cancelled}</MenuItem>
            <MenuItem value={MediaStatus.Finished}>{MediaStatus.Finished}</MenuItem>
            <MenuItem value={MediaStatus.NotYetReleased}>{MediaStatus.NotYetReleased.replaceAll("_", " ")}</MenuItem>
            <MenuItem value={MediaStatus.Hiatus}>{MediaStatus.Hiatus}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <Typography variant="h3">{error.message}</Typography>
        </Box>
      )}
      {data &&
        Object.keys(sortedData).map((date) => (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              "& ul": { padding: 0 },
            }}
            subheader={<li />}>
            <li key={date}>
              <ListSubheader>{date}</ListSubheader>
              {sortedData[date as keyof typeof sortedData].map((anime) => (
                <Card
                  key={anime!.id}
                  sx={{
                    mb: 2,
                    display: "grid",
                    "@media (min-width: 600px)": {
                      gridTemplateColumns: "200px 1fr",
                    },
                  }}
                  raised>
                  <CardMedia
                    sx={{
                      backgroundColor: anime!.coverImage?.color,
                      minHeight: "200px",
                    }}
                    component="img"
                    src={anime!.coverImage?.large || ""}
                  />
                  <Box>
                    <CardHeader title={anime!.title?.romaji || ""} />
                    <CardContent>
                      <Typography>{anime!.description?.replace(/<[^>]*>?/gm, "") || ""}</Typography>
                      <Chip label={anime!.type || ""} />
                      <Box my={2} display="flex" gap={2} flexWrap="wrap">
                        {anime!.genres?.map((genre) => (
                          <Chip key={genre} label={genre} />
                        ))}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </li>
          </List>
        ))}
    </Container>
  );
}

export default App;
