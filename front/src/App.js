import Header from "./components/Header";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Browse from "./components/Browse";
import AddEdit from "./components/AddEdit";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    return (
        
        <Router>
            <div className="container">
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/upload">
                        <Upload />
                    </Route>
                    <Route path="/browse">
                        <Browse />
                    </Route>
                    <Route path="/addedit">
                        <AddEdit />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
