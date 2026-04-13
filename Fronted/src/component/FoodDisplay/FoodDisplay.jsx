import React, { useContext } from 'react';
import "./FoodDisplay.css";
import { StoreContext } from '../../context/storeContext';
import Fooditem from '../Fooditem/Fooditem';

function FoodDisplay({ category }) {

  const { food_list, loading } = useContext(StoreContext);

  //  Show loader
  if (loading) {
    return (
      <div className="verify">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className='food-display' id="food-display">

      <h2>Top dishes near you</h2>

      <div className='food-display-list'>

        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <Fooditem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null; 
        })}

      </div>

    </div>
  );
}

export default FoodDisplay;