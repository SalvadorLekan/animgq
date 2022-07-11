import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  List,
  ListSubheader,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetAnimeQuery } from "../graphql/generated";
import sortByDate from "../util/sortByDate";
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
function ResultDisplay(props: Pick<ReturnType<typeof useGetAnimeQuery>, "data" | "error">) {
  const { data, error } = props;

  if (!data && !error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography variant="h3">{error.message}</Typography>
      </Box>
    );
  }
  const sortedData = sortByDate(data?.Page?.media?.filter(notEmpty) || []);
  if (!Object.keys(sortedData).length) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", py: 6, flexDirection: "column" }}>
        <Typography variant="h3">No data</Typography>
        <Typography>Search for something else or change the filters</Typography>
      </Box>
    );
  }
  return (
    <>
      {Object.keys(sortedData).map((date) => (
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
    </>
  );
}

export default ResultDisplay;
