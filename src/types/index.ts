/**
 * Core data types for the Pilot Recall Assistant
 */

export type FlightPhase = 'Preflight' | 'Taxi' | 'Takeoff' | 'Climb' | 'Cruise' | 'Descent' | 'Approach' | 'Landing' | 'Shutdown'

export interface RecallItem {
  id?: number
  title: string
  description: string
  phases: FlightPhase[]
  reference: string
  mediaBlob?: Blob
  threats?: string[]
  isTier1?: boolean
  createdAt: number
  updatedAt: number
}

export interface FlightList {
  id?: number
  fromAirport: string
  toAirport: string
  departureTime: number
  arrivalTime: number
  title: string
  activeItemIds: number[]
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface FlightState {
  currentPhase: FlightPhase
  activeFlightListId: number | null
  isCriticalPhase: boolean
}
