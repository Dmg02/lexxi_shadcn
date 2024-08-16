'use client'

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublications, Publication } from "@/app/service/PublicationsService";

interface TrialDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  courthouse: string;
  caseNumber: string;
  trialId: string;
}

const PublicationCard: React.FC<Publication> = ({ agreement_date, publication_date, summary }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-sm">Publication</CardTitle>
    </CardHeader>
    <CardContent>
      <p><strong>Agreement Date:</strong> {agreement_date}</p>
      <p><strong>Publication Date:</strong> {publication_date}</p>
      <p><strong>Summary:</strong> {summary}</p>
    </CardContent>
  </Card>
);

const TrialDetailsDrawer: React.FC<TrialDetailsDrawerProps> = ({ isOpen, onClose, courthouse, caseNumber, trialId }) => {
  const [page, setPage] = React.useState(1);
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const itemsPerPage = 5;

  React.useEffect(() => {
    const fetchPublications = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const { data, count } = await getPublications(trialId, page, itemsPerPage);
        setPublications(data);
        setTotalCount(count);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setError('Failed to fetch publications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [isOpen, trialId, page]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>{courthouse} - Case {caseNumber}</SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto mt-4 pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : publications.length === 0 ? (
            <p>No publications found for this trial.</p>
          ) : (
            publications.map((pub) => (
              <PublicationCard key={pub.id} {...pub} />
            ))
          )}
        </div>
        {!isLoading && !error && publications.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t flex-shrink-0">
            <Button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TrialDetailsDrawer;