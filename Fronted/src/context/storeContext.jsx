import axios from "axios";
import React, { createContext,  useEffect,  useState } from "react";


export const StoreContext = createContext(null);

function storeContextProvider(props) {
  const [cartItems, setcartitem] = useState({});
const[token,settoken]=useState("")
const[food_list,setFoodlist]=useState([])


  const url="http://localhost:4000"

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setcartitem((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setcartitem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  };

  const removeFromCart =async (itemId) => {
    setcartitem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  };

 const getTotalCartAmount = () => {
  let total = 0;

  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      total += item.price * cartItems[item._id];
    }
  });

  return total;
};


// fetch foodlist

const fetchFoodlist=async()=>{
  const response=await axios.get(url+"/api/food/list")
  setFoodlist(response.data.data)

}

const loadCartData = async (token) => {
  const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
  setcartitem(response.data.cartData || {}); // ✅ fallback to {}
};


useEffect(()=>{
 

  async function localData(){
    await fetchFoodlist()
  
   if(localStorage.getItem("token")){
    settoken(localStorage.getItem("token"))
    await loadCartData(localStorage.getItem("token"))
  }}

  localData()
},[])

  
  const contextValue = {
    food_list,
  cartitem: cartItems,
    setcartitem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    settoken
  };

  return (
    <>
      <StoreContext.Provider value={contextValue}>
        {props.children}
      </StoreContext.Provider>
    </>
  );
}

export default storeContextProvider;
