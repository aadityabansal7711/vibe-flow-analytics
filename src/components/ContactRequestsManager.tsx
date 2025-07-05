import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  X, 
  RefreshCw,
  Eye,
  User,
  Calendar
} from 'lucide-react';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

const ContactRequestsManager = () => {
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact requests:', error);
        setMessage('Error fetching contact requests: ' + error.message);
        return;
      }
      
      setContactRequests(data || []);
      setMessage(`Loaded ${data?.length || 0} contact requests`);
    } catch (error: any) {
      console.error('Error in fetchContactRequests:', error);
      setMessage('Error fetching contact requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      setActionLoading(requestId);
      
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        setMessage('Error updating status: ' + error.message);
        return;
      }

      setMessage(`Request status updated to ${newStatus}`);
      await fetchContactRequests();
    } catch (error: any) {
      console.error('Error in updateRequestStatus:', error);
      setMessage('Error updating status: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteRequest = async (requestId: string, requesterName: string) => {
    if (!confirm(`Delete contact request from ${requesterName}?`)) return;
    
    try {
      setActionLoading(requestId);
      
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('Error deleting request:', error);
        setMessage('Error deleting request: ' + error.message);
        return;
      }

      setMessage('Contact request deleted successfully');
      await fetchContactRequests();
    } catch (error: any) {
      console.error('Error in deleteRequest:', error);
      setMessage('Error deleting request: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-400 border-amber-400">Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-400 border-green-400">Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-400 border-blue-400">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading contact requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Contact Requests</h2>
        </div>
        <Button onClick={fetchContactRequests} variant="outline" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold text-foreground">{contactRequests.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-400">
                  {contactRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-400">
                  {contactRequests.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Requests List */}
      <div className="space-y-4">
        {contactRequests.length === 0 ? (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-8 text-center">
              <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Contact Requests</h3>
              <p className="text-muted-foreground">No contact requests have been submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          contactRequests.map((request) => (
            <Card key={request.id} className="glass-effect border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{request.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{request.email}</span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    {request.subject && (
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {request.subject}
                      </h4>
                    )}
                    
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {request.message.length > 200 
                        ? `${request.message.substring(0, 200)}...` 
                        : request.message
                      }
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted {formatDate(request.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                      disabled={actionLoading === request.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRequest(request.id, request.name)}
                      disabled={actionLoading === request.id}
                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      {actionLoading === request.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="glass-effect border-border/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Contact Request Details
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedRequest.email}</p>
                </div>
              </div>
              
              {selectedRequest.subject && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-foreground font-medium">{selectedRequest.subject}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedRequest.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContactRequestsManager;