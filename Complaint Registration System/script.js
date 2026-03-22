// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let complaints = [];
let currentFilter = 'all';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadComplaints();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('complaintForm');
    form.addEventListener('submit', handleFormSubmit);
}

// Tab switching
function switchTab(tab) {
    const submitTab = document.getElementById('submitTab');
    const viewTab = document.getElementById('viewTab');
    const submitPane = document.getElementById('submitPane');
    const viewPane = document.getElementById('viewPane');

    if (tab === 'submit') {
        submitTab.classList.add('active');
        viewTab.classList.remove('active');
        submitPane.classList.add('active');
        viewPane.classList.remove('active');
    } else {
        submitTab.classList.remove('active');
        viewTab.classList.add('active');
        submitPane.classList.remove('active');
        viewPane.classList.add('active');
    }
}

// Load all complaints from backend
async function loadComplaints() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/complaints`);
        
        if (!response.ok) {
            throw new Error('Failed to load complaints');
        }
        
        complaints = await response.json();
        updateUI();
        hideLoading();
    } catch (error) {
        console.error('Error loading complaints:', error);
        showToast('Failed to load complaints. Make sure Flask backend is running.', 'error');
        hideLoading();
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        category: document.getElementById('category').value,
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value
    };

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/complaints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit complaint');
        }

        const newComplaint = await response.json();
        complaints.unshift(newComplaint);
        
        // Reset form
        document.getElementById('complaintForm').reset();
        
        // Switch to view tab
        switchTab('view');
        
        updateUI();
        showToast('Complaint submitted successfully!', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error submitting complaint:', error);
        showToast('Failed to submit complaint. Please try again.', 'error');
        hideLoading();
    }
}

// Update complaint status
async function updateStatus(id, status) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        const updatedComplaint = await response.json();
        const index = complaints.findIndex(c => c.id === id);
        if (index !== -1) {
            complaints[index] = updatedComplaint;
        }

        updateUI();
        showToast('Status updated successfully!', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status. Please try again.', 'error');
        hideLoading();
    }
}

// Delete complaint
async function deleteComplaint(id) {
    if (!confirm('Are you sure you want to delete this complaint?')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete complaint');
        }

        complaints = complaints.filter(c => c.id !== id);
        updateUI();
        showToast('Complaint deleted successfully!', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error deleting complaint:', error);
        showToast('Failed to delete complaint. Please try again.', 'error');
        hideLoading();
    }
}

// Filter complaints
function filterComplaints(filter) {
    currentFilter = filter;
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderComplaints();
}

// Update entire UI
function updateUI() {
    updateStats();
    renderComplaints();
}

// Update statistics
function updateStats() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('progressCount').textContent = inProgress;
    document.getElementById('resolvedCount').textContent = resolved;
    document.getElementById('complaintBadge').textContent = total;

    // Update filter counts
    document.getElementById('filterAllCount').textContent = total;
    document.getElementById('filterPendingCount').textContent = pending;
    document.getElementById('filterProgressCount').textContent = inProgress;
    document.getElementById('filterResolvedCount').textContent = resolved;
}

// Render complaints list
function renderComplaints() {
    const container = document.getElementById('complaintsList');
    
    let filteredComplaints = complaints;
    if (currentFilter !== 'all') {
        filteredComplaints = complaints.filter(c => c.status === currentFilter);
    }

    if (filteredComplaints.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p style="font-size: 18px; margin-bottom: 8px;">No complaints found</p>
                <p>Submit your first complaint to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredComplaints.map(complaint => `
        <div class="complaint-item">
            <div class="complaint-header">
                <div class="complaint-title">
                    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px;">
                        <h3>${escapeHtml(complaint.subject)}</h3>
                        <span class="status-badge status-${complaint.status}">
                            ${getStatusIcon(complaint.status)}
                            ${complaint.status.toUpperCase().replace('-', ' ')}
                        </span>
                    </div>
                    <div class="complaint-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${formatDate(complaint.date)}
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                            ${getCategoryLabel(complaint.category)}
                        </span>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteComplaint('${complaint.id}')" title="Delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <div class="complaint-description">
                <p>${escapeHtml(complaint.description)}</p>
            </div>

            <div class="complaint-contact">
                <p>Contact Information:</p>
                <div class="contact-info">
                    <span><strong>Name:</strong> ${escapeHtml(complaint.name)}</span>
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${escapeHtml(complaint.email)}
                    </span>
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        ${escapeHtml(complaint.phone)}
                    </span>
                </div>
            </div>

            <div class="status-actions">
                <button class="status-btn status-btn-pending" 
                        onclick="updateStatus('${complaint.id}', 'pending')"
                        ${complaint.status === 'pending' ? 'disabled' : ''}>
                    Pending
                </button>
                <button class="status-btn status-btn-progress" 
                        onclick="updateStatus('${complaint.id}', 'in-progress')"
                        ${complaint.status === 'in-progress' ? 'disabled' : ''}>
                    In Progress
                </button>
                <button class="status-btn status-btn-resolved" 
                        onclick="updateStatus('${complaint.id}', 'resolved')"
                        ${complaint.status === 'resolved' ? 'disabled' : ''}>
                    Resolved
                </button>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getStatusIcon(status) {
    const icons = {
        'pending': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        'in-progress': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        'resolved': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    };
    return icons[status] || '';
}

function getCategoryLabel(category) {
    const labels = {
        'service': 'Service Quality',
        'product': 'Product Issue',
        'billing': 'Billing/Payment',
        'delivery': 'Delivery',
        'staff': 'Staff Behavior',
        'technical': 'Technical Issue',
        'other': 'Other'
    };
    return labels[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
