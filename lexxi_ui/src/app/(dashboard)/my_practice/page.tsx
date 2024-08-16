'use client'

import React, { useMemo } from 'react';
import { trialService, OrgTrial } from '@/app/service/orgTrials';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useResource } from '@/hooks/useResource';
import { useAuth } from '@/context/useAuth';

const MyPracticePage: React.FC = () => {
  const { user, isAuthChecked } = useAuth();

  const { data: trials, isLoading, error } = useResource<OrgTrial[]>(
    trialService.getTrials,
    user?.organization_id
  );

  const filterOptions = useMemo(() => {
    if (!trials) return { state: [], courthouse: [], customer: [], corporation: [] };

    return {
      state: Array.from(new Set(trials.map(trial => trial.state))).filter(Boolean),
      courthouse: Array.from(new Set(trials.map(trial => trial.courthouse))).filter(Boolean),
      customer: Array.from(new Set(trials.map(trial => trial.customer))).filter(Boolean),
      corporation: Array.from(new Set(trials.map(trial => trial.corporation))).filter(Boolean),
    };
  }, [trials]);

  if (!isAuthChecked || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.organization_id) {
    return <div>Error: No organization ID found for the current user.</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Organization Trials Report</h1>
      {trials && trials.length > 0 ? (
        <DataTable columns={columns} data={trials} filterOptions={filterOptions} />
      ) : (
        <div>No trials found for this organization.</div>
      )}
    </div>
  );
};

export default MyPracticePage;