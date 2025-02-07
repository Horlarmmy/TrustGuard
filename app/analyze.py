from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
import json


# Define vulnerability patterns and their corresponding fixes
VULNERABILITY_PATTERNS = {
    "Overflow": {
        "patterns": ["uint", "+", "-", "*", "/"],
        "fixes": [
            "Use SafeMath library for arithmetic operations",
            "Add require() statements to check bounds before operations",
            "Consider using OpenZeppelin's SafeMath implementation"
        ]
    },
    "Reentrancy": {
        "patterns": ["transfer", "send", "call.value"],
        "fixes": [
            "Implement checks-effects-interactions pattern",
            "Use ReentrancyGuard from OpenZeppelin",
            "Update state variables before external calls",
            "Consider using transfer() instead of call.value()"
        ]
    },
    "Frontrunning": {
        "patterns": ["block.timestamp", "now", "blockhash"],
        "fixes": [
            "Implement commit-reveal schemes",
            "Use block.number instead of block.timestamp where possible",
            "Add minimum and maximum bounds for timing-sensitive operations"
        ]
    },
    "Unauthorized Access": {
        "patterns": ["selfdestruct", "delegatecall", "public", "external"],
        "fixes": [
            "Implement proper access control using modifiers",
            "Use OpenZeppelin's Ownable contract",
            "Add explicit function visibility modifiers",
            "Implement multi-signature requirements for critical functions"
        ]
    },
    "Gas Efficiency": {
        "patterns": ["array", "mapping", "struct", "loop"],
        "fixes": [
            "Use fixed size arrays when possible",
            "Optimize storage usage by packing variables",
            "Avoid unnecessary loops and complex computations",
            "Consider using events instead of storage for historical data"
        ]
    },
    "Self-Destruct": {
        "patterns": ["selfdestruct", "suicide"],
        "fixes": [
            "Remove selfdestruct if not absolutely necessary",
            "Implement time-locks for destructible contracts",
            "Add multi-signature requirements for self-destruct",
            "Consider making contract non-destructible"
        ]
    }
}

# Define the prompt template with corrected variable names
template = """You are a professional smart contract reviewer you will be given a smart contract and the vulnerability pattern
Based on the smart contract, extract the necessary info based on this format
{format_instructions}

# Vulnerability patterns and fixes
VULNERABILITY_PATTERNS = {vulnerability_patterns}

<smart contract>
{smart_contract}
</smart contract>"""

class SCParser(BaseModel):
    """
    Pydantic model for parsing smart contract vulnerability analysis results
    """
    category: str = Field(
        ..., 
        description="The category the issue belongs to, from overflow, reentrancy and the rest"
    )
    fixes: list = Field(
        ..., 
        description="List of suggested fixes"
    )

def analyze_smart_contract(smart_contract_text: str) -> dict:
    """
    Analyzes a smart contract for vulnerabilities using the Google Generative AI model.
    
    Args:
        smart_contract_text (str): The full text of the smart contract to analyze
        
    Returns:
        dict: JSON output containing the vulnerability category and suggested fixes
    """
    # Initialize the output parser
    parser = PydanticOutputParser(pydantic_object=SCParser)
    
    # Initialize the language model
    llm = GoogleGenerativeAI(model="gemini-1.5-flash")
    
    # Create the prompt template with correct variable names
    prompt = PromptTemplate(
        template=template,
        input_variables=["smart_contract", "vulnerability_patterns"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    # Create and execute the chain
    chain = prompt | llm | parser
    
    # Process the smart contract
    output = chain.invoke({
        "smart_contract": smart_contract_text,
        "vulnerability_patterns": json.dumps(VULNERABILITY_PATTERNS, indent=2)
    })
    
    return output.model_dump()

if __name__ == "__main__":
    # Example usage
    smart_contract_text = "contract Example { uint public value; }"
    result = analyze_smart_contract(smart_contract_text)
    print(result)