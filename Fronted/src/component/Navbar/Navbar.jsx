import React, { useContext, useState } from 'react'
import "../Navbar/Navbar.css"
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/storeContext'

function Navbar({ setShowLogin }) {

  const [menu, setmenu] = useState("home")
  const [search, setSearch] = useState("")


  const { getTotalCartAmount, token, settoken, setSearchQuery } = useContext(StoreContext)

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    settoken("");
    navigate("/")
  }


  const handleSearch = (e) => {
    setSearch(e.target.value)
    setSearchQuery(e.target.value)
  }

  return (
    <div className='navbar'>

      <Link to="/">
        <img src={assets.logo} alt="" className='logo' />
      </Link>

      <ul className="navbar-menu">
        <Link to='/' onClick={() => setmenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setmenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setmenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setmenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact-us</a>
      </ul>

      <div className='navbar-right'>

    
        <div className="search-box">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className='navbar-search-icon'>
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='nav-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />Orders
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar