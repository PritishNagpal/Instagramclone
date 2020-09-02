import React,{ useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../../App';
import { useMediaQuery } from 'react-responsive';

const Profile = () =>{

    const isMobileScreen = useMediaQuery({ query: '(max-device-width: 470px)' });

    const {state,dispatch} = useContext(userContext);
    console.log(state)
    const [myPosts,setMyPosts] = useState([]);
    const [profile,setProfile] = useState('');
    const [bio,setBio] = useState('');

    useEffect(() => {
        fetch('/myposts',{
            headers:{
                'Authorization' : 'Bearer '+  localStorage.getItem('jwt')
            }
        }).then((res) => res.json())
        .then((result) => {
            setMyPosts(result);
            console.log(result);
        })  
    },[])

    useEffect(() => {
        fetch('/profilepic',{
            method: 'GET',
            headers:{
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            }
            
        })
        .then(res => res.json())
        .then(result => {
            setProfile(result.picUrl)
            setBio(result.bio)
        })
    },[])

    let imgStyle = {
        'height': '180px',
        'width': '180px',
        'borderRadius': '50%',
        'border': '1px solid black'
    };

    if(isMobileScreen){
        imgStyle = {
            ...imgStyle,
            'height': '120px',
            'width': '120px'
        }
    }

    const style = {
        'display': 'flex',
        'justifyContent': 'space-evenly',
        'margin': '18px 0px',
        'padding': '20px'
    };
    
    const styledDiv = {
        'display': 'flex',
        'justifyContent': 'space-around',
        'flexWrap': 'wrap'
    }

    const createPostStyle = {
        'textAlign': 'center',
        'border': '1px solid grey',
        'borderRadius': '25px'
    }
    let loadStyle = {
        'fontFamily': 'Grand Hotel',
        'fontSize': '90px',
        'marginTop': '20vh',
        'marginLeft': '40vw'
    }
    if(isMobileScreen){
        loadStyle = {
            ...loadStyle,
            marginLeft: '20vw'
        }
    }

    return (
        <div >
        {
            state ? 
            <div style={{maxWidth: '550px',margin:'0px auto'}}>
            <div style={style} >
                <div>
                    <img style={imgStyle} alt="" src={state.profilePic} />
                    <div sytle={{margin: '0',padding:'0',height:'500px',position:'absolute'}}>
                    <p>{bio}</p>
                    </div>       
                </div>
                
                <div>
                    <h4>{state ? state.name:'loading'}</h4>
                    <div style={{display: 'flex',justifyContent:'space-between',width: '110%'}}>
                        <div style={{margin: '0 auto'}}>
                            <div>
                               <strong>{myPosts.length}</strong> Posts | 
                               <strong> {state ? state.followers.length : '0'}</strong> Followers | 
                               <strong> {state ? state.following.length : '0'}</strong> Following
                             </div>
                        </div>
                    </div>
                    <ul style={createPostStyle}>
                        <Link to='/profilepic'><li>Edit Profile</li></Link>
                    </ul>
                </div>
            </div>
            <hr />
            <div style={styledDiv}>
                {
                    myPosts.map((imgs) => {
                       return ( <img key={imgs._id} style={{height:'150px',width:'150px',marginBottom:'10px',border:'1px solid black',padding: '4px',cursor:'pointer'}} alt={imgs.title} src={imgs.photo} /> )
                    })
                }
               
            </div>
        </div>:
        <div style={loadStyle}> loading! </div>
        }
        
        </div>
);
}

export default Profile;