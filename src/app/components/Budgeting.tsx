import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Plus, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import budgetsData from '../../../db/budgets.json';

export default function Budgeting({ user, onLogout }) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [userBudget, setUserBudget] = useState(null);

  useEffect(() => {
    const budget = budgetsData.budgets.find(b => b.userId === user.id);
    setUserBudget(budget);
  }, [user]);

  if (!userBudget) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">Budgeting & Goals</h1>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No budget data available</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const budgetCategories = userBudget.categories || [];
  const savingsGoals = userBudget.savingsGoals || [];
  const totalBudget = userBudget.monthlyBudget;
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);

  const pieData = budgetCategories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  // Mock spending trends
  const spendingTrends = [
    { month: 'Dec', amount: totalSpent * 0.95 },
    { month: 'Jan', amount: totalSpent * 0.88 },
    { month: 'Feb', amount: totalSpent * 1.05 },
    { month: 'Mar', amount: totalSpent * 0.92 },
    { month: 'Apr', amount: totalSpent * 1.02 },
    { month: 'May', amount: totalSpent },
  ];

  const handleAddGoal = (e) => {
    e.preventDefault();
    toast.success('Savings goal created successfully');
    setShowAddGoal(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Budgeting & Goals</h1>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Monthly Budget</div>
              <div className="text-3xl font-semibold">${totalBudget.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Total Spent</div>
              <div className="text-3xl font-semibold">${totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Remaining</div>
              <div className={`text-3xl font-semibold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalBudget - totalSpent).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Budgets */}
        <Card>
          <CardHeader>
            <CardTitle>Budget by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category) => {
                const percentage = (category.spent / category.budget) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium truncate">{category.name}</span>
                        {isOverBudget && (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`font-semibold ${isOverBudget ? 'text-red-600' : ''}`}>
                          ${category.spent.toFixed(2)}
                        </span>
                        <span className="text-gray-500"> / ${category.budget}</span>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={isOverBudget ? '[&>div]:bg-red-500' : ''}
                    />
                    <div className="text-sm text-gray-500">
                      {percentage.toFixed(1)}% used
                      {isOverBudget && (
                        <span className="text-red-600 ml-2">
                          (${(category.spent - category.budget).toFixed(2)} over)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={spendingTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Savings Goals</CardTitle>
              <Button size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddGoal && (
              <form onSubmit={handleAddGoal} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input id="goal-name" placeholder="e.g., Dream Vacation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-target">Target Amount</Label>
                    <Input id="goal-target" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Create Goal</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowAddGoal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {savingsGoals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <Target className="h-5 w-5 flex-shrink-0" style={{ color: goal.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{goal.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right flex-shrink-0">
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}% complete
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(goal.target - goal.current).toLocaleString()} to go
                      </div>
                    </div>
                  </div>
                  <Progress value={percentage} />
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Add Funds
                    </Button>
                    <Button size="sm" variant="outline">Edit Goal</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
