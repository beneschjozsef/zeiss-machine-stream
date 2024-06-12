export interface Machine {
  id: string
  status: "idle" | "running" | "finished" | "errored"
  machine_type: string
  longitude: number
  latitude: number
  last_maintenance: string
  install_date: string
  floor: number
}
