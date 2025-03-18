import {
  ThemeProvider,
  Heading,
  View,
  Flex,
  Input,
  Button,
} from "@aws-amplify/ui-react";
import Navbar from "./components/navbar";
import ChatBot from "./components/ChatBot";
import "./App.css";
// import '@aws-amplify/ui-react/styles.css'
import background from "./assets/background.png";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "./common/GlobalState";
import {useDataProvider} from './common/DataProvider'
import NavOrders from "./components/navbar-orders";
function App() {
  // All store list - hardcoded.
  const options = [
    { store_id: "S101", store_name: "FRESHMART" },
    { store_id: "S102", store_name: "GROCERY WORLD" },
  ]; // State for dropdown options
  const { setSelectedStoreValue } = useGlobalState(); // Get global state setter
  // Fetch API data on component mount
  const { postAPI, getAPI } = useDataProvider();
  const [loading, setLoading] = useState(false);
  const userSignout = async (e) => {
    try {
      setLoading(true);
      await signOut();
      setLoading(false);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };
  useEffect(() => {
    // Set initial value
    setSelectedStoreValue(options[0].store_name);

    const warmUp = async () => {
      console.log("Warming up"); 
      await postAPI("/warmupnavigatorengine", "warmup");
    }
    warmUp();

  }, []);
  // Handle Dropdown Change
  const handleChange = (event) => {
    setSelectedStoreValue(event.target.value); // Update global variable
  };
  return (
    <ThemeProvider>
      {/* <Navbar/> */}
      {/* Call to Action Banner */}
      <div
        style={{
          height: "100vh",
          padding: "1em",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
        }}
      >
        <Flex>
         <Flex flex={1} justifyContent={"flex-left"} alignItems={"left"}> 
        <div className="dropdown">
          <select onChange={handleChange} className="dropdownselect">
            {options.map((item, index) => (
              <option key={index} value={item.store_id}>
                {item.store_name}
              </option>
            ))}
          </select>
        </div>
        </Flex>
        <Flex flex={2} justifyContent={"flex-end"} alignItems={"right"}>
          <NavOrders />
          <Button
            variation="primary"
            size="small"
            onClick={(e) => userSignout(e)}
            value={"SignOut"}
            name="Signout"
          >
            {loading ? (
              <Loader />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1.5em"
                width="1.5em"
              >
                <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
              </svg> 
            )} Sign out
          </Button>
        </Flex>
        </Flex>
        <Navbar />
        {/* <Flex direction='column' justifyContent='center' alignItems='center' height='65vh'>
          <Flex direction='column' justifyContent='center' alignItems='center' padding={'1em'} borderRadius={'14px'} style={{backgroundColor:'rgba(4, 124, 148, 0.6)'}}>
          <Heading level={2} color='white'>Explore our world with a smile</Heading>
          <Heading level={6} color='white'>We have the top destinations waiting for you with the best deals happening right now!</Heading>
          <Flex backgroundColor={'white'} padding={'.5em'} borderRadius={'5px'} width={'55vw'}>
            <Input placeholder='📍 location' />
            <Input placeholder='📅 date' />
            <Input placeholder='👤 person' />
            <Button variation='primary' >Go </Button>
          </Flex>
          </Flex>
        </Flex> */}
      </div>
      <ChatBot />
    </ThemeProvider>
  );
}

export default App;
