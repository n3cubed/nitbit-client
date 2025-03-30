import Dashboard from "@/components/Dashboard/Dashboard";

export const metadata = {
  title: "Zoopboard | nitbit",
  description: "A dashboard for that looks kinda cool. For RSS feeds and more.",
};

const DashboardPage: React.FC = () => {
  return (
    <>
      <Dashboard />
    </>
  )
};

export default DashboardPage;