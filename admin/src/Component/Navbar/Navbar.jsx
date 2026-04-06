import React from 'react'
import "./Navbar.css"
import assests from "../../admin_assets/assets"
function Navbar() {
  return (
   <>
   
   <div className='navbar'>
    <img className='logo' src={assests.logo} alt="" />
    <img className='profile' src={assests.profile_image} alt="" />



   </div>
   
   </>
  )
}

export default Navbar
