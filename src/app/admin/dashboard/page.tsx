"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LogOut, 
  Package, 
  CheckCircle,
  TruckIcon,
  IndianRupee,
  Calendar,
  Gift,
  User,
  Heart,
  MapPin,
  Phone,
  X,
  ChevronRight,
  Search
} from "lucide-react"

interface Order {
  id: string
  customer_name: string
  phone_number: string
  address: string
  delivery_location: string | null
  delivery_date: string
  total_amount: string
  quantity: number
  status: string
  order_type: string
  sponsor_name: string | null
  sponsor_message: string | null
  package_name: string
  package_price: string
  created_at: string
  fruits?: Array<{ name: string }>
}

type OrderTypeTab = 'all' | 'self' | 'donate' | 'sponsor'

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab] = useState<OrderTypeTab>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    verifyAuth()
    fetchOrders()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify')
      const result = await response.json()

      if (!result.authenticated) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth verification error:', error)
      router.push('/admin/login')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const result = await response.json()

      if (result.success) {
        setOrders(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()

      if (result.success) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500',
      paid: 'bg-blue-500',
      packing: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    }
    return styles[status as keyof typeof styles] || 'bg-gray-500'
  }

  // Filter orders by selected date
  const filteredByDate = selectedDate === 'all' 
    ? orders 
    : orders.filter(order => {
        const orderDate = new Date(order.delivery_date).toISOString().split('T')[0]
        return orderDate === selectedDate
      })

  // Filter by search query
  const filteredBySearch = searchQuery.trim() === ''
    ? filteredByDate
    : filteredByDate.filter(order => {
        const query = searchQuery.toLowerCase().trim()
        
        // Check if search query is a number (for order ID search)
        const isNumericSearch = /^\d+$/.test(query)
        
        if (isNumericSearch) {
          // For numeric search, match order ID exactly or as substring
          return order.id === query || order.id.includes(query)
        }
        
        // For text search, search across all text fields
        return (
          order.id.includes(query) ||
          order.customer_name.toLowerCase().includes(query) ||
          order.phone_number.includes(query) ||
          order.address?.toLowerCase().includes(query) ||
          order.delivery_location?.toLowerCase().includes(query) ||
          order.package_name.toLowerCase().includes(query)
        )
      })

  // Filter by order type tab
  const filteredOrders = activeTab === 'all'
    ? filteredBySearch
    : filteredBySearch.filter(order => order.order_type === activeTab)

  // Today's orders
  const today = new Date().toISOString().split('T')[0]
  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.delivery_date).toISOString().split('T')[0]
    return orderDate === today
  })

  // Statistics
  const stats = {
    // Today's stats
    todayTotal: todaysOrders.length,
    todaySelf: todaysOrders.filter(o => o.order_type === 'self').length,
    todayDonate: todaysOrders.filter(o => o.order_type === 'donate').length,
    todaySponsor: todaysOrders.filter(o => o.order_type === 'sponsor').length,
    todayRevenue: todaysOrders.reduce((sum, o) => sum + Number.parseFloat(o.total_amount), 0),
    todayPaid: todaysOrders.filter(o => o.status === 'paid').length,
    todayPending: todaysOrders.filter(o => o.status === 'pending').length,
    todayPacking: todaysOrders.filter(o => o.status === 'packing').length,
    todayDelivered: todaysOrders.filter(o => o.status === 'delivered').length,
    
    // Selected date stats
    selectedTotal: filteredByDate.length,
    selectedSelf: filteredByDate.filter(o => o.order_type === 'self').length,
    selectedDonate: filteredByDate.filter(o => o.order_type === 'donate').length,
    selectedSponsor: filteredByDate.filter(o => o.order_type === 'sponsor').length,
    selectedRevenue: filteredByDate.reduce((sum, o) => sum + Number.parseFloat(o.total_amount), 0),
    
    // All time stats
    totalRevenue: orders.reduce((sum, o) => sum + Number.parseFloat(o.total_amount), 0),
    totalOrders: orders.length,
    totalPaid: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + Number.parseFloat(o.total_amount), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Ramzan Fresh Box</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{stats.totalOrders} orders</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">₹{stats.todayRevenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{stats.todayTotal} orders</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Confirmed payments</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Filter & Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Date Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Filter by Date:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(today)}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate('all')}
                  >
                    All
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDate === 'all' ? 'All Orders' : `Orders for ${new Date(selectedDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, Phone, Address, or Package..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Count */}
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  Found {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        {selectedDate === today && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{stats.todayPaid}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.todayPending}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Packing</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.todayPacking}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayDelivered}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order Type Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Package className="w-4 h-4" />
            All ({selectedDate === today ? stats.todayTotal : stats.selectedTotal})
          </Button>
          <Button
            variant={activeTab === 'self' ? 'default' : 'outline'}
            onClick={() => setActiveTab('self')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <User className="w-4 h-4" />
            Self ({selectedDate === today ? stats.todaySelf : stats.selectedSelf})
          </Button>
          <Button
            variant={activeTab === 'donate' ? 'default' : 'outline'}
            onClick={() => setActiveTab('donate')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            Donation ({selectedDate === today ? stats.todayDonate : stats.selectedDonate})
          </Button>
          <Button
            variant={activeTab === 'sponsor' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sponsor')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Gift className="w-4 h-4" />
            Sponsor ({selectedDate === today ? stats.todaySponsor : stats.selectedSponsor})
          </Button>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">#{order.id}</h3>
                          <Badge className={`${getStatusBadge(order.status)} text-white capitalize`}>
                            {order.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {order.order_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.delivery_date).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">₹{Number.parseFloat(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{order.quantity} × {order.package_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.phone_number}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                          {order.order_type === 'self' && order.address && (
                            <p className="text-sm text-muted-foreground">{order.address.substring(0, 60)}...</p>
                          )}
                          {(order.order_type === 'donate' || order.order_type === 'sponsor') && order.delivery_location && (
                            <p className="text-sm text-muted-foreground">{order.delivery_location}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.sponsor_name && (
                      <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium">Sponsored by: {order.sponsor_name}</p>
                        {order.sponsor_message && (
                          <p className="text-xs text-muted-foreground mt-1">{order.sponsor_message}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="packing">Packing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="whitespace-nowrap"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {selectedDate === 'all' 
                  ? 'There are no orders yet.' 
                  : `No orders for ${new Date(selectedDate).toLocaleDateString('en-IN')}`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl">Order #{selectedOrder.id}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { 
                    dateStyle: 'full' 
                  })}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Amount */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <Badge className={`${getStatusBadge(selectedOrder.status)} text-white capitalize text-base px-3 py-1`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-green-600">₹{Number.parseFloat(selectedOrder.total_amount).toFixed(2)}</p>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Package Details
                </h4>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package:</span>
                    <span className="font-medium">{selectedOrder.package_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{selectedOrder.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per box:</span>
                    <span className="font-medium">₹{Number.parseFloat(selectedOrder.package_price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Type:</span>
                    <Badge variant="outline" className="capitalize">{selectedOrder.order_type}</Badge>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h4>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedOrder.phone_number}</span>
                      <a href={`tel:${selectedOrder.phone_number}`} className="text-primary hover:underline">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  Delivery Information
                </h4>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Date:</span>
                    <span className="font-medium">
                      {new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { 
                        dateStyle: 'full' 
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Address:</span>
                    {selectedOrder.order_type === 'self' && selectedOrder.address && (
                      <p className="font-medium bg-muted/30 p-3 rounded-lg">{selectedOrder.address}</p>
                    )}
                    {(selectedOrder.order_type === 'donate' || selectedOrder.order_type === 'sponsor') && selectedOrder.delivery_location && (
                      <p className="font-medium bg-muted/30 p-3 rounded-lg">{selectedOrder.delivery_location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sponsor Details */}
              {selectedOrder.sponsor_name && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Sponsor Information
                  </h4>
                  <div className="space-y-2 pl-7">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sponsor:</span>
                      <span className="font-medium">{selectedOrder.sponsor_name}</span>
                    </div>
                    {selectedOrder.sponsor_message && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Message:</span>
                        <p className="font-medium bg-muted/30 p-3 rounded-lg italic">
                          &quot;{selectedOrder.sponsor_message}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div>
                <h4 className="font-semibold mb-3">Update Order Status</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-base font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="packing">Packing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
