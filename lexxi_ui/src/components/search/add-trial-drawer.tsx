import { useState, useEffect } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trial, TrialStatus } from '@/types/createTrial'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Switch } from "@/components/ui/switch"
import { FormPopover } from '@/components/trial_creation/form-popover';
import { getCourthouses } from '@/app/service/courtHouseService'
import { searchTrials } from '@/app/service/SharedTrialsService'
import { useResource } from '@/hooks/useResource'

interface AddTrialDrawerProps {
  open: boolean
  onClose: () => void
  onAddTrial: (trial: Trial) => void
}

export function AddTrialDrawer({ open, onClose, onAddTrial }: AddTrialDrawerProps) {
  const [caseNumber, setCaseNumber] = useState('')
  const [plaintiff, setPlaintiff] = useState('')
  const [defendant, setDefendant] = useState('')
  const [trialType, setTrialType] = useState('')
  const [customer, setCustomer] = useState('')
  const [corporation, setCorporation] = useState('')
  const [notes, setNotes] = useState('')
  const [riskFactor, setRiskFactor] = useState('')
  const [status, setStatus] = useState<TrialStatus>('upcoming')
  const [startDate, setStartDate] = useState<Date>()
  const [leadTeam, setLeadTeam] = useState('')
  const [subscribeNotifications, setSubscribeNotifications] = useState(false)
  const [notificationSearch, setNotificationSearch] = useState('')
  const [courthouse, setCourthouse] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lawyers, setLawyers] = useState<string[]>([])

  const [customerOptions, setCustomerOptions] = useState([
    { label: "Customer 1", value: "customer1" },
    { label: "Customer 2", value: "customer2" },
  ])

  const [corporationOptions, setCorporationOptions] = useState([
    { label: "Corporation 1", value: "corp1" },
    { label: "Corporation 2", value: "corp2" },
  ])

  const [caseNumbers, setCaseNumbers] = useState<{ label: string; value: string }[]>([])
  const [selectedCourthouseId, setSelectedCourthouseId] = useState<number | null>(null)
  const { data: courthouses } = useResource(getCourthouses);

  useEffect(() => {
    const fetchCaseNumbers = async () => {
      if (selectedCourthouseId) {
        try {
          const { data: trialData } = await searchTrials('', selectedCourthouseId)
          const formattedCaseNumbers = trialData.map(trial => ({
            label: trial.case_number,
            value: trial.case_number
          }))
          setCaseNumbers(formattedCaseNumbers)
        } catch (error) {
          console.error('Error fetching case numbers:', error)
        }
      } else {
        setCaseNumbers([])
      }
    }

    fetchCaseNumbers()
  }, [selectedCourthouseId])

  const getLawyersForTeam = (team: string) => {
    const teamLawyers = {
      teamA: ["Lawyer 1", "Lawyer 2", "Lawyer 3"],
      teamB: ["Lawyer 4", "Lawyer 5", "Lawyer 6"],
    };
    return teamLawyers[team as keyof typeof teamLawyers] || [];
  };

  useEffect(() => {
    if (leadTeam) {
      setLawyers(getLawyersForTeam(leadTeam));
    }
  }, [leadTeam]);

  const handleAddCustomer = (newCustomer: string | null) => {
    if (newCustomer) {
      setCustomerOptions([...customerOptions, { 
        label: newCustomer, 
        value: newCustomer.toLowerCase().replace(/\s+/g, '_') 
      }])
    }
  }

  const handleAddCorporation = (newCorporation: string | null) => {
    if (newCorporation) {
      setCorporationOptions([...corporationOptions, { 
        label: newCorporation, 
        value: newCorporation.toLowerCase().replace(/\s+/g, '_') 
      }])
    }
  }

  const handleCourthouseChange = (value: string) => {
    const selectedCourthouse = courthouses.find(ch => ch.value === value)
    if (selectedCourthouse) {
      setCourthouse(selectedCourthouse.value) // Set the value (id) instead of the label
      setSelectedCourthouseId(Number(value))
      setCaseNumber('')  // Reset case number when courthouse changes
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!startDate) return
      const newTrial: Trial = {
        id: Date.now().toString(),
        courthouse,
        caseNumber,
        plaintiff,
        defendant,
        trialType,
        customer,
        corporation,
        notes,
        riskFactor,
        status,
        startDate: format(startDate, 'yyyy-MM-dd'),
        leadTeam,
        subscribeNotifications,
        notificationSearch: subscribeNotifications ? notificationSearch : undefined,
      }
      onAddTrial(newTrial)
      setCaseNumber('')
      setPlaintiff('')
      setDefendant('')
      setTrialType('')
      setCustomer('')
      setCorporation('')
      setNotes('')
      setRiskFactor('')
      setStatus('upcoming')
      setStartDate(undefined)
      setLeadTeam('')
      setSubscribeNotifications(false)
      setNotificationSearch('')
      setCourthouse('')
      onClose()
    } catch (error) {
      console.error('Error adding trial:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="flex flex-col h-[85vh] md:h-[90vh]">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Add New Trial</DrawerTitle>
        </DrawerHeader>
        <div className="flex-grow overflow-y-auto px-4 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Datos del Juicio</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="courthouse">Courthouse</Label>
                  <Combobox
                    options={courthouses}
                    value={courthouse}
                    onChange={handleCourthouseChange}
                    placeholder="Select courthouse"
                    optionKey="id"
                    optionLabel="abbreviation"
                  />
                </div>
                <div>
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Combobox
                    options={caseNumbers}
                    value={caseNumber}
                    onChange={setCaseNumber}
                    placeholder="Select case number"
                  />
                </div>
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex space-x-2">
                    <Combobox
                      options={customerOptions}
                      value={customer}
                      onChange={setCustomer}
                      placeholder="Select customer"
                      className="flex-grow"
                    />
                    <FormPopover
                      triggerText="Add"
                      labelText="New Customer Name"
                      placeholderText="Enter customer name"
                      onSubmit={handleAddCustomer}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="corporation">Corporation</Label>
                  <div className="flex space-x-2">
                    <Combobox
                      options={corporationOptions}
                      value={corporation}
                      onChange={setCorporation}
                      placeholder="Select corporation"
                      className="flex-grow"
                    />
                    <FormPopover
                      triggerText="Add"
                      labelText="New Corporation Name"
                      placeholderText="Enter corporation name"
                      onSubmit={handleAddCorporation}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="trialType">Trial Type</Label>
                  <Select onValueChange={setTrialType} value={trialType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trial type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plaintiff">Plaintiff</Label>
                    <Input
                      id="plaintiff"
                      value={plaintiff}
                      onChange={(e) => setPlaintiff(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="defendant">Defendant</Label>
                    <Input
                      id="defendant"
                      value={defendant}
                      onChange={(e) => setDefendant(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="subscribe-notifications"
                    checked={subscribeNotifications}
                    onCheckedChange={setSubscribeNotifications}
                  />
                  <Label htmlFor="subscribe-notifications">Subscribe to notifications</Label>
                </div>
                {subscribeNotifications && (
                  <div>
                    <Label htmlFor="notification-search">Notification Search</Label>
                    <Input
                      id="notification-search"
                      value={notificationSearch}
                      onChange={(e) => setNotificationSearch(e.target.value)}
                      placeholder="Enter search terms for notifications"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Datos del despacho</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadTeam">Lead Team</Label>
                  <Select onValueChange={setLeadTeam} value={leadTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teamA">Team A</SelectItem>
                      <SelectItem value="teamB">Team B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {lawyers.length > 0 && (
                  <div>
                    <Label>Lawyers</Label>
                    <div className="mt-1 space-y-2">
                      {lawyers.map((lawyer, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input value={lawyer} readOnly />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value: TrialStatus) => setStatus(value)} value={status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="riskFactor">Risk Factor</Label>
                  <Input
                    id="riskFactor"
                    value={riskFactor}
                    onChange={(e) => setRiskFactor(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex justify-end space-x-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DrawerClose>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Trial'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}