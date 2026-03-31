# Complaint Registration System

A full-stack web application for managing complaints with HTML, CSS, JavaScript frontend and Python Flask backend.

## 📋 Project Structure

```
complaint-registration-system/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript frontend logic
├── app.py              # Python Flask backend
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- A modern web browser

### Step 1: Install Python Dependencies

Open terminal/command prompt in the project directory and run:

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- flask-cors (for handling cross-origin requests)

### Step 2: Start the Flask Backend

Run the Flask server:

```bash
python app.py
```

You should see:
```
Complaint Registration System - Flask Backend
Server starting on http://localhost:5000
```

The backend is now running on port 5000.

### Step 3: Open the Frontend

Open `index.html` in your web browser:

**Option 1: Direct File**
- Simply double-click `index.html`
- Or right-click → Open with → Your Browser

**Option 2: Local Server (Recommended)**

Using Python's built-in server (in a new terminal):
```bash
python -m http.server 8000
```

Then open: http://localhost:8000

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → Open with Live Server

## 📱 How to Use

### Submit a Complaint

1. Click on the "Submit Complaint" tab
2. Fill in all required fields:
   - Full Name
   - Email Address
   - Phone Number
   - Complaint Category
   - Subject
   - Description
3. Click "Submit Complaint"
4. You'll be automatically redirected to view your complaint

### View Complaints

1. Click on the "View Complaints" tab
2. Filter complaints by status:
   - All
   - Pending
   - In Progress
   - Resolved
3. Each complaint shows:
   - Subject and status
   - Date and category
   - Full description
   - Contact information

### Update Status

- Click on the status buttons (Pending, In Progress, Resolved) to update
- Changes are saved immediately to the backend

### Delete Complaint

- Click the red trash icon on any complaint
- Confirm the deletion
- Complaint is permanently removed

## 🎨 Features

✅ **Complete Complaint Management**
- Submit new complaints
- View all complaints
- Update complaint status
- Delete complaints

✅ **Real-time Statistics**
- Total complaints
- Pending complaints
- In-progress complaints
- Resolved complaints

✅ **User-Friendly Interface**
- Clean, modern design
- Responsive layout (mobile-friendly)
- Easy navigation
- Status filtering

✅ **Data Persistence**
- All data saved to `complaints.json`
- Survives server restarts
- No database setup required

## 🔧 API Endpoints

The Flask backend provides these REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | Get all complaints |
| POST | `/api/complaints` | Create new complaint |
| PUT | `/api/complaints/<id>` | Update complaint status |
| DELETE | `/api/complaints/<id>` | Delete complaint |
| GET | `/api/stats` | Get statistics |

### Example API Usage

**Create a complaint:**
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "category": "service",
    "subject": "Poor Service",
    "description": "The service was very slow"
  }'
```

**Get all complaints:**
```bash
curl http://localhost:5000/api/complaints
```

**Update status:**
```bash
curl -X PUT http://localhost:5000/api/complaints/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

**Delete complaint:**
```bash
curl -X DELETE http://localhost:5000/api/complaints/1
```

## 📂 Data Storage

Complaints are stored in `complaints.json` in the following format:

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "category": "service",
    "subject": "Poor Service",
    "description": "The service was very slow",
    "status": "pending",
    "date": "2026-01-21T10:30:00.000000"
  }
]
```

## 🛠️ Customization

### Change Backend Port

Edit `app.py`, line at the bottom:
```python
app.run(debug=True, port=5000)  # Change 5000 to your port
```

Also update `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';  // Update port
```

### Add More Categories

Edit `index.html`, find the category select:
```html
<option value="new-category">New Category</option>
```

### Modify Colors/Styling

Edit `styles.css` to change:
- Colors
- Fonts
- Layout
- Spacing

## 🔒 Security Notes

⚠️ **This is a basic implementation for learning/project purposes.**

For production use, you should add:
- User authentication
- Input validation and sanitization
- SQL injection prevention (if using database)
- HTTPS encryption
- Rate limiting
- CSRF protection

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Make sure Flask is running (python app.py)
- Check the console for CORS errors
- Verify API_BASE_URL in script.js matches Flask port

**Port already in use:**
- Change the port in app.py
- Kill the process using the port

**Flask not found:**
- Install dependencies: `pip install -r requirements.txt`

**No complaints showing:**
- Check browser console for errors
- Verify Flask server is running
- Try submitting a new complaint

## 📚 Technologies Used

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

**Backend:**
- Python 3
- Flask
- Flask-CORS

**Data Storage:**
- JSON file (complaints.json)


