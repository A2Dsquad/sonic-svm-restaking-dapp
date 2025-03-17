import { PublicKey } from "@solana/web3.js";

export const OPERATOR_1_ADDRESS =
  "0xa56762ce4e11553d450c1db24fdfd204176d31179e72027319bbce9dc3a1376";
export const OPERATOR_2_ADDRESS =
  "0xf3e1e89a5673d4118c92736ee42e44abadbb35873e928119b0b1155b7c8606d2";
export const TOKEN_ADDRESS =
  "0x3a97789007a67518d51c1733caef0c0a60d5db819e64d9bb5abc004f2df934a2";
export const POOL_ADDRESS =
  "0x7609205655ba8dd9c6882d2a8e025e3262b244c1c9b174f2711f688c49f6a6e2";

export const STAKE_POOL_MINT = new PublicKey(
  "8DPF9cZzpSoXuvTT92AXJL5wy4Cz4Y8Y4YsRFv7idn3t"
);
export const POOL_MINT = new PublicKey(
  "DRku5U6mhLwSUecTwLa8byvkP1jAb3tX1mY92i4XBJRa"
);

export const mapTokenToPool = {
  [TOKEN_ADDRESS]: POOL_ADDRESS,
};

export const fakeOperators = [
  {
    id: "1",
    address: OPERATOR_1_ADDRESS,
    name: "AnyAxis",
    avatar: "/assets/anyaxis.jpg",
    totalRestaked: "$18M",
    delegatedTVL: "$217.57K",
    stakers: 106,
    avssSecured: 3,
    isDelegated: false,
    about:
      "Any.Axis is a leading validator in the network with a strong track record of performance and reliability. Decentrio is a leading validator in the network with a strong track record of performance and reliability.",
  },
  {
    id: "2",
    address: OPERATOR_2_ADDRESS,
    name: "Decentrio",
    avatar: "/assets/decentrio.jpg",
    totalRestaked: "$12M",
    delegatedTVL: "$217.57K",
    stakers: 156,
    avssSecured: 1,
    isDelegated: false,
    about:
      "Decentrio offers competitive staking rewards and has a robust infrastructure to support network operations.",
  },
];
