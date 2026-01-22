import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all tickets
  const fetchTickets = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await API.get(`/tickets${queryParams ? '?' + queryParams : ''}`);
      setTickets(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets by project
  const fetchTicketsByProject = async (projectId) => {
    try {
      setLoading(true);
      const response = await API.get(`/tickets/project/${projectId}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch project tickets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single ticket
  const fetchTicket = async (id) => {
    try {
      setLoading(true);
      const response = await API.get(`/tickets/${id}`);
      setCurrentTicket(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch ticket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create ticket
  const createTicket = async (ticketData) => {
    try {
      const response = await API.post('/tickets', ticketData);
      setTickets([response.data, ...tickets]);
      toast.success('Ticket created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
      return null;
    }
  };

  // Update ticket
  const updateTicket = async (id, ticketData) => {
    try {
      const response = await API.put(`/tickets/${id}`, ticketData);
      setTickets(tickets.map(ticket => 
        ticket._id === id ? response.data : ticket
      ));
      if (currentTicket?._id === id) {
        setCurrentTicket(response.data);
      }
      toast.success('Ticket updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
      return null;
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    try {
      await API.delete(`/tickets/${id}`);
      setTickets(tickets.filter(ticket => ticket._id !== id));
      toast.success('Ticket deleted successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
      return false;
    }
  };

  // Assign ticket
  const assignTicket = async (id, userId) => {
    try {
      const response = await API.put(`/tickets/${id}/assign`, { userId });
      setTickets(tickets.map(ticket => 
        ticket._id === id ? response.data : ticket
      ));
      if (currentTicket?._id === id) {
        setCurrentTicket(response.data);
      }
      toast.success('Ticket assigned successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign ticket');
      return null;
    }
  };

  // Fetch tickets when user logs in
  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      setTickets([]);
      setCurrentTicket(null);
    }
  }, [user]);

  const value = {
    tickets,
    currentTicket,
    loading,
    fetchTickets,
    fetchTicketsByProject,
    fetchTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    setCurrentTicket
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};
