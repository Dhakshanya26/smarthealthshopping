import { get, post } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useGlobalState } from "./GlobalState";

const apiName = "baseURI";

export const DataProvider = () => {
  const { selectedStoreValue,setCurrentCartId } = useGlobalState();

  const getSession = () => {
    return localStorage.getItem("sessionid");
  };

  const buildAuth = async () => {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    return { Authorization: authToken };
  };

  const postAPI = async (method, data, inputType = "text") => {
     
    let input = {
      message: data,
      inputType: inputType,
      storeName: selectedStoreValue,
    };

    try {
      const restOp = post({
        apiName: apiName,
        path: `${method}?session=${getSession()}`,
        options: {
          headers: await buildAuth(),
          body: JSON.stringify(input),
        },
      });
      const res = await restOp.response;
      var response = await res.body.json();

      return response;
    } catch (err) {
      console.log(method, " failed: ", err);
      throw err;
    }
  };

  const getAPI = async (method) => {
  
    try {
      const restOp = get({
        apiName: apiName,
        path: method + `?storeName=${selectedStoreValue == null  ? "FreshMart": selectedStoreValue}`,
        options: {
          headers: await buildAuth(),
        },
      });
      const res = await restOp.response;
      return await res.body.json();
    } catch (err) {
      console.log(method, " failed: ", err);
    }
  };

  return { postAPI, getAPI };
};
export const useDataProvider = () => {
  const dataProvider = DataProvider({});
  return {
    postAPI: dataProvider.postAPI,
    getAPI: dataProvider.getAPI,
  };
};
