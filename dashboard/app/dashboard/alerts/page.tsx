"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  Search, 
  Bell, 
  Filter, 
  MoreVertical,
  Shield,
  MapPin,
  Clock,
  User
} from "lucide-react"

interface SafetyAlert {
  id: string
  personId: string
  location: string
  alertType: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  timestamp: string
}

const mockSafetyAlerts: SafetyAlert[] = [
  {
    id: '1',
    personId: 'P001',
    location: 'Main Entrance',
    alertType: 'Low',
    description: 'Unidentified person detected',
    timestamp: '2023-07-10T09:15:00Z'
  },
  {
    id: '2',
    personId: 'P002',
    location: 'Parking Lot B',
    alertType: 'Medium',
    description: 'Suspicious behavior observed',
    timestamp: '2023-07-10T10:30:00Z'
  },
  {
    id: '3',
    personId: 'P003',
    location: 'Server Room',
    alertType: 'High',
    description: 'Unauthorized access attempt',
    timestamp: '2023-07-10T11:45:00Z'
  },
  {
    id: '4',
    personId: 'P004',
    location: 'Emergency Exit',
    alertType: 'Critical',
    description: 'Fire alarm triggered',
    timestamp: '2023-07-10T12:00:00Z'
  },
  {
    id: '5',
    personId: 'P005',
    location: 'Reception Area',
    alertType: 'Low',
    description: 'Tailgating detected',
    timestamp: '2023-07-10T13:15:00Z'
  }
]

const alertTypeConfig = {
  Low: {
    color: 'bg-green-100 text-green-700 hover:bg-green-200',
    icon: Shield,
    pulseColor: 'bg-green-500'
  },
  Medium: {
    color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    icon: Bell,
    pulseColor: 'bg-yellow-500'
  },
  High: {
    color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    icon: AlertCircle,
    pulseColor: 'bg-orange-500'
  },
  Critical: {
    color: 'bg-red-100 text-red-700 hover:bg-red-200',
    icon: AlertCircle,
    pulseColor: 'bg-red-500'
  }
}

export default function SafetyAlertsTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className="bg-white m-14 border-gray-200">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Real-Time Safety Alerts
              <Badge variant="secondary" className="ml-2">Live</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Monitoring and tracking security incidents across all locations
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search alerts..."
                className="pl-8 bg-white border-gray-300 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white border-gray-300 text-gray-700">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-gray-200">
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Person ID</TableHead>
                <TableHead className="text-gray-600">Location</TableHead>
                <TableHead className="text-gray-600">Description</TableHead>
                <TableHead className="text-gray-600">Time</TableHead>
                <TableHead className="text-gray-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSafetyAlerts.map((alert) => {
                const AlertIcon = alertTypeConfig[alert.alertType].icon
                return (
                  <TableRow 
                    key={alert.id}
                    className="border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className={`w-2 h-2 rounded-full ${alertTypeConfig[alert.alertType].pulseColor} animate-pulse`} />
                          <div className={`absolute -inset-1 ${alertTypeConfig[alert.alertType].pulseColor} opacity-20 rounded-full animate-ping`} />
                        </div>
                        <Badge className={`${alertTypeConfig[alert.alertType].color}`}>
                          <AlertIcon className="w-3 h-3 mr-1" />
                          {alert.alertType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{alert.personId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{alert.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <span className="text-gray-900">{alert.description}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}