import React, { useState, useContext } from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from 'materialize-css';

import { userContext } from '../../App';
import '../../App.css'


const Signin = () =>{

    const {state,dispatch}  = useContext(userContext);

    const history = useHistory();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const postCredentials = () => {
        fetch('/signin',{
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then( res => res.json())
        .then((data) => {
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:'#e53935 red darken-1'});
            }
            else if(data.errors){
                M.toast({html: data.errors[0].msg,classes:'#e53935 red darken-1'})
            }
            else{
                localStorage.setItem('jwt',data.token);
                localStorage.setItem('user',JSON.stringify(data.user));
                dispatch({type: 'USER',payload:data.user});
                M.toast({html:'Signed In Successfully!!',classes:'#00e676 green accent-3'});
                history.push('/')
            }
            console.log(data)
        })
        .catch((e) => {
            console.log(e);
        })
    }

    const style = {
        'padding': '20px',
        'marginTop': '30px'
        
    }
    
    const cardStyle = {
        'maxWidth': '400px',
        'textAlign': 'center',
        'margin': '10px auto',
        'padding': '20px'
    }
    

    return (
    <div style={cardStyle} >
        <div className="card center" style={style}>
            <h2 className="insta-font">Instagram</h2>

            <input type="text" 
            placeholder="Email" 
            value={email}
            onChange={(event) => setEmail(event.target.value)} />

            <input type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(event) => setPassword(event.target.value)}/>

            <button href="/" className="waves-effect waves-light btn" style={{marginTop: '10px',marginBottom:'10px',width: '100%'}}
            onClick={() => postCredentials()}>Login</button>
            <small style={{display:'block'}}>Don't have an account?<Link to="/signup"> Register</Link></small>
            <small><Link to="/reset"> Forgot Password?</Link></small>
      </div>
        <footer>
           <div style={{marginTop: '110px',fontSize: '1.2rem'}}>
            <strong >
            Developed By Pritish Nagpal
            </strong>
            </div> 
        </footer>
    </div>
    );
};

export default Signin;