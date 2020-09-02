import React, { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePosts = () => {

    const history = useHistory();

    const [title,setTitle] = useState('');
    const [body,setBody] = useState('');
    const [image,setImage] = useState('');
    const [url,setUrl] = useState('');

    useEffect(() => {
        if(url){
        fetch('/createpost',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                title,
                body,
                pic: url
            })
        }).then(data => data.json())
        .then(res => {
                console.log(res)
                if(res.error){
                    M.toast({html: res.error,classes: '#e53935 red darken-1'});
                } 
                else{
                    M.toast({html: 'Post created Successfully',classes: '#00e676 green accent-3'});
                    history.push('/');
                }
                
            })
        .catch(e => console.log(e));
        }
    })   //[url]

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
            setUrl(imgData.url) })
        .catch((e) => console.log(e));
    };


    const style={
        maxWidth: '500px',
        margin: '30px auto',
        padding: '20px',
        textAlign: 'center'
    }

    return (
        <div className="card input-field" style={style}>
            <input 
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={event => setTitle(event.target.value)}/>
            <input 
            type="text" 
            placeholder="Body" 
            value={body}
            onChange={event => setBody(event.target.value)}/>

            <div className="file-field input-field">
            <div className="btn blue">
                <span>Image</span>
                <input
                type="file"
                onChange={event => setImage(event.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="Upload Image" />
            </div>
            </div>
            <button onClick={() => postImages()} className="waves-effect blue btn" style={{marginTop: '10px',marginBottom:'10px'}}>Submit
            <i className="material-icons right" style={{color: 'white'}}>send</i></button>
        </div>
    );
};

export default CreatePosts;