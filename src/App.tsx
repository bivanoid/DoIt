import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login/Login";
import { useSession } from "./session/useSession";
function App() {
	const { session, loading } = useSession();

	if (loading) return null; // atau tampilan loading

	if (!session) return <Login />;
	return <Dashboard />;
}

export default App;
