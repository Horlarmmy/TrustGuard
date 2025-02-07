import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Web3Auth } from "@web3auth/modal";

import AiLogo from "./assets/ai-logo.png";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
console.log(clientId);

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://assets.web3auth.io/evm-chains/sepolia.png",
};
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3Auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

function App() {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await web3Auth.initModal();
        setProvider(web3Auth.provider);

        if (web3Auth.connected) {
          setLoggedIn(true);
          const user = await web3Auth.getUserInfo();
          setUserInfo(user);
          // if (user.email) {
          //   localStorage.setItem("userEmail", user.email);
          //   try {
          //     await createUser(user.email, user.name || "Anonymous User");
          //   } catch (error) {
          //     console.error("Error Creating User", error);
          //   }
          // }
        }
      } catch (error) {
        console.error("Error Initializing Web3Auth", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3Auth) {
      console.error("Web3Auth is not initialized");
      return;
    }
    try {
      const web3authProvider = await web3Auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
      const user = await web3Auth.getUserInfo();
      setUserInfo(user);
      // if (user.email) {
      //   localStorage.setItem("userEmail", user.email);
      //   try {
      //     await createUser(user.email, user.name || "Anonymous User");
      //   } catch (error) {
      //     console.error("Error Creating User", error);
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      console.error("Web3Auth is not initialized");
      return;
    }
    try {
      await web3Auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      // localStorage.removeItem("userEmail");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black/60 md:pt-8 text-white  px-8">
      <header className=" md:mx-auto w-full  md:max-w-7xl flex justify-between items-center md:px-10 border-gray-700 md:border  rounded-full  py-6">
        <h1 className="text-xl md:text-3xl font-bold">TrustGuard</h1>
        <button
          // onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Connect Wallet
        </button>
      </header>
      <main className="flex flex-col justify-center items-center space-y-20 mt-24">
        <div className=" mx-auto max-w-7xl justify-center grid items-center md:grid-cols-2 gap-32 ">
          <div className="space-y-9">
            <motion.h1
              className="text-5xl font-semibold leading-normal text-start"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              AI-Powered Audit and Reputation Security
            </motion.h1>
            <p className="text-xl text-gray-400 text-start max-w-2xl">
              Revolutionizing Smart Contract Verification. Safeguard smart
              contracts across all chains—Ethereum, Avalanche, Solana, Arbitrum,
              and more.
            </p>
          </div>

          <motion.img
            src={AiLogo}
            alt="AI Bot"
            className="h-fit w-fit  object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>

        <button className="px-6 py-3  bg-blue-600 rounded-lg hover:bg-blue-500 text-lg">
          Get Started
        </button>
      </main>
    </div>
  );
}

export default App;
