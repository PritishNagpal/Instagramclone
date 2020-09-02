import React,{ useState } from 'react';
import { Link,useHistory } from 'react-router-dom';

import '../../App.css'
import M from 'materialize-css';
import EyeImage from '../../Assets/Images/eye.png';
import HiddenEyeImage from '../../Assets/Images/hidden.png';


const Signup = () =>{

    const style = {
        'padding': '20px',
        'marginTop': '30px' 
    };
    
    const cardStyle = {
        'maxWidth': '400px',
        'textAlign': 'center',
        'margin': '10px auto',
        'padding': '20px'
    };

    const history = useHistory();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [icon,setIcon] = useState(EyeImage);
    const [type,setType] = useState('password');
    const [confirmPassIcon,setConfirmPassIcon] = useState(EyeImage);
    const [confirmPassType,setConfirmPassType] = useState('password')

    const postCredentials = () => {
        if(password !== confirmPassword){
            return M.toast({html: 'Password must match',classes:'#e53935 red darken-1'})
        }
        fetch('/signup',{
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
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
                M.toast({html: data.message,classes:'#00e676 green accent-3'});
                history.push('/signin')
            }
            console.log(data)
        })
        .catch((e) => {
            console.log(e);
        })
    }

    const eyeIcon = () => {
        if(icon === EyeImage){
            setIcon(HiddenEyeImage);
        }
        else{
            setIcon(EyeImage);
        }
        if(type === 'password'){
            setType('text');
        }
        else{
            setType('password');
        }
    }
    const confirmpassEyeIcon = () => {
        confirmPassIcon === EyeImage ? setConfirmPassIcon(HiddenEyeImage) : setConfirmPassIcon(EyeImage);
        confirmPassType === 'password' ? setConfirmPassType('text') : setConfirmPassType('password') 
    }


    return (
    <div style={cardStyle} >
        <div className="card center" style={style}>
            <h2 className="insta-font">Instagram</h2>
            <input
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(event) => setName(event.target.value)} />

            <input type="text" 
            placeholder="Email" 
            value={email}
            onChange={(event) => setEmail(event.target.value)} />

            <div style={{display:'flex'}}>
                <input type={type} 
                placeholder="Password" 
                value={password} 
                onChange={(event) => setPassword(event.target.value)}/>
                <img onClick={() => eyeIcon()} style={{height: '20px',display:'flex',alignSelf:'center',cursor:'pointer'}} src={icon} />
            </div>
            <div style={{display:'flex'}}>
                <input type={confirmPassType}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)} />
                <img onClick={() => confirmpassEyeIcon()} style={{height: '20px',display:'flex',alignSelf:'center',cursor:'pointer'}} src={confirmPassIcon} />
            </div>
            <button className="waves-effect waves-light btn" style={{marginTop: '10px',marginBottom:'10px',width: '100%'}}
            onClick={() => postCredentials()}>Login</button>
            <small>Already have an account?<Link to="/signin">Sign Up</Link></small>
      </div>

      <footer>
           <div style={{marginTop: '20px',fontSize: '1.2rem'}}>
            <strong >
            Developed By Pritish Nagpal
            </strong>
            </div> 
        </footer>
    </div>
    );
};

export default Signup;