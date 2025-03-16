"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bell, Globe, User, CreditCard, Lock, Languages, Smartphone } from "lucide-react"

export default function SettingsPage() {
  const [language, setLanguage] = useState("english")
  const [currency, setCurrency] = useState("usd")
  const [distanceUnit, setDistanceUnit] = useState("km")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tripReminders: true,
    marketing: false,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="preferences" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="preferences">
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Customize your language and regional preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="cad">CAD ($)</SelectItem>
                      <SelectItem value="aud">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Distance Unit</Label>
                <RadioGroup value={distanceUnit} onValueChange={setDistanceUnit} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="km" id="km" />
                    <Label htmlFor="km">Kilometers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="miles" id="miles" />
                    <Label htmlFor="miles">Miles</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
              <CardDescription>Set your default travel preferences for itinerary generation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="travel-pace">Default Travel Pace</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger id="travel-pace" className="w-full">
                    <SelectValue placeholder="Select pace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed (fewer activities per day)</SelectItem>
                    <SelectItem value="moderate">Moderate (balanced pace)</SelectItem>
                    <SelectItem value="intensive">Intensive (many activities per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodation-type">Preferred Accommodation Type</Label>
                <Select defaultValue="hotel">
                  <SelectTrigger id="accommodation-type" className="w-full">
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotels</SelectItem>
                    <SelectItem value="hostel">Hostels</SelectItem>
                    <SelectItem value="apartment">Apartments/Vacation Rentals</SelectItem>
                    <SelectItem value="resort">Resorts</SelectItem>
                    <SelectItem value="boutique">Boutique Hotels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportation-mode">Preferred Transportation Mode</Label>
                <Select defaultValue="public">
                  <SelectTrigger id="transportation-mode" className="w-full">
                    <SelectValue placeholder="Select transportation mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Transportation</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="car">Car Rental</SelectItem>
                    <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive trip updates and reminders via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trip-reminders">Trip Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming trips and activities</p>
                  </div>
                  <Switch
                    id="trip-reminders"
                    checked={notifications.tripReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, tripReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-notifications">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Schedule</CardTitle>
              <CardDescription>Set when you want to receive trip reminders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pre-Trip Reminders</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-1-week" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="reminder-1-week">1 week before trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-3-days" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="reminder-3-days">3 days before trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-1-day" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="reminder-1-day">1 day before trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-day-of" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="reminder-day-of">Day of trip</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Daily Activity Reminders</Label>
                <Select defaultValue="morning">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                    <SelectItem value="evening-before">Evening before (8:00 PM)</SelectItem>
                    <SelectItem value="both">Both morning and evening</SelectItem>
                    <SelectItem value="none">No daily reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country/Region</Label>
                  <Select defaultValue="us">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Setup
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>Manage devices that are connected to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <p className="text-sm text-muted-foreground">Last active: Today, 10:24 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome on MacBook Pro</p>
                      <p className="text-sm text-muted-foreground">Last active: Today, 9:41 AM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground">$9.99/month, billed monthly</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Next billing date: June 15, 2025</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-red-500 hover:text-red-600">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">Add Payment Method</Button>
                <Button variant="outline">Edit Default Payment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payment history.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">May 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Download
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">April 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Download
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">March 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Invoices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

