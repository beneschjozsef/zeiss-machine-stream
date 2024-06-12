import React, { useEffect, useState } from "react"
import { Card, CardContent, Typography, Chip } from "@mui/material"
import { Machine } from "../types/machine"
import styles from "./MachineItem.module.css"

const statusColors = {
  idle: "default",
  running: "primary",
  finished: "success",
  errored: "error",
} as const

interface MachineItemProps {
  machine: Machine
  highlight: boolean
  onClick: () => void
}

const MachineItem: React.FC<MachineItemProps> = ({
  machine,
  highlight,
  onClick,
}) => {
  const [highlighted, setHighlighted] = useState(highlight)

  useEffect(() => {
    if (highlight) {
      setHighlighted(true)
      const timer = setTimeout(() => setHighlighted(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [highlight])

  return (
    <Card
      className={`${styles.card} ${highlighted ? styles.highlight : ""}`}
      onClick={onClick}
    >
      <CardContent className={styles["card-content"]}>
        <Typography variant="h6">
          {machine.machine_type.toUpperCase()}
        </Typography>
        <Typography>{machine.id}</Typography>
        <Typography>Floor: {machine.floor}</Typography>
        <Typography>
          Last Maintenance:{" "}
          {new Date(machine.last_maintenance).toLocaleString()}
        </Typography>

        <Chip
          label={machine.status}
          color={statusColors[machine.status]}
          variant="outlined"
          sx={{ fontSize: "1rem", height: "32px", marginTop: "10px" }}
        />
      </CardContent>
    </Card>
  )
}

export default MachineItem
