import React from 'react'
import DashboardLayout from '../DashBoardLayout/DashboardLayout'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <DashboardLayout>
        <div id="db_container">
            <section className="stats">
                <div className="card">Daily Sales: <span>$120</span></div>
                <div className="card">Weekly Sales: <span>$5,000</span></div>
                <div className="card">Monthly Sales: <span>$8,000</span></div>
                <div className="card">Yearly Sales: <span>$12,000</span></div>
            </section>
            <section className="chart">
                <h2>Revenue Statistics</h2>
                <div className="chart-placeholder">Chart will go here</div>
            </section>
        </div>
    </DashboardLayout>
  )
}

export default Dashboard