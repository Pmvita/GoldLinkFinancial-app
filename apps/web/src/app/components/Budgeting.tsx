import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import budgetsData from '../../../../../db/budgets.json';

type ChartDatum = {
  name: string;
  value: number;
  budget: number;
  color: string;
};

// Fallback palette matching the original aesthetic when a category record omits its color
const fallbackColors = ['#cca858', '#4b5563', '#1e1e24', '#71717a', '#a1a1aa', '#d97706', '#06b6d4'];

export default function Budgeting({ user, onLogout }) {
  const [data, setData] = useState<ChartDatum[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

  useEffect(() => {
    const userBudget = budgetsData.budgets.find(b => b.userId === user.id);
    if (userBudget) {
      // Adapter: recharts <Pie> consumes {name, value}; we keep `budget` and `color`
      // alongside so the right-hand Target Allocation card can render bars without
      // a second pass over the JSON.
      const adapted: ChartDatum[] = userBudget.categories.map((c, i) => ({
        name: c.name,
        value: c.spent,
        budget: c.budget,
        color: c.color || fallbackColors[i % fallbackColors.length],
      }));
      setData(adapted);
      setMonthlyBudget(userBudget.monthlyBudget);
    } else {
      // TODO: backfill a `budgets` entry for new users in db/budgets.json
      setData([]);
      setMonthlyBudget(0);
    }
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const totalForPct = monthlyBudget || data.reduce((s, d) => s + (d.budget || d.value || 0), 0) || 1;

  return (
    <Layout user={user} onLogout={onLogout}>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Wealth Allocation</h1>
          <p className="text-gray-400">Macro overview of your global portfolio.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#121217] border-[#27272a] h-[500px]">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Asset Distribution</CardTitle>
                <CardDescription className="text-gray-400">Current allocation across all connected accounts.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || fallbackColors[index % fallbackColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#121217', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#cca858' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#121217] border-[#27272a]">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Target Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.length === 0 && (
                  <p className="text-sm text-gray-500">No budget categories configured.</p>
                )}
                {data.map((item, index) => {
                  const pct = (item.value / totalForPct) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{item.name}</span>
                        <span className="text-gray-400">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#0a0a0c] rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: item.color || fallbackColors[index % fallbackColors.length] }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
