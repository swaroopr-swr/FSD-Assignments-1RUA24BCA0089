import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Global Application State (State Management Concept)
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ foundCount: 0, lostCount: 0, returnedCount: 0, pendingClaimsCount: 0 });
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Filter & Navigation State
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'dashboard'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'found' | 'lost'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Available' | 'Returned' | 'Lost'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Dialog States
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Flash / Toast Feedback State
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Initial Data Fetch
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes, catsRes, studentsRes, authRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/stats'),
        fetch('/api/categories'),
        fetch('/api/students'),
        fetch('/api/auth/me')
      ]);

      const itemsData = await itemsRes.json();
      const statsData = await statsRes.json();
      const catsData = await catsRes.json();
      const studentsData = await studentsRes.json();
      const authData = await authRes.json();

      setItems(itemsData.items || []);
      setStats(statsData);
      setCategories(catsData.categories || []);
      setStudents(studentsData.students || []);

      if (authData.authenticated && authData.student) {
        setCurrentStudent(authData.student);
      } else if (studentsData.students && studentsData.students.length > 0) {
        // Auto-select first student if not authenticated for seamless demo
        setCurrentStudent(studentsData.students[0]);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      showNotification('Failed to connect to Property Office API', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch single item details when selected
  useEffect(() => {
    if (!selectedItemId) {
      setSelectedItemDetails(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/items/${selectedItemId}`);
        const data = await res.json();
        if (res.ok) {
          setSelectedItemDetails(data);
        } else {
          showNotification(data.error || 'Failed to load case file', 'error');
        }
      } catch (err) {
        console.error('Error fetching case file details:', err);
      }
    };

    fetchDetails();
  }, [selectedItemId, currentStudent]);

  // Event Action: Switch Active Student Identity
  const handleSwitchStudent = async (studentId) => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentStudent(data.student);
        showNotification(data.message, 'success');
        if (selectedItemId) {
          // Re-fetch item to recalculate finder/claimant permissions
          const itemRes = await fetch(`/api/items/${selectedItemId}`);
          const itemData = await itemRes.json();
          setSelectedItemDetails(itemData);
        }
      } else {
        showNotification(data.error || 'Failed to switch identity', 'error');
      }
    } catch (err) {
      showNotification('Server communication error', 'error');
    }
  };

  // Event Action: Report New Property
  const handleReportItem = async (formData) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, 'success');
        setIsReportModalOpen(false);
        fetchInitialData();
        return { success: true };
      } else {
        return { success: false, error: data.error, fields: data.fields };
      }
    } catch (err) {
      return { success: false, error: 'Network error lodging report' };
    }
  };

  // Event Action: Submit Ownership Claim
  const handleSubmitClaim = async (itemId, reason) => {
    try {
      const res = await fetch(`/api/items/${itemId}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, 'success');
        setIsClaimModalOpen(false);
        // Refresh item details to show new claim
        const itemRes = await fetch(`/api/items/${itemId}`);
        const itemData = await itemRes.json();
        setSelectedItemDetails(itemData);
        fetchInitialData();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error submitting claim slip' };
    }
  };

  // Event Action: Decide Claim (Approve / Reject)
  const handleDecideClaim = async (claimId, status) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, 'success');
        // Re-fetch item to reflect returned status and updated claim state
        if (selectedItemId) {
          const itemRes = await fetch(`/api/items/${selectedItemId}`);
          const itemData = await itemRes.json();
          setSelectedItemDetails(itemData);
        }
        fetchInitialData();
      } else {
        showNotification(data.error || 'Failed to update decision', 'error');
      }
    } catch (err) {
      showNotification('Network error recording decision', 'error');
    }
  };

  // Computed Filtered Items State
  const filteredItems = items.filter((item) => {
    if (typeFilter !== 'all' && item.itemType !== typeFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.itemName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchLoc) return false;
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        items: filteredItems,
        totalItemsCount: items.length,
        stats,
        categories,
        students,
        currentStudent,
        activeTab,
        setActiveTab,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        searchQuery,
        setSearchQuery,
        selectedItemId,
        setSelectedItemId,
        selectedItemDetails,
        isClaimModalOpen,
        setIsClaimModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        feedback,
        loading,
        handleSwitchStudent,
        handleReportItem,
        handleSubmitClaim,
        handleDecideClaim,
        refreshData: fetchInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export const useAppContext = useApp;
