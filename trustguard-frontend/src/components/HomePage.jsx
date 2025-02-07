import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import AiLogo from "../assets/ai-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;

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

function HomePage() {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(provider);
  // console.log(userInfo.profileImage);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/upload");
  };

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

  const getUserInfo = async () => {
    if (web3Auth.connected) {
      const user = await web3Auth.getUserInfo();
      setUserInfo(user);
    }
  };

  if (loading) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <h1></h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/60 md:pt-8 text-white  px-8">
      <header className=" md:mx-auto w-full  md:max-w-7xl flex justify-between items-center md:px-10 border-gray-700 md:border  rounded-full  py-6">
        <h1 className="text-xl md:text-3xl font-bold">TrustGuard</h1>
        {!loggedIn ? (
          <Button
            onClick={login}
            className="px-4 py-2 lg:px-8 lg:py-6 bg-blue-600 rounded-3xl hover:bg-blue-500 text-white font-medium text-base md:text-xl"
          >
            Login
            <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5 " />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="flex items-center cursor-pointer"
              >
                <img
                  src={
                    userInfo && userInfo.profileImage
                      ? userInfo.profileImage
                      : "https://avatars.dicebear.com/api/avataaars/anonymous.svg"
                  }
                  className="h-10 w-10 rounded-full object-cover mr-1"
                />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={getUserInfo}>
                {userInfo ? userInfo.name : "Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href={"/settings"}>Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <main className="flex flex-col justify-center items-center space-y-16 mt-20">
        <div className=" mx-auto max-w-7xl justify-center grid items-center md:grid-cols-2 gap-28 ">
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
            className="h-fit w-fit lg:ml-16  object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
        {!loggedIn ? (
          <button
            onClick={login}
            className="px-6 py-3  bg-blue-600 rounded-3xl hover:bg-blue-500 text-lg"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleGetStarted}
            className="px-6 py-3  bg-blue-600 rounded-3xl hover:bg-blue-500 text-lg"
          >
            Get Started
          </button>
        )}
      </main>
    </div>
  );
}

export default HomePage;
