import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Budgeting({ user, onLogout }) {
  const data = [
    { name: 'Equities', value: 4500000 },
    { name: 'Real Estate', value: 3200000 },
    { name: 'Fixed Income', value: 2100000 },
    { name: 'Cash', value: 1250000 },
    { name: 'Alternatives', value: 1450000 },
  ];

  const COLORS = ['#cca858', '#4b5563', '#1e1e24', '#71717a', '#a1a1aa'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Wealth Allocation</h1>
          <p className="text-gray-400">Macro overview of your global portfolio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
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
                {data.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{item.name}</span>
                      <span className="text-gray-400">{((item.value / 12500000) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#0a0a0c] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${(item.value / 12500000) * 100}%`, backgroundColor: COLORS[index] }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}