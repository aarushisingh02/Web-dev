# Flask Backend for Complaint Registration System
# Run this file with: python app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests from frontend

# Data storage file
DATA_FILE = 'complaints.json'

# In-memory storage
complaints = []

# Helper functions for data persistence
def load_complaints():
    """Load complaints from JSON file"""
    global complaints
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                complaints = json.load(f)
                print(f"Loaded {len(complaints)} complaints from {DATA_FILE}")
        except Exception as e:
            print(f"Error loading complaints: {e}")
            complaints = []
    else:
        complaints = []

def save_complaints():
    """Save complaints to JSON file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(complaints, f, indent=2)
    except Exception as e:
        print(f"Error saving complaints: {e}")

# Load complaints on startup
load_complaints()

# Routes
@app.route('/')
def home():
    """Welcome endpoint"""
    return jsonify({
        'message': 'Complaint Registration System API',
        'version': '1.0',
        'endpoints': {
            'GET /api/complaints': 'Get all complaints',
            'POST /api/complaints': 'Create new complaint',
            'PUT /api/complaints/<id>': 'Update complaint status',
            'DELETE /api/complaints/<id>': 'Delete complaint',
            'GET /api/stats': 'Get statistics'
        }
    })

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    """Get all complaints"""
    return jsonify(complaints), 200

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'category', 'subject', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate unique ID
        new_id = str(len(complaints) + 1) if complaints else '1'
        
        # Create new complaint object
        complaint = {
            'id': new_id,
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'category': data['category'],
            'subject': data['subject'],
            'description': data['description'],
            'status': 'pending',
            'date': datetime.now().isoformat()
        }
        
        # Add to beginning of list
        complaints.insert(0, complaint)
        save_complaints()
        
        print(f"Created complaint #{new_id}: {complaint['subject']}")
        return jsonify(complaint), 201
        
    except Exception as e:
        print(f"Error creating complaint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """Update complaint status"""
    try:
        data = request.json
        
        # Find complaint by ID
        for complaint in complaints:
            if complaint['id'] == complaint_id:
                if 'status' in data:
                    old_status = complaint['status']
                    complaint['status'] = data['status']
                    save_complaints()
                    print(f"Updated complaint #{complaint_id} status: {old_status} -> {data['status']}")
                return jsonify(complaint), 200
        
        return jsonify({'error': 'Complaint not found'}), 404
        
    except Exception as e:
        print(f"Error updating complaint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/complaints/<complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    """Delete a complaint"""
    try:
        global complaints
        initial_length = len(complaints)
        
        # Filter out the complaint to delete
        complaints = [c for c in complaints if c['id'] != complaint_id]
        
        if len(complaints) == initial_length:
            return jsonify({'error': 'Complaint not found'}), 404
        
        save_complaints()
        print(f"Deleted complaint #{complaint_id}")
        return jsonify({'message': 'Complaint deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting complaint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get complaint statistics"""
    stats = {
        'total': len(complaints),
        'pending': len([c for c in complaints if c['status'] == 'pending']),
        'in_progress': len([c for c in complaints if c['status'] == 'in-progress']),
        'resolved': len([c for c in complaints if c['status'] == 'resolved']),
        'by_category': {}
    }
    
    # Count by category
    for complaint in complaints:
        category = complaint['category']
        if category in stats['by_category']:
            stats['by_category'][category] += 1
        else:
            stats['by_category'][category] = 1
    
    return jsonify(stats), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Run the application
if __name__ == '__main__':
    print("=" * 50)
    print("Complaint Registration System - Flask Backend")
    print("=" * 50)
    print("Server starting on http://localhost:5000")
    print("API documentation available at http://localhost:5000")
    print("Press CTRL+C to quit")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')
