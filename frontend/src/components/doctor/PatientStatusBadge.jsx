import React from 'react';
import { Badge } from '../ui';

export const PatientStatusBadge = ({ isActive }) => {
  if (isActive) {
    return <Badge variant="success">Active</Badge>;
  }
  return <Badge variant="error">Inactive</Badge>;
};
