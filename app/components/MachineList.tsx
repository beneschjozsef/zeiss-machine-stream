"use client"

import React, { useEffect, useState } from "react"
import { Container, Grid, Typography, TextField } from "@mui/material"
import MachineItem from "./MachineItem"
import MachineDetailsModal from "./MachineDetailsModal"
import { Machine } from "../types/machine"
import { Socket } from "phoenix"
import { fetchMachines } from "../services/apiService"
import styles from "./MachineList.module.css"

interface HighlightedMachine extends Machine {
  highlight: boolean
}

const MachineList: React.FC = () => {
  const [machines, setMachines] = useState<HighlightedMachine[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    // Fetch initial machine data
    fetchMachines().then((data) => {
      const machinesWithHighlight = data.data.map((machine: Machine) => ({
        ...machine,
        highlight: false,
      }))
      setMachines(machinesWithHighlight)
    })

    // Set up WebSocket connection
    const socket = new Socket(
      "wss://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/socket",
    )
    socket.connect()

    // Join the 'events' channel
    const channel = socket.channel("events", {})

    channel
      .join()
      .receive("ok", () => {
        console.log("Connected to WebSocket")
      })
      .receive("error", () => {
        console.error("Failed to connect to WebSocket")
      })

    // Handle new events
    channel.on("new", (event: any) => {
      console.log("New event received:", event)
      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine.id === event.machine_id
            ? { ...machine, status: event.status, highlight: true }
            : machine,
        ),
      )
    })

    // Clean up WebSocket connection on component unmount
    return () => {
      channel.leave()
      socket.disconnect()
    }
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleCardClick = (machineId: string) => {
    setSelectedMachineId(machineId)
  }

  const handleCloseModal = () => {
    setSelectedMachineId(null)
  }

  const filteredMachines = machines.filter(
    (machine) =>
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Container maxWidth={false} className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Machine Status
      </Typography>
      <TextField
        label="Search by ID or Status"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Grid container spacing={2}>
        {filteredMachines.map((machine) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={machine.id}>
            <MachineItem
              machine={machine}
              highlight={machine.highlight}
              onClick={() => handleCardClick(machine.id)}
            />
          </Grid>
        ))}
      </Grid>
      <MachineDetailsModal
        open={!!selectedMachineId}
        machineId={selectedMachineId}
        onClose={handleCloseModal}
      />
    </Container>
  )
}

export default MachineList
