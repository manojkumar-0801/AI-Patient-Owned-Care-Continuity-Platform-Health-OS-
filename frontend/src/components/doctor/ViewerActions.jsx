import React from 'react';
import { Card, CardBody, Button } from '../ui';
import { Download, FilePlus, User, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ViewerActions = ({ record }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    if (record.file) {
      window.open(record.file, '_blank');
    }
  };

  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex flex-col gap-3">
          <Button 
            variant="primary" 
            className="w-full justify-center" 
            iconLeft={Download} 
            onClick={handleDownload}
            disabled={!record.file}
          >
            Download Record
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center" 
            iconLeft={FilePlus}
            onClick={() => alert('Add Note')}
          >
            Add Doctor Note
          </Button>
          <div className="h-px w-full bg-border my-1"></div>
          <Button 
            variant="outline" 
            className="w-full justify-center" 
            iconLeft={User}
            onClick={() => navigate(`/doctor/patients/${record.patient}`)}
          >
            Patient Details
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center" 
            iconLeft={Grid}
            onClick={() => navigate('/doctor/patients')}
          >
            Dashboard
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
