import React, { useContext, useEffect, useState } from "react";
import "./Placeorder.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Placeorder() {
  // ✅ Use the exact context key
const { cartitem = {}, food_list = [], getTotalCartAmount, token, url } = useContext(StoreContext);

  // Delivery info state
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Handle input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Place order function
  const placeOrder = async (event) => {
    event.preventDefault();

    if (!cartitem || Object.keys(cartitem).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Build order items safely
    const orderItems = [];
    food_list.forEach((item) => {
      const qty = cartitem[item._id] || 0;
      if (qty > 0) {
        orderItems.push({ ...item, quantity: qty });
      }
    });

    if (orderItems.length === 0) {
      alert("No items in cart to order.");
      return;
    }

    // Prepare order data
    const deliveryFee = 20; // ₹20 delivery fee
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee,
    };

    try {
      console.log("Posting to:", `${url}/api/order/place`);
console.log("Order data:", orderData);
console.log("Token:", token);
      let response = await axios.post(`${url}/api/order/place`, orderData, {
  headers: { token: token }, // make sure token is sent exactly as "token"
});

      if (response.data.success) {
        window.location.replace(response.data.session_url); // Stripe checkout
      } else {
        alert("Error placing order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  const naviate=useNavigate()


useEffect(()=>{
  if(!token){
    naviate("/cart")
    alert("login first")

  }

  else if(getTotalCartAmount()===0){
    naviate('/cart')
  }
},[token])

  return (
    <form className="place-order" onSubmit={placeOrder}>
      {/* Delivery Info */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name="firstName" placeholder="First Name" value={data.firstName} onChange={onChangeHandler} />
          <input required name="lastName" placeholder="Last Name" value={data.lastName} onChange={onChangeHandler} />
        </div>

        <input required name="email" placeholder="Email" value={data.email} onChange={onChangeHandler} />
        <input required name="street" placeholder="Street" value={data.street} onChange={onChangeHandler} />

        <div className="multi-fields">
          <input required name="city" placeholder="City" value={data.city} onChange={onChangeHandler} />
          <input required name="state" placeholder="State" value={data.state} onChange={onChangeHandler} />
        </div>

        <div className="multi-fields">
          <input required name="zipcode" placeholder="Zip Code" value={data.zipcode} onChange={onChangeHandler} />
          <input required name="country" placeholder="Country" value={data.country} onChange={onChangeHandler} />
        </div>

        <input required name="phone" placeholder="Phone" value={data.phone} onChange={onChangeHandler} />
      </div>

      {/* Cart Summary */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount() || 0}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 20}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
          </div>

         <button
  type="submit"
  disabled={!cartitem || Object.keys(cartitem).length === 0}
>
  PROCEED TO PAYMENT
</button>
        </div>
      </div>
    </form>
  );
}

export default Placeorder;