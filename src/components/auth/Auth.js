import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignInAdmin from "./SignInAdmin";
import SignUp from "./SignUp";

function Auth(props) {
    return (
        // <SignIn login={props.login} />

        // <SignUp signUp={props.signUp} />
        // <Route path="/admin/add-operator" exact element={<SignUp signUp={props.signUp} />}

        // <SignInAdmin login={props.login}/>
        
        <Router>
            <Routes>
                <Route path="/" exact element={<SignIn login={props.login} />} />
                <Route path="/admin/sign-in" exact element={<SignInAdmin adminLogin={props.adminLogin} />} />
            </Routes>
        </Router>
    );
}


export default Auth;