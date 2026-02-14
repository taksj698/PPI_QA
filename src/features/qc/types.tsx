interface AssessmentCriteria {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
}

interface TruckQueue {
  id: string;
  plate: string;
  supplier: string;
  time: string;
  weight: string;
  type: string;
}

interface Round {
  id: number;
  name: string;
}

interface ValuesState {
  [key: string]: string;
}

interface RemarksState {
  [key: string]: string;
}