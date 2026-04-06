import { CssBaseline } from "@mui/material";
import { AppProviders } from "@/app/providers/AppProviders";
import { AppRouter } from "@/app/router/AppRouter";

function App() {
  return (
    <AppProviders>
      <CssBaseline />
      <AppRouter />
    </AppProviders>
  );
}

export default App;
