import React from "react";

import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const ParametersForm = () => {
  const [age, setAge] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const navigate = useNavigate();

  return (
    <Grid2 container spacing={2} direction={"column"}>
      <Grid2>
        <Typography variant="h4">Paramètres</Typography>
      </Grid2>
      <Grid2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Basic date picker" />
        </LocalizationProvider>
      </Grid2>
      <Grid2>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Niveau de précision
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={age}
            onChange={handleChange}
            label="Niveau de précision"
          >
            <MenuItem value={75}>Soixante-quinze</MenuItem>
            <MenuItem value={80}>Quatre vingt</MenuItem>
            <MenuItem value={95}>Quatre vinght quinze</MenuItem>
          </Select>
        </FormControl>
      </Grid2>
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/location");
          }}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            alert("Implement next page pls");
          }}
        >
          Lancer le calcul
        </Button>
      </Stack>
    </Grid2>
  );
};

export default ParametersForm;
