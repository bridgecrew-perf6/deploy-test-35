import {
  openContractDeploy,
  openContractCall,
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import { contract } from "./contract_template";
import { StacksTestnet, StacksMainnet } from "@stacks/network";
import { v4 } from "uuid";
import {
  uintCV,
  callReadOnlyFunction
} from "@stacks/transactions";

import axios from "axios";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function authenticate() {
  showConnect({
    appDetails: {
      name: "My App",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    redirectTo: "/",
    onFinish: () => {
      let userData = userSession.loadUserData();
      // Save or otherwise utilize userData post-authentication
    },
    userSession: userSession,
  });
}

export async function getUri() {
  try {
    const contractAddress = "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ";
    const contractName = "free-punks-v0";
    const functionName = "get-token-uri";
    const network = new StacksMainnet();
    const senderAddress = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ";

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [uintCV(0)],
      network,
      senderAddress,
    };

    const result = await callReadOnlyFunction(options);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

// export const init_deploy_old = () => {
//   const codeBody = contract("Mars-for-life", "transfer");

//   openContractDeploy({
//     contractName: v4(),
//     codeBody,
//     network: new StacksMainnet(),
//     appDetails: {
//       name: "My App",
//       icon: window.location.origin + "/my-app-logo.svg",
//     },
//     onFinish: (data) => {
//       console.log("Stacks Transaction:", data.stacksTransaction);
//       console.log("Transaction ID:", data.txId);
//       console.log("Raw transaction:", data.txRaw);
//     },
//   });
// };

// export async function call_contract(
//   contract_address,
//   contract_name,
//   func,
//   args
// ) {
//   try {
//     let data = await openContractCall({
//       contractAddress: contract_address,
//       contractName: contract_name,
//       functionName: func,
//       functionArgs: args,
//       postConditionMode: 1,
//       appDetails: {
//         name: "Songs to Radio",
//       },

//       onFinish: (data) => {
//         console.log("Stacks Transaction:", data.stacksTransaction);
//         console.log("Transaction ID:", data.txId);
//         console.log("Raw transaction:", data.txRaw, data);
//       },
//     });

//     //   console.log("Stacks Transaction:", data.stacksTransaction);
//     //   console.log("Transaction ID:", data.txId);
//     //   console.log("Raw transaction:", data.txRaw, data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// const STR_MARKETPLACE_V1 = {
//   address: "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9",
//   name: "marketplace_test_200",
// };

// const network = new StacksTestnet();

// export function getUrl() {
//   const readOnlyFunctionCallUrl = network.getReadOnlyFunctionCallApiUrl(
//     "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9",
//     "marketplace_test_200",
//     "get-listing"
//   );

//   console.log(readOnlyFunctionCallUrl);
// }

// export async function getUri() {
//   const { callReadOnlyFunction, uintCV } = require("@stacks/transactions");

//   (async () => {
//     const { StacksMainnet } = require("@stacks/network");
//     const contractAddress = "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ";
//     const contractName = "free-punks-v0";
//     const functionName = "get-token-uri";
//     const network = new StacksMainnet();
//     const senderAddress = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ";

//     const options = {
//       contractAddress,
//       contractName,
//       functionName,
//       functionArgs: [uintCV(0)],
//       network,
//       senderAddress,
//     };

//     const result = await callReadOnlyFunction(options);
//     console.log(result);
//   })();
// }

// export async function getTokenUri() {
//   // const function_name = "get-token-uri";
//   const function_name = "get-listing";
//   try {
//     const contractAddress = "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ";
//     const contractName = "free-punks-v0";
//     const functionName = "get-token-uri";
//     const buffer = bufferCVFromString("foo");
//     const network = new StacksMainnet();
//     const senderAddress = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ";

//     const options = {
//       contractAddress,
//       contractName,
//       functionName,
//       functionArgs: [uintCV(0)],
//       network,
//       senderAddress,
//     };

//     const result = await callReadOnlyFunction(options);
//     console.log(result);

//     let res = await axios.get(
//       "https://stacks-node-api.mainnet.stacks.co/extended/v1/tokens/SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.free-punks-v0/nft/metadata"
//     );
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export function getAccountetailsUrl() {
//   const accountInfoUrl = network.getAccountApiUrl(
//     "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9"
//   );
//   console.log(accountInfoUrl);
// }

// async function mintNFT(contract_address, contract_name, amount_to_mint) {
//   try {
//     await call_contract(
//       contract_address,
//       contract_name,
//       `mint-${amount_to_mint}`,
//       []
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function get_listing(contract_address, contract_name, id) {
//   const functionArgs = [
//     contractPrincipalCV(contract_address, contract_name),
//     uintCV(id),
//   ];
//   try {
//     await call_contract(
//       STR_MARKETPLACE_V1.address,
//       STR_MARKETPLACE_V1.name,
//       "get-listing",
//       functionArgs
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function listNFT(contract_address, contract_name, id, price) {
//   const functionArgs = [
//     contractPrincipalCV(contract_address, contract_name),
//     uintCV(id),
//     uintCV(price),
//     uintCV(200),
//   ];
//   try {
//     await call_contract(
//       STR_MARKETPLACE_V1.address,
//       STR_MARKETPLACE_V1.name,
//       "list-asset",
//       functionArgs
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function buyNFT(contract_address, contract_name, id) {
//   const functionArgs = [
//     contractPrincipalCV(contract_address, contract_name),
//     uintCV(id),
//   ];
//   try {
//     await call_contract(
//       STR_MARKETPLACE_V1.address,
//       STR_MARKETPLACE_V1.name,
//       "purchase-asset",
//       functionArgs
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function unlistNFT(contract_address, contract_name, id) {
//   const functionArgs = [
//     contractPrincipalCV(contract_address, contract_name),
//     uintCV(id),
//   ];
//   try {
//     await call_contract(
//       STR_MARKETPLACE_V1.address,
//       STR_MARKETPLACE_V1.name,
//       "unlist-asset",
//       functionArgs
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }
