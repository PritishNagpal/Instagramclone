import React,{ useEffect, useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from '../../App';
import { useMediaQuery } from 'react-responsive';

const UserProfile = () =>{

    const {state,dispatch} = useContext(userContext);
    const [user,setUser] = useState('');
    const [profile,setProfile] = useState([]);
    const { userid } = useParams(); 
    const isMobileScreen = useMediaQuery({ query: '(max-device-width: 470px)' });

    useEffect(() => {
        fetch(`/profile/${userid}`,{
            headers:{
                'Authorization' : 'Bearer '+  localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then((result) => {
            // console.log(result);
            setProfile(result.posts)
            setUser(result.user)
            // console.log(result.user.user)
        })  
    },[])

    const imgStyle = {
        'height': '150px',
        'width': '150px',
        // 'borderRadius': '50%',
    };

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
    const followUser = () => {
        fetch('/follow',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
        .then(data => {
            // console.log(data);
            dispatch({type: 'UPDATE',payload: { following: data.following,followers: data.followers }})
            localStorage.setItem('user',JSON.stringify(data))
            setUser((prevstate) => {
                console.log(prevstate)
                return {
                    ...prevstate,
                    followers: [...prevstate.followers,data._id]
                }
            })
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowid: userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
             dispatch({type: 'UPDATE',payload: { following: data.following,followers: data.followers }})
             localStorage.setItem('user',JSON.stringify(data))
            setUser((prevstate) => {
                const newFollower = prevstate.followers.filter(item => item !== data._id)
                return {
                    ...prevstate,
                    followers: newFollower
                }
            })
        })
    }

    return (
        <div >
        {user ?
        <div style={{maxWidth: '550px',margin:'0px auto'}}>
        <div style={style} >
            <div>
                 <img style={imgStyle} alt="" src={user.profilePic} /> 
            </div>
             <div>
                <h5 style={{textAlign:'center'}}>{user.name}</h5>
                <div style={{display: 'flex',justifyContent:'space-around',width: '110%'}}>
                    <div> {profile.length}  Posts</div>
                    <div>{user.followers.length} Followers</div>
                    <div>{user.following.length} Following</div>
                </div>
                <div style={{textAlign:'center'}}>
                {
                    state.following.includes(userid)?
                    <button className="waves-effect waves-light btn" style={{marginTop: '10px',marginBottom:'10px',width: '60%'}}
                onClick={() => unfollowUser()}>Unfollow</button>
                :
                <button  className="waves-effect waves-light btn" style={{marginTop: '10px',marginBottom:'10px',width: '50%',marginRight:'50px'}}
                onClick={() => followUser()}>Follow</button>
                }
                </div>
            </div> 
        </div>
        <hr />
        <div style={styledDiv}>
            {
                profile.map((imgs) => {
                   return ( <img key={imgs._id} style={{height:'150px',width:'150px',marginBottom:'10px',border:'1px solid black',padding: '4px',cursor:'pointer'}} alt={imgs.title} src={imgs.photo} /> )
                })
            }
        </div>
    </div>
        : <div style={loadStyle}> loading! </div>}
        
        </div>
);
}

export default UserProfile;