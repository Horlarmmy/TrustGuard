import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Import the analysis functions including fixed contract generation
from analyze import analyze_smart_contract, is_smart_contract, generate_fixed_contract

app = Flask(__name__)
CORS(app)

# Configuration from environment variables
app.config['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to TrustGuard AI'})

@app.route('/audit', methods=['POST'])
def audit():
    """Handle smart contract content analysis and generate a fixed version."""
    try:
        # Check content type
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 415
            
        # Get JSON data from request
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({'error': 'No contract content provided'}), 400

        smart_contract_text = data['content']
        
        # Basic validation of contract content
        if not smart_contract_text or not isinstance(smart_contract_text, str):
            return jsonify({'error': 'Invalid contract content'}), 400

        # Validate that the content looks like a smart contract
        if not is_smart_contract(smart_contract_text):
            return jsonify({
                'error': 'The provided content does not appear to be a valid smart contract. '
                         'Please ensure you are sending a Solidity smart contract.'
            }), 400

        # Analyze the smart contract for vulnerabilities
        analysis_result = analyze_smart_contract(smart_contract_text)
        app.logger.debug(f"Analysis result: {analysis_result}")

        # Generate a fixed version of the smart contract
        fixed_contract = generate_fixed_contract(smart_contract_text, analysis_result)
        analysis_result['fixed_contract'] = fixed_contract

        return jsonify(analysis_result)

    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)