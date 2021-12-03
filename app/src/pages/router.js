import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";

  
import SignUp from './signUp/signUp.jsx';
import SignIn from './signIn/signIn.jsx';
import App from './app/index';

export const paths = {
  signIn: '/',
  signUp: 'signUp',
  app: "/app"
}

const MyRouter = props => {
  return(
  	<Router>
  	  <Routes>
  	    <Route exact path={paths.signIn} element={<SignIn/>}/> 
  	    <Route exact path={paths.signUp} element={<SignUp/>}/>
		<Route exact path={paths.app} element={<App/>}/>
  	    <Route path="*" element={<div>404 not fund page</div>}>
  	    </Route>
  	  </Routes>
  	</Router>
  );
}

export default MyRouter;