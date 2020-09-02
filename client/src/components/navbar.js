import React, {useContext,useRef,useEffect,useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App';
import { useMediaQuery } from 'react-responsive';
import M from 'materialize-css';

import '../App.css';
import Menu from './SideMenu';

const Navbar = () => {

  const isMobileScreen = useMediaQuery({ query: '(max-device-width: 470px)' })
  const searchModal = useRef(null);
  const [search,setSearch] = useState('');
  const [users,setUsers] = useState([]);
  const history = useHistory();

  const {state,dispatch} = useContext(userContext);

  useEffect(() => {
    M.Modal.init(searchModal.current)
  },[])
  const renderList = () => {
    if(state){
      if(isMobileScreen){
        return[
          <Menu />
        ]
      }
      return [
        // <li key='1'><i data-target="modal1" className="material-icons modal-trigger" style={{color:'black',cursor: 'pointer'}}>search</i></li>,
        <li key='2'><Link  to="/profile">Profile</Link></li>,
        <li key='3'><Link  to="/create">Create Post</Link></li>,
        <li key='4'><Link  to="/followerpost">Feed</Link></li>,
        <li key='5'>
        <button className="waves-effect btn #e53935 red darken-1" onClick={ () => {
          localStorage.clear();
          dispatch({'type': 'CLEAR'});
          history.push('/signin')
        }
        }>Sign Out</button>  
        </li>
      ]
    }else{
      return [
        <li key='6'><Link  to="/signin">SignIn</Link></li>,
        <li key='7'><Link to="/signup">SignUp</Link></li>
      ]
    }
  }

  const renderHome = () => {
    if(state){
      return <Link to="/" className="brand-logo left insta-font">Instagram</Link>;
    }else{
      return <Link to="/signin" className="brand-logo left insta-font">Instagram</Link>
    }
  }

  const fetchUsers = (query) => {
    setSearch(query)
    fetch('search-users',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    })
    .then(res => res.json())
    .then(result => {
      console.log(result)
      const data = [];
      result.map(rec => {
        data.push(rec.email)
      })
      setUsers(result);
    })
  }
  
    
    return (
    <nav>
    <div className="nav-wrapper white" >
      
      {renderHome()}
      <div id="modal1" className="modal" ref={searchModal} style={{color: 'black'}}>
        <div className="modal-content">
        <input type="text" 
            placeholder="Search User" 
            value={search}
            onChange={(event) => fetchUsers(event.target.value)} />
        </div>
        <ul className="collection" style={{display: 'flex',flexFlow: 'column'}}>
          {
            users.map(data => {
              return(
                <Link to={data._id === state._id ? '/profile': `/profile/${data._id}`} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close()
                setSearch('') }} key={data._id}><li  className="collection-item">{data.email}</li></Link>
              )
            })
          } 
        </ul>
      </div>
        <ul id="nav-mobile" className="right topnav" style={{display:'flex'}}>
        <li key='10'><i data-target="modal1" className="material-icons modal-trigger" style={{color:'black',cursor: 'pointer'}}>search</i></li>
       { renderList()}
      </ul>
      
    </div>
  </nav>
);
}

export default Navbar;