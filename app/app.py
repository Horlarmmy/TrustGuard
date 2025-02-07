import os
from dotenv import load_dotenv
from flask import Flask, request, render_template, jsonify
import tempfile

# Load environment variables
load_dotenv()

# Import the analysis functions including fixed contract generation
from analyze import analyze_smart_contract, is_smart_contract, generate_fixed_contract

app = Flask(__name__)

# Configuration from environment variables
app.config['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/')
def home():
    """Render the home page with code samples"""
    code_samples = [
        {
            'title': 'Reentrancy Vulnerability',
            'code': '''
contract VulnerableBank {
    mapping(address => uint) public balances;

    function withdraw() public {
        uint balance = balances[msg.sender];
        require(balance > 0);
        
        // Vulnerability: External call before state update
        msg.sender.transfer(balance);
        balances[msg.sender] = 0;
    }
}''',
            'fix': '''
contract SecureBank {
    mapping(address => uint) public balances;

    function withdraw() public {
        uint balance = balances[msg.sender];
        require(balance > 0);
        
        // Fix: Update state before external call
        balances[msg.sender] = 0;
        msg.sender.transfer(balance);
    }
}'''
        },
         ]
    return render_template('index.html', code_samples=code_samples)

@app.route('/audit', methods=['POST'])
def audit():
    """Handle smart contract audit requests and generate a fixed version of the contract."""
    try:
        # Check for file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.lower().endswith(('.sol', '.txt')):
            return jsonify({'error': 'Invalid file type. Please upload a Solidity (.sol) or text file.'}), 400

        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                file.save(temp_file.name)
                with open(temp_file.name, 'r') as f:
                    smart_contract_text = f.read()
        except IOError as e:
            return jsonify({'error': f'File operation failed: {str(e)}'}), 500
        finally:
            try:
                os.unlink(temp_file.name)
            except (OSError, UnboundLocalError):
                pass

        # Validate that the uploaded file looks like a smart contract
        if not is_smart_contract(smart_contract_text):
            return jsonify({
                'error': 'The uploaded file does not appear to be a valid smart contract. '
                         'Please upload a Solidity smart contract file.'
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

if __name__ == '__main__':
    app.run(debug=True)
