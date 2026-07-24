import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import timelineService from '../services/timelineService';
import { Spinner, Button } from '../components/ui';
import { TimelineDetailCard } from '../components/timeline/TimelineDetailCard';
import { ArrowLeft } from 'lucide-react';

export default function TimelineEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await timelineService.getEventDetails(id);
        if (res.success) {
          setEvent(res.data);
        } else {
          setError(res.message || "Failed to fetch event details.");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Event not found or you do not have permission to view it.");
        } else {
          setError("An error occurred while fetching event details.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center pb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent text-text-secondary hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timeline
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Spinner size="lg" label="Loading event details..." />
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/50 text-error px-6 py-6 rounded-xl flex flex-col items-center justify-center text-center my-8">
          <p className="font-medium text-lg mb-4">{error}</p>
          <Button variant="primary" onClick={() => navigate('/timeline')}>
            Return to Timeline
          </Button>
        </div>
      ) : (
        <TimelineDetailCard event={event} />
      )}
    </div>
  );
}
