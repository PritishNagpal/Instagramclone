import React, { useState,useEffect,useContext } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import {userContext} from '../../App';

const ProfilePic = () => {

    const history = useHistory();

    const [image,setImage] = useState('');
    const {state,dispatch} = useContext(userContext);

//     useEffect(() => {
//         fetch('/updateProfilePic',{
//             method: 'POST',
//             headers: {
//                 'Content-Type' : 'application/json',
//                 'Authorization': 'Bearer ' + localStorage.getItem('jwt')
//             },
//             body: JSON.stringify({
//                 img: profilePic,
            
//             })
//         }).then(data => {data.json()
//             // console.log('chalega?')
//         })
//         .then(res => {
//                 console.log(res)
//                 console.log('chalega?')
//                 if(res.error){
//                     M.toast({html: res.error,classes: '#e53935 red darken-1'});
//                 } 
//                 else{
//                     M.toast({html: 'Profile updated Successfully',classes: '#00e676 green accent-3'});
//                     history.push('/profile');
//                 }
                
//             })
//         .catch(e => console.log(e));
// })  //[url]

    const postImages = () => {
        const data = new FormData();
        data.append('file',image);
        data.append('upload_preset','insta-clone-imgs');
        data.append('cloud_name','devdoingstuff');
        fetch('https://api.cloudinary.com/v1_1/devdoingstuff/image/upload',{
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then(imgData => {
            // setProfilePic(imgData.url)
            

            fetch('/updateProfilePic',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    img: imgData.url
                })
            })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                localStorage.setItem('user',JSON.stringify({...state,profilePic: result.profilePic}));
                dispatch({type: 'UPDATE_PIC',payload: {profilePic: result.profilePic}})
            })

            M.toast({html: 'Profile updated Successfully',classes: '#00e676 green accent-3'});
            history.push('/profile');
        })
        .catch((e) => console.log(e));
    };


    const style={
        maxWidth: '500px',
        margin: '30px auto',
        padding: '20px',
        textAlign: 'center'
    }

    return (
        <div style={{width: '60%',margin: '40px auto'}}>
            <div  className="file-field input-field">
                <div className="btn blue">
                    <span>Profile Pic</span>
                    <input
                    type="file"
                    onChange={event => setImage(event.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload Image" />
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
            <button onClick={() => postImages()} className="waves-effect blue btn">Submit
            <i className="material-icons right" style={{color: 'white'}}>send</i></button>
            </div>
        </div>
    );
};

export default ProfilePic;