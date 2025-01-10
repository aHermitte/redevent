import React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

//Parameters needed:
// - Date
// - Time
// - Weather
// - Traffic
// - Light
// - Road type
// - GPS Coordinates

const ParametersForm = () => {
  const [age, setAge] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 5, lg: 80 }}
          container
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          sx={{ fontSize: "12px" }}
        >
          <Item>Redevent: Parametrage de la prédiction</Item>
          <Button
            variant="text"
            onClick={() => {
              alert("T'as besoin d'aide ? Dommage.");
            }}
          >
            ?
          </Button>
        </Grid>
        <Grid container spacing={4} size={{ xs: 12, md: 7, lg: 8 }}>
          <Grid size={{ xs: 6, lg: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Basic date picker" />
              <TimePicker label="Basic time picker" ampm={false} />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 6, lg: 3 }}></Grid>
          <Grid size={{ xs: 6, lg: 3 }}>
            <Item>
              <Box
                id="category-c"
                sx={{ fontSize: "12px", textTransform: "uppercase" }}
              >
                Input
              </Box>
              <Box aria-labelledby="category-c" sx={{ pl: 2 }}>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={age}
                    onChange={handleChange}
                  >
                    <MenuItem value={75}>Soixante-quinze</MenuItem>
                    <MenuItem value={80}>Quatre vingt</MenuItem>
                    <MenuItem value={95}>Quatre vinght quinze</MenuItem>
                  </Select>
              </Box>
            </Item>
          </Grid>
          <Grid size={{ xs: 6, lg: 3 }}>
            <Item>
              <Box
                id="category-d"
                sx={{ fontSize: "12px", textTransform: "uppercase" }}
              >
                Autres
              </Box>
              <Box component="ul" aria-labelledby="category-d" sx={{ pl: 2 }}>
                <li>Param 1</li>
                <li>Param 2</li>
                <li>Param 3</li>
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          sx={{ fontSize: "12px" }}
          size={12}
        >
          <Grid sx={{ order: { xs: 2, sm: 1 } }}>
            <Item>© Copyright</Item>
          </Grid>
          <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
            <Grid>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/location");
                }}
              >
                Retour
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                onClick={() => {
                  alert("Implement next page pls");
                }}
              >
                Lancer le calcul
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    //  <Grid2 container spacing={2} direction={"column"}>
    //    <Grid2>
    //      <Typography variant="h4">Paramètres</Typography>
    //    </Grid2>
    //    <Grid2>
    //      <LocalizationProvider dateAdapter={AdapterDayjs}>
    //        <DatePicker label="Basic date picker" />
    //      </LocalizationProvider>
    //    </Grid2>
    //    <Grid2 direction={"column"}>
    //      <LocalizationProvider dateAdapter={AdapterDayjs}>
    //        <TimePicker label="Basic time picker" ampm={false} />
    //      </LocalizationProvider>
    //      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
    //        <InputLabel id="demo-simple-select-standard-label">
    //          Niveau de précision
    //        </InputLabel>
    //        <Select
    //          labelId="demo-simple-select-standard-label"
    //          id="demo-simple-select-standard"
    //          value={age}
    //          onChange={handleChange}
    //          label="Niveau de précision"
    //        >
    //          <MenuItem value={75}>Soixante-quinze</MenuItem>
    //          <MenuItem value={80}>Quatre vingt</MenuItem>
    //          <MenuItem value={95}>Quatre vinght quinze</MenuItem>
    //        </Select>
    //      </FormControl>
    //      <FormControlLabel
    //        control={<Checkbox defaultChecked />}
    //        label="Calculer le temps de trajet"
    //      />
    //    </Grid2>
    //    <Stack spacing={2} direction="row">
    //      <Button
    //        variant="outlined"
    //        onClick={() => {
    //          navigate("/location");
    //        }}
    //      >
    //        Retour
    //      </Button>
    //      <Button
    //        variant="contained"
    //        onClick={() => {
    //          alert("Implement next page pls");
    //        }}
    //      >
    //        Lancer le calcul
    //      </Button>
    //    </Stack>
    //  </Grid2>
  );
};

export default ParametersForm;
