// Simple working version without any complex exports
const useDashboardData = () => {
  return {
    totalLeads: 0,
    hotLeads: 0,
    recentLeads: [],
    conversionRate: 0,
    pipelineValue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    pendingOffers: 0,
    recentOffers: [],
    todayTasks: [],
    todayMeetings: 0,
    upcomingReminders: [],
    meetings: [],
    todos: [],
    upcomingMeetings: [],
    completedTodos: 0,
    pendingTodos: 0,
    totalTodos: 0,
    recentActivities: []
  }
}

module.exports = { useDashboardData }
