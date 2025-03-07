import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 800 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <header className="py-16 text-center">
        <h1 className="text-4xl font-bold">Manage Your Finances Easily</h1>
        <p className="mt-4 text-lg text-gray-400">Track your expenses, analyze trends, and grow your wealth.</p>
      </header>
      
      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">$12,500</h2>
          <p className="text-gray-400">Total Balance</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">$3,200</h2>
          <p className="text-gray-400">Monthly Income</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold">$2,100</h2>
          <p className="text-gray-400">Monthly Expenses</p>
        </div>
      </section>
      
      {/* Chart Section */}
      <section className="mt-12 px-6 md:px-20">
        <div className="chart-container">
          <h3 className="chart-title">Expense Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#CBD5E0" />
              <YAxis stroke="#CBD5E0" />
              <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#63B3ED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
