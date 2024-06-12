import React, { useRef, useState, useEffect } from "react";
import { selectToken } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useGetUserQuery } from "../userform/accountSlice";
// import "./statistics.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AssetsBreakdown({ me }) {
  let totalAssets = me?.Assets.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <>
      <h2>Assets Breakdown</h2>
      <table className="incomeExpensesTable">
        <thead>
          <tr>
            <th className="tableSpace">Asset</th>
            <th className="tableSpace">Asset Type</th>
            <th className="tableSpace">Balance</th>
            <th className="tableSpace">Yearly Earned Interest</th>
            <th className="tableSpace">Yearly Contributions</th>
            <th className="tableSpace">Physical Or Monetary</th>
            <th className="tableSpace">Percentage Of Overall Assets</th>
          </tr>
        </thead>
        <tbody>
          {me?.Assets.map((asset, index) => (
            <tr key={index}>
              <td className="tableSpace">{asset.name}</td>
              <td className="tableSpace">{asset.assetType}</td>
              <td className="tableSpace">{asset.balance}</td>
              <td className="tableSpace">{asset.interest}</td>
              <td className="tableSpace">{asset.contributions}</td>
              <td className="tableSpace">{asset.physMon}</td>
              <td className="tableSpace">
                {((asset.balance / totalAssets) * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Your Total Assets Are: {totalAssets}</p>
    </>
  );
}

function LiabilitiesBreakdown({ me }) {
  let totalLiabilities = me?.Liabilities.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <>
      <h2>Liabilities Breakdown</h2>
      <table className="incomeExpensesTable">
        <thead>
          <tr>
            <th className="tableSpace">Liability</th>
            <th className="tableSpace">Yearly Earned Owed</th>
            <th className="tableSpace">Liability Type</th>
            <th className="tableSpace">Monthly Payment</th>
            <th className="tableSpace">Balance</th>
            <th className="tableSpace">Percentage Of Overall Liabilities</th>
          </tr>
        </thead>
        <tbody>
          {me?.Liabilities.map((liability, index) => (
            <tr key={index}>
              <td className="tableSpace">{liability.name}</td>
              <td className="tableSpace">{liability.interest}</td>
              <td className="tableSpace">{liability.liabilityType}</td>
              <td className="tableSpace">{liability.monthlyPayment}</td>
              <td className="tableSpace">{liability.amount}</td>
              <td className="tableSpace">
                {((liability.amount / totalLiabilities) * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Your Total Liabilities Are: {totalLiabilities}</p>
    </>
  );
}

function AssetsIncreasing({ me }) {
  //this function takes each asset, and shows its growth potential over the next
  //10 years taking into account contributions and interest earned on it
  function calculateAssetsOverYears() {
    //this array saves all of the assets 10 year growth arrays
    let allIncreasingAssets = [];
    for (let i = 0; i < me.Assets.length; i++) {
      // this is the current asset that will be increased 10 times based on contributions and interst
      let increasedAsset = me.Assets[i].balance;
      //this saves all 10 years worth of growth
      let currentAssetNumbers = [];
      //this loops 10 times 10 years
      for (let j = 0; j < 10; j++) {
        //this is saying if its the first year, dont add to it
        if (j === 0) {
          currentAssetNumbers.push(increasedAsset);
        } else {
          increasedAsset =
            (increasedAsset + me.Assets[i].contributions) *
            (1 + me.Assets[i].interest / 100);
          currentAssetNumbers.push(increasedAsset);
        }
      }
      allIncreasingAssets.push(currentAssetNumbers);
    }
    return allIncreasingAssets;
  }
  const assetsOverYears = calculateAssetsOverYears();

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Assets Increase Over 10 Years Including Interest Earned And Contributions",
      },
    },
  };

  const labels = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
  ];

  function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function getRandomRGBA() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * (1 - 0.5) + 0.5).toFixed(2); // Alpha value between 0.5 and 1 for better visibility
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  //this sets up the data from the assetsOverYears calculation to be in the correct format for data for charts
  function setupData() {
    let data = [];
    for (let i = 0; i < assetsOverYears.length; i++) {
      const borderColor = getRandomRGB();
      const backgroundColor = getRandomRGBA();
      let assetInfo = {
        label: me.Assets[i].name,
        data: assetsOverYears[i],
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      };
      data.push(assetInfo);
    }
    return data;
  }

  let datasetInformation = setupData();

  const data = {
    labels,
    datasets: datasetInformation,
  };
  console.log(data);

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
}

export default function AssetsLiabilities() {
  const { data: me } = useGetUserQuery();
  const token = useSelector(selectToken);
  return (
    <>
      {token ? (
        <>
          <h1>Here Is A Break Down Of Your Assets</h1>
          {me && <AssetsBreakdown me={me} />}
          {me && <LiabilitiesBreakdown me={me} />}
          {me && <AssetsIncreasing me={me} />}
        </>
      ) : (
        <p>Please Log In</p>
      )}
    </>
  );
}
