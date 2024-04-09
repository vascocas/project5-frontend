import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [validatedUsers, setValidatedUsers] = useState(0);
  const [nonValidatedUsers, setNonValidatedUsers] = useState(0);
  const [averageTasksPerUser, setAverageTasksPerUser] = useState(0);
  const [tasksPerStatus, setTasksPerStatus] = useState({});
  const [categories, setCategories] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [tasksCompletedOverTime, setTasksCompletedOverTime] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    /*
    const fetchData = async () => {
      try {
        //http requests
        let usersResponse;
        let tasksResponse;
        let categoriesResponse;
        let userRegistrationsResponse;
        let tasksCompletedResponse;

        // Calculate dashboard metrics
        setTotalUsers(usersResponse.data.totalUsers);
        setValidatedUsers(usersResponse.data.validatedUsers);
        setNonValidatedUsers(usersResponse.data.nonValidatedUsers);
        setAverageTasksPerUser(tasksResponse.data.averageTasksPerUser);
        setTasksPerStatus(tasksResponse.data.tasksPerStatus);
        setCategories(categoriesResponse.data.categories);
        setUserRegistrations(userRegistrationsResponse.data.userRegistrations);
        setTasksCompletedOverTime(tasksCompletedResponse.data.tasksCompletedOverTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

       fetchData();
       */
  }, []);

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const data2 = [
    { x: 1, y: 8 },
    { x: 2, y: 15 },
    { x: 3, y: 18 },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div>
        <p>Total Users: {totalUsers}</p>
        <p>Validated Users: {validatedUsers}</p>
        <p>Non-Validated Users: {nonValidatedUsers}</p>
        <p>Average Tasks per User: {averageTasksPerUser}</p>
        <div>
          <h2>Tasks per Status</h2>
          <ul>
            {Object.keys(tasksPerStatus).map((status) => (
              <li key={status}>
                {status}: {tasksPerStatus[status]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Categories</h2>
          <ol>
            {categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2>User Registrations Over Time</h2>
          <div>
            <LineChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
        <div>
          <h2>Tasks Completed Over Time</h2>
          <div>
            <ScatterChart
              width={400}
              height={400}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x" />
              <YAxis type="number" dataKey="y" name="y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A Scatter Plot" data={data2} fill="#8884d8" />
            </ScatterChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
