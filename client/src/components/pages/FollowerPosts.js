import React,{ useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {userContext} from '../../App';

const FollowerPosts = () => {

    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(userContext);

    useEffect(() => {
        fetch('/followerpost',{
            headers:{
                'Authorization': 'Bearer '+ localStorage.getItem('jwt')
            }
        }).then((responses) => responses.json())
        .then((result) => {
            console.log(result);
            setData(result);
        })
    },[]);


    const likePosts = (id) => {
        fetch('/likes',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body : JSON.stringify({
                id
            })
        }).then(responses => responses.json())
        .then((result) => {
            console.log(result);
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
           setData(newData)
           
        })
        .catch(e => console.log(e))
    }
    const unlikesOnPosts = (id) => {
        fetch('/unlike',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body : JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
          //   console.log(result)
          const newData = data.map(item=>{
              if(item._id === result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
          console.log(err)
      })
    }
    const cardStyle = {
        'maxWidth': '500px',
        'height': 'max-content',
        'margin': '26px auto'
    };

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id === result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

  const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"DELETE",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}
    
    return (
    <div>
        {
            data.slice(0).reverse().map(posts => {
                return(
                    <div style={cardStyle} className="card" key={posts._id}> 
                         <Link to={posts.author._id === state._id ? '/profile' : '/profile/'+ posts.author._id }><h5>{posts.author.name}</h5></Link>
                            {/* <h5 style={{padding: '10px 0 0 10px'}}>{}
                            {posts.author._id === state._id && 
                            <i
                            onClick={() => deletePost(posts._id)}
                            style={{cursor:'pointer',color:'red',float:'right'}} className="material-icons">delete</i>}
                            </h5> */}
                        <div className="card-image">
                            <img alt="home" src={posts.photo} />
                        </div>
                        <div className="card-content">
                        {
                                posts.likes.includes(state._id) ? 
                                <i className="material-icons border" onClick={() =>{
                                    unlikesOnPosts(posts._id)
                                }}  style={{color:'red',cursor:'pointer'}}>favorite</i>
                                :
                                <i className="material-icons border" onClick={() =>{
                                    likePosts(posts._id)
                                }}  style={{color:'black',cursor:'pointer'}}>favorite</i>
                            }
                            <h6>{posts.likes.length} likes</h6>
                            <h6>{posts.title}</h6>
                            <p>{posts.body}</p>
                            {
                                    posts.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,posts._id)
                                }}>
                                  <input type="text" placeholder="add a comment" />  
                                 </form>
                            
                        </div>
                    </div>
                )
            })
        }
        
    </div>
);
};

export default FollowerPosts;