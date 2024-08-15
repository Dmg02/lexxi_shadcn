"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getStates } from "@/app/service/StatesService";
import { getCourthouses } from "@/app/service/CourtHouseService";
import { searchTrials } from "@/app/service/SharedTrialsService";
import TrialCard from '@/components/search/TrialCard';

interface State {
  id: number;
  name: string;
}

interface Courthouse {
  id: number;
  abbreviation: string;
}

interface Trial {
  id: number;
  case_number: string;
  courthouse_id: number;
  is_active: boolean;
  state: string;
}

const SearchTrialsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCourthouse, setSelectedCourthouse] = useState<string | undefined>(undefined)
  const [states, setStates] = useState<State[]>([]);
  const [courthouses, setCourthouses] = useState<Courthouse[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const pageSize = 10;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await getStates();
        setStates(statesData);
      } catch (error) {
        console.error('Error fetching states:', error);
        toast({
          title: "Error",
          description: "Failed to fetch states. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCourthouses = async () => {
      try {
        const courthousesData = await getCourthouses(selectedState);
        setCourthouses(courthousesData);
      } catch (error) {
        console.error('Error fetching courthouses:', error);
        toast({
          title: "Error",
          description: "Failed to fetch courthouses. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchCourthouses();
    setSelectedCourthouse(null); // Reset selected courthouse when state changes
  }, [selectedState]);

  const handleSearch = async (page: number = 1) => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query is empty",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const courthouseId = selectedCourthouse ? parseInt(selectedCourthouse) : null;
      const { data, count } = await searchTrials(searchQuery, courthouseId, page, pageSize);
      
      setTrials(data);
      setTotalCount(count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching trials:', error);
      toast({
        title: "Error",
        description: "Failed to search trials. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Search Trials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedCourthouse} onValueChange={setSelectedCourthouse}>
          <SelectTrigger>
            <SelectValue placeholder="Select a courthouse" />
          </SelectTrigger>
          <SelectContent>
            {courthouses.map((courthouse) => (
              <SelectItem key={courthouse.id} value={courthouse.id.toString()}>
                {courthouse.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Input
        type="text"
        placeholder="Enter your search query"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      
      <div className="flex justify-center">
        <Button onClick={() => handleSearch(1)} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trials.map((trial) => (
          <TrialCard
            key={trial.id}
            courthouse={courthouses.find(c => c.id === trial.courthouse_id)?.abbreviation || 'Unknown'}
            caseNumber={trial.case_number}
            isActive={trial.is_active}
            state={trial.state}
            trialId={trial.id}
          />
        ))}
      </div>

      {totalCount > pageSize && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-4">
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalCount / pageSize)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchTrialsPage