import requests
import os
import re
import json
from pydantic import BaseModel, Field
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser

# Replace with your API key
ETHERSCAN_API_KEY = ""
WALLET_ADDRESS = "0x3d7fEA9a2585B83f56c61e132e7136D78d1E92Ac"

def getETherBalance(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    url = f"https://api.etherscan.io/api?module=account&action=balance&address={WALLET_ADDRESS}&tag=latest&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url)
    data = response.json()
    balance = int(data['result']) / 1e18
    return balance

def fetchTx(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={WALLET_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url)
    data = response.json()
    transactions = []
    if data["status"] == "1":
        transactions = data["result"]
    return transactions

def contractTx(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    url_internal = f"https://api.etherscan.io/api?module=account&action=txlistinternal&address={WALLET_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey={ETHERSCAN_API_KEY}"
    response_internal = requests.get(url_internal)
    data_internal = response_internal.json()
    internal_txs = []
    if data_internal["status"] == "1":
        internal_txs = data_internal["result"]
    return internal_txs

def tokenTx(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    url_token = f"https://api.etherscan.io/api?module=account&action=tokentx&address={WALLET_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey={ETHERSCAN_API_KEY}"
    response_token = requests.get(url_token)
    data_token = response_token.json()
    token_txs = []
    if data_token["status"] == "1":
        token_txs = data_token["result"]
    return token_txs

def nft_token_tx(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    url_token = f"https://api.etherscan.io/api?module=account&action=tokennfttx&address={WALLET_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey={ETHERSCAN_API_KEY}"
    response_token = requests.get(url_token)
    data_token = response_token.json()
    nft_txs = []
    if data_token["status"] == "1":
        nft_txs = data_token["result"]
    return nft_txs

def getEthereumData(WALLET_ADDRESS, ETHERSCAN_API_KEY):
    data = {
        "balance": getETherBalance(WALLET_ADDRESS, ETHERSCAN_API_KEY),
        "normal_tx": fetchTx(WALLET_ADDRESS, ETHERSCAN_API_KEY),
        "internal_tx": contractTx(WALLET_ADDRESS, ETHERSCAN_API_KEY),
        "token_tx": tokenTx(WALLET_ADDRESS, ETHERSCAN_API_KEY),
        "nft_tx": nft_token_tx(WALLET_ADDRESS, ETHERSCAN_API_KEY)
    }
    return data

# Example usage
ethereum_data = getEthereumData(WALLET_ADDRESS, ETHERSCAN_API_KEY)
print(json.dumps(ethereum_data, indent=4))

# ### AI to format and structure data

# # Prompt template for vulnerability analysis
# template = """You are a professional data analyst. You are provided with data about a wallet address to determine the reputation score.
# Identify the most critical vulnerability in the contract from the following categories:
# Overflow, Reentrancy, Frontrunning, Unauthorized Access, Gas Efficiency, Self-Destruct.
# For the identified vulnerability, provide a list of recommended fixes.
# Return a JSON object that follows this format:
# {format_instructions}

# # Vulnerability patterns and fixes
# VULNERABILITY_PATTERNS = {vulnerability_patterns}

# <smart contract>
# {smart_contract}
# </smart contract>
# """


#Returns
#The address is a contract or externally owned account
#The age of the wallet
#The balance of the wallet
#The number of transactions
#the reputation of the address is 70/100

