import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartitem = {}, food_list = [], removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Optional: get only items in cart
  const cartFoodList = food_list.filter((item) => (cartitem?.[item._id] || 0) > 0);

  return (
    <div className="cart">
      <div className="cart-item">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {cartFoodList.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartFoodList.map((item) => {
            const quantity = cartitem?.[item._id] || 0;

            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{quantity}</p>
                  <p>${item.price * quantity}</p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          })
        )}
      </div>

    
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div>
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
          </div>

          <button
            onClick={() => navigate("/order")}
            disabled={cartFoodList.length === 0} // disable if cart empty
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

      
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;