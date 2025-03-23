import { useState } from "react";
import {
  View,
  Flex,
  Button,
  Image,
  Divider,
  Heading,
  Link,
  Loader,
} from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import logo from "../assets/logo.png";
import vegshop from "../assets/vegshop.jpg";
import NavOrders from "./navbar-orders";
import { useGlobalState } from "../common/GlobalState";

function Navbar() {

  const { selectedStoreValue } = useGlobalState();



  return (
    <View>
    
      <Flex margin={"1em"} alignItems={"center"} >

     
        <Flex flex={1} justifyContent={"flex-start"} alignItems={"center"} maxWidth={"200px"}>
          {/* <Image height="3em" backgroundColor={'rgba(255, 255, 255, 0.8)'} padding={'3px'} borderRadius={'5px'} src={logo} /> */}
          <Image
            height="8em"
            src={selectedStoreValue == "S101" ? logo : vegshop}
            borderRadius={"12px"}
          />
          {/* <Heading color={'white'}  level={4} fontWeight='bold'>Starbucks</Heading> */}
        </Flex>
       
        <Flex
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"2.5em"}
          backgroundColor={"rgba(255, 255, 255, 0.7)"}
          padding={"12px"}
          height={"60px"}
          borderRadius={"12px"}
          style={{ backdropFilter: "blur(-18px)" }}
          color={"rgb(4 125 149)"}
          margin={"0 10%"}
        >
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
             Vegetables
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            Fruits
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            Tinfood
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            Meat
          </Link>
        </Flex>
      
      </Flex>
      {/* <Divider orientation="horizontal" /> */}
    </View>
  );
}

export default Navbar;
