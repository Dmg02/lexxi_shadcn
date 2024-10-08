'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Make sure you have this utility function
import TrialDetailsDrawer from './TrialDetailsDrawer';

interface TrialCardProps {
  courthouse: string;
  caseNumber: string;
  isActive: boolean;
  state: string;
  trialId: string;
}

const TrialCard: React.FC<TrialCardProps> = ({ 
  courthouse, 
  caseNumber, 
  isActive, 
  state, 
  trialId
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMoreInfo = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card className="w-full h-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-lg">{caseNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>State:</strong> <span className="ml-2">{state}</span></p>
          <p><strong>Courthouse:</strong> <span className="ml-2">{courthouse}</span></p>
          <p>
            <strong>Status:</strong> 
            <Badge 
              variant={isActive ? "default" : "destructive"}
              className={cn(
                "ml-2",
                isActive && "bg-[#6dda0c] hover:bg-[#6dda0c]"
              )}
            >
              {isActive ? "Active" : "Finished"}
            </Badge>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleMoreInfo}>More Info</Button>
        </CardFooter>
      </Card>
      <TrialDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        courthouse={courthouse}
        caseNumber={caseNumber}
        trialId={trialId}
      />
    </>
  );
};

export default TrialCard;