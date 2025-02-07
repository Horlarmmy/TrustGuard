from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
from analyze import analyze_smart_contract

app = Flask(__name__)

# Use system temp directory instead of local uploads folder
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'sol', 'txt'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/audit', methods=['POST'])
def audit():
    """Handle smart contract audit requests"""
    try:
        # Check if API key is provided (if required)
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return jsonify({'error': 'API key is required'}), 401

        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                # Save uploaded content to temp file
                file.save(temp_file.name)
                
                # Read the smart contract
                with open(temp_file.name, 'r') as f:
                    smart_contract_text = f.read()

        except IOError as e:
            return jsonify({'error': f'File operation failed: {str(e)}'}), 500
        
        finally:
            # Clean up: remove temp file if it exists
            try:
                os.unlink(temp_file.name)
            except (OSError, UnboundLocalError):
                pass  # Ignore if file doesn't exist or wasn't created

        # Analyze the smart contract
        result = analyze_smart_contract(smart_contract_text)
        return jsonify(result)

    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

if __name__ == '__main__':
    app.run(debug=True)