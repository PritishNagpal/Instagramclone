import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import M from 'materialize-css';


const Verification = () => {
    const history = useHistory();
    const {token} = useParams();
    const postToken = () => {
        fetch('/verify-email',{
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                token
            })
        })
        .catch(e => console.log(e))
}
    const Onclickfunc = () => {
        postToken()
            M.toast({html: 'Email Verified',classes:'#00e676 green accent-3'})
            history.push('/signin')
    }



    return( 
        <div>
            <div style={{display: 'flex',justifyContent: 'center',margin: '50px 0'}}><strong style={{fontSize: '2rem',display:''}}>Congrats! Just One more Step</strong></div>
            <div style={{display: 'flex',justifyContent: 'center'}}><a style={{width: ''}} class="waves-effect waves-light btn"onClick={() => Onclickfunc()}>Click Here to Continue</a></div>
        </div>
    );
};

export default Verification;