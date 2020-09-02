import React, { useState, useContext } from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from 'materialize-css';

import '../../App.css'


const Reset = () =>{

    const history = useHistory();
    const [email,setEmail] = useState('');

    const postCredentials = () => {
        fetch('/reset-password',{
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email
            })
        }).then( res => res.json())
        .then((data) => {
            if(data.error){
                M.toast({html: data.error,classes:'#e53935 red darken-1'});
            }
            else if(data.errors){
                M.toast({html: data.errors[0].msg,classes:'#e53935 red darken-1'})
            }
            else{
                M.toast({html:data.message,classes:'#00e676 green accent-3'});
                history.push('/signin')
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

            <button href="/" className="waves-effect waves-light btn" style={{marginTop: '10px',marginBottom:'10px',width: '100%'}}
            onClick={() => postCredentials()}>Reset Password</button>
      </div>
    </div>
    );
};

export default Reset;