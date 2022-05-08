import {
  openContractDeploy,
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { contract } from "./contract_template";
import { StacksTestnet, StacksMainnet } from "@stacks/network";
import { v4 } from "uuid";
import { marketplaceContract } from "./marketplace.contract";
import { nftTrait } from "./nft.trait";
import { commissionTrait } from "./commission.trait";
import { nftContract } from "./nft.contract";
import { commissionContract } from "./commission.contract";
import { contractPrincipalCV, standardPrincipalCV, uintCV } from "@stacks/transactions";
import { stx_post_condition } from "./post.conditions";

let contractToDeploy = 0;

let contracts = [
  nftTrait,
  commissionTrait,
  commissionContract,
  marketplaceContract,
];
let numOfContracts = contracts.length;

export const init_deploy = ({ contractName, codeBody }) => {
  openContractDeploy({
    contractName,
    codeBody,
    network: new StacksTestnet(),
    appDetails: {
      name: "My App",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      console.log("Stacks Transaction:", data.stacksTransaction);
      console.log("Transaction ID:", data.txId);
      console.log("Raw transaction:", data.txRaw);

      contractToDeploy++;

      if (contractToDeploy < numOfContracts)
        init_deploy(contracts[contractToDeploy](200));
    },
  });
};

export function deploy_contracts() {
  contractToDeploy = 0;
  //   init_deploy(contracts[contractToDeploy](200));
  //   init_deploy(marketplaceContract(200));
}

export function callBuy() {
    console.log(uintCV(200))
  openContractCall({
    contractAddress: "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9",
    contractName: "marketplace_test_200",
    functionName: "list-asset",
    functionArgs: [
        contractPrincipalCV(
        "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9", "nft_test_201"
      ),
      uintCV(2),
      uintCV(50000000),
      uintCV(200)
    ],
    network: new StacksTestnet(),
    // Passing the post conditions here
    // postConditions: stx_post_condition(),
    postConditionMode: 1,
    appDetails: {
      name: "nft_test_201",
      icon: "https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg",
    },
    onFinish: (data) => {
      console.log(data);
    },
  });
}
