import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import "~react-vis/dist/style";
import "~react-vis/dist/styles/legends";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

  

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
  }, []);
    */

    const data = [
        {x: 1, y: 10},
        {x: 2, y: 5},
        {x: 3, y: 15}
      ];

      const data2 = [
        {x: 1, y: 8},
        {x: 2, y: 15},
        {x: 3, y: 18}
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
            {Object.keys(tasksPerStatus).map(status => (
              <li key={status}>{status}: {tasksPerStatus[status]}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Categories</h2>
          <ol>
            {categories.map(category => (
              <li key={category}>{category}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2>User Registrations Over Time</h2>
          <div>
        <XYPlot width={300} height={300}>
          <HorizontalGridLines />
          <LineSeries data={data} />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
        </div>
        <div>
          <h2>Tasks Completed Over Time</h2>
          <div>
        <XYPlot width={300} height={300}>
          <HorizontalGridLines />
          <LineSeries data={data2} />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
