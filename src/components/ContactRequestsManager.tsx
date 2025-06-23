
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Search, MessageSquare, Calendar, CheckCircle, Clock } from 'lucide-react';

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
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact requests:', error);
        toast.error('Failed to load contact requests');
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Request marked as ${newStatus}`);
      await fetchContactRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.subject && request.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-400';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-400';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading contact requests...</div>;
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Contact Requests ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 'No requests found matching your filters.' : 'No contact requests yet.'}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-4 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{request.name}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {request.status !== 'resolved' && (
                      <>
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, 'in_progress')}
                            className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
                          >
                            Mark In Progress
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(request.id, 'resolved')}
                          className="text-green-400 border-green-400 hover:bg-green-400/10"
                        >
                          Mark Resolved
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {request.subject && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-foreground">Subject: </span>
                    <span className="text-sm text-muted-foreground">{request.subject}</span>
                  </div>
                )}
                
                <div className="mt-3 p-3 bg-background/50 rounded border border-border/30">
                  <span className="text-sm font-medium text-foreground">Message:</span>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{request.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactRequestsManager;
