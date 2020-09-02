import React,{ useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';

import './App.css';
import NavBar from './components/navbar';
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import Signin from './components/pages/Signin';
import Profile from './components/pages/Profile';
import Feedback from './components/pages/FollowerPosts';
import CreatePost from './components/pages/CreatePost';
import Reset from './components/pages/reset';
import NewPassword from './components/pages/NewPassword';
import EmailVerify from './components/pages/Verification';
import ProfilePic from './components/pages/Profilepic';
import UserProfile from './components/pages/UserProfile';
import Reducer from './reducer/UserReducer';


export const userContext = createContext();

const Routing = () =>{

  const history = useHistory();
  const {state,dispatch} = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if(user){
      dispatch({type: 'USER',payload:user});
     }else{
      if(!history.location.pathname.startsWith('/reset') && !history.location.pathname.startsWith('/verify'))
          history.push('/signin');
    }
  },[])
  return (
  <Switch>
    <Route exact path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/followerpost" component={Feedback} />
      <Route path="/create" component={CreatePost} />
      <Route exact path="/reset" component={Reset} />
      <Route path="/reset/:token" component={NewPassword} />
      <Route path="/verify-email/:token" component={EmailVerify} />
      <Route exact path="/profilepic" component={ProfilePic} />
      <Route path="/profile/:userid" component={UserProfile} />
  </Switch>

);
  };

function App() {

  const [state,dispatch] = useReducer(Reducer);

  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />  
      </BrowserRouter>
    </userContext.Provider>

  );
}

export default App;
