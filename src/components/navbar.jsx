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
  const [loading, setLoading] = useState(false);
  const { selectedStoreValue } = useGlobalState();

  const userSignout = async (e) => {
    try {
      setLoading(true);
      await signOut();
      setLoading(false);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <View>
    
      <Flex margin={"1em"} alignItems={"center"}>

     
        <Flex flex={1} justifyContent={"flex-start"} alignItems={"center"}>
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
        >
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            MENU
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            REWARDS
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            ORDER
          </Link>
          <Link to="/" color={"rgb(4 125 149)"} style={{ fontWeight: "bold" }}>
            LOCATIONS
          </Link>
        </Flex>
        <Flex flex={1} justifyContent={"flex-end"} alignItems={"center"}>
          <NavOrders />
          <Button
            variation="primary"
            size="small"
            onClick={(e) => userSignout(e)}
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
            )}
          </Button>
        </Flex>
      </Flex>
      {/* <Divider orientation="horizontal" /> */}
    </View>
  );
}

export default Navbar;
