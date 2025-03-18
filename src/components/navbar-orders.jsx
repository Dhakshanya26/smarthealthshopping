import { useEffect, useState } from "react";
import { useDataProvider } from "../common/DataProvider";
import { Button, Card, Text, Loader } from "@aws-amplify/ui-react";
import { BsCart } from "react-icons/bs";
import { useGlobalState } from "../common/GlobalState";

const NavOrders = () => {
  const { postAPI, getAPI } = useDataProvider();
  const { currentCartId } = useGlobalState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
 

  const getOrders = async () => {
    setVisible(true);
    setLoading(true);
    try {
      const res = await postAPI("/cart", { cartId: currentCartId }, "text");
        
      if (res?.cart?.length == undefined || res?.cart?.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      setCartItems(res.cart);
      setLoading(false);
    } catch (err) {
      setCartItems([]);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <Button variation='primary' size='small' onClick={()=> setVisible(true)} >Orders</Button> */}
      {visible ? (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <Card onClick={() => setVisible(false)}>
            {loading ? <Loader variation="linear" /> : null}
            <h2>My cart</h2>
            <div
              className="items-container"
              style={{
                color: "#08365f",
                margin: "20px",
                "border-bottom": "1px solid",
              }}
            >
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="item"
                  style={{ padding: "5px", margin: "5px" }}
                >
                  <Text>{`Product ${index + 1}: ${item.productName} `}</Text>
                  <br></br>
                </div>
              ))}
            </div>
          </Card>
          <button
            style={{ position: "absolute", top: "-15px", right: "-8px" }}
            onClick={() => setVisible(false)}
          >
            X
          </button>
        </div>
      ) : (
        <Button variation="primary" size="small" onClick={() => getOrders()}>
          <BsCart size={20} /> Cart
        </Button>
      )}
    </div>
  );
};

export default NavOrders;
