import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  NonFungibleConditionCode,
  bufferCVFromString,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  makeContractNonFungiblePostCondition,
} from "@stacks/transactions";


export function stx_post_condition() {
  const postConditionAddress = "ST2R8A2ZE5GQYMWG4E0VATB4Y14NDNP6NVDNDXACY";
  const nftPostConditionCode = NonFungibleConditionCode.DoesNotOwn;
  const assetContractName = "nft_test_201";
  const assetName = "NFT-NAME";
  const assetAddress = "ST37D1N1MKJ6N5EHHQPEK35Z9WPT6KGXFDHJA7A9";
  const tokenAssetName = bufferCVFromString("nft-name");
  const nonFungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );


  const stxConditionCode = FungibleConditionCode.LessEqual;
  const stxConditionAmount = 3n; // denoted in microstacks

  const postConditions = [
    makeStandardNonFungiblePostCondition(
      postConditionAddress,
      nftPostConditionCode,
      nonFungibleAssetInfo,
      tokenAssetName
    ),

    makeContractNonFungiblePostCondition(
        assetAddress,
        "marketplace_test_200",
        NonFungibleConditionCode.Owns,
        nonFungibleAssetInfo,
        tokenAssetName
    )
    // makeStandardSTXPostCondition(
    //   postConditionAddress,
    //   stxConditionCode,
    //   stxConditionAmount
    // ),
  ];

  return postConditions;
}
