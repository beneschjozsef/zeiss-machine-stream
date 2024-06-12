import React, { useEffect, useState } from "react"
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import { Machine } from "../types/machine"
import { fetchMachineDetails } from "../services/apiService"

interface MachineDetailsModalProps {
  open: boolean
  machineId: string | null
  onClose: () => void
}

interface MachineEvent {
  timestamp: string
  status: string
}

interface MachineDetails extends Machine {
  events: MachineEvent[]
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
}

const MachineDetailsModal: React.FC<MachineDetailsModalProps> = ({
  open,
  machineId,
  onClose,
}) => {
  const [machineDetails, setMachineDetails] = useState<MachineDetails | null>(
    null,
  )

  useEffect(() => {
    if (machineId) {
      fetchMachineDetails(machineId).then((data) =>
        setMachineDetails(data.data),
      )
    }
  }, [machineId])

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {machineDetails ? (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              {machineDetails.machine_type.toUpperCase()}
            </Typography>
            <Typography>ID: {machineDetails.id}</Typography>
            <Typography>Floor: {machineDetails.floor}</Typography>
            <Typography>
              Last Maintenance:{" "}
              {new Date(machineDetails.last_maintenance).toLocaleString()}
            </Typography>
            <Typography>
              Install Date:{" "}
              {new Date(machineDetails.install_date).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
              Events
            </Typography>
            <List>
              {machineDetails.events.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Status: ${event.status}`}
                    secondary={`Timestamp: ${new Date(
                      event.timestamp,
                    ).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Modal>
  )
}

export default MachineDetailsModal
