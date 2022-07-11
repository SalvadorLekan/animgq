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
} from "@mui/material";
import { useGetAnimeQuery, MediaStatus } from "./graphql/generated";

function App() {
  const [search, setSearch] = useState("");
  const [isAdult, setIsAdult] = useState<0 | 1 | "All">("All");
  const [status, setStatus] = useState<MediaStatus | "All">("All");
  const deferredSearch = useDeferredValue(search);
  const { loading, error, data } = useGetAnimeQuery({
    variables: {
      page: 1,
      perPage: 30,
      search: deferredSearch || undefined,
      isAdult: isAdult === "All" ? undefined : Boolean(isAdult),
      status: status === "All" ? undefined : status,
    },
  });
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
      <Box sx={{ minWidth: 120 }}>
        <FormControl>
          <InputLabel id="Maturity">Maturity</InputLabel>
          <Select
            labelId="Maturity"
            id="dematur"
            value={isAdult}
            label="Maturity"
            onChange={(e) => setIsAdult(e.target.value as 0 | 1 | "All")}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value={1}>Adult</MenuItem>
            <MenuItem value={0}>General</MenuItem>
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
      {loading && <div>Loading...</div>}
      {error && <div>Error :(</div>}
      {data?.Page?.media
        ?.filter((anime) => Boolean(anime))
        .map((anime) => (
          <Card
            key={anime!.id}
            sx={{
              my: 2,
              display: "grid",
              "@media (min-width: 600px)": {
                gridTemplateColumns: "200px 1fr",
              },
              maxWidth: "65rem",
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
            <Box minWidth={"300px"} flex="1" maxWidth="100%">
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
    </Container>
  );
}

export default App;
