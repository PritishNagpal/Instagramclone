import React,{ useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {userContext} from '../../App';
import M from 'materialize-css';


const cardStyle = {
        'maxWidth': '500px',
        'height': 'max-content',
        'margin': '26px auto'
    };

const Home = () => {

    const [data,setData] = useState([]);
    const [commentText,setCommentText] = useState('');
    const {state,dispatch} = useContext(userContext);



    useEffect(() => {
        fetch('/allposts',{
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
              if(item._id==result._id){
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
    
    const makeComment = (text,postId)=>{
        // setCommentText(text);
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

  const deletePost = (postId)=>{
    fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        },
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
        if(result.error){
            M.toast({html: result.error,classes:"#c62828 red darken-3"})
          }
          else if(result.message) {
            M.toast({html:result.message,classes:"#43a047 green darken-1"})
          }
    })
}   
    return (
    <div>
        {
            data.slice(0).reverse().map(posts => {
                return(
                    <div style={cardStyle} className="card" key={posts._id}>
                         <Link to={posts.author._id === state._id ? '/profile' : '/profile/'+ posts.author._id }><h5 style={{padding: '5px'}}>{posts.author.name}</h5></Link>
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
                                    setCommentText('')
                                }}>
                                  <input type="text" placeholder="Add a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>  
                                 </form>
                            
                        </div>
                    </div>
                )
            })
        }
        
    </div>
);
};

export default Home;