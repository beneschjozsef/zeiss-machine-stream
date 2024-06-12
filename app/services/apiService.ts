const API_BASE_URL =
  "https://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io"

export const fetchMachines = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/machines`)
  if (!response.ok) {
    throw new Error("Failed to fetch machines")
  }
  return response.json()
}

export const fetchMachineDetails = async (machineId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/machines/${machineId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch machine details for ID ${machineId}`)
  }
  return response.json()
}
