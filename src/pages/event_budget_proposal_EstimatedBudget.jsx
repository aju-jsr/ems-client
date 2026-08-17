import {
  Grid,
  Button,
  TextField
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import SectionCard from "../components/SectionCard";

export default function EstimatedBudget() {
  return (
    <SectionCard title="Estimated Budget">

      <Grid container spacing={3}>

        <Grid item xs={12} md={8}>
          <TextField
            multiline
            rows={4}
            label="Details"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            label="Amount"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Budget
          </Button>
        </Grid>

      </Grid>

    </SectionCard>
  );
}