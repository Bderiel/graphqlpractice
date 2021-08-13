import { useEffect, useState } from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";
import { LoanGradePieChart } from './LoanGradePieChart'

const getTableData = gql`query Query($groupByLoanStatsBy: [LoanStatsScalarFieldEnum!]!) {
    groupByLoanStats(by: $groupByLoanStatsBy) {
      grade
      state
      _avg {
        int_rate
        fico_high
      }
      _sum {
        loan_amnt
      }
    }
  }
  `
const useTableData = () => {
    const { loading, data } = useQuery(getTableData, {
        variables: {
            "groupByLoanStatsBy": ["state", "grade"]
        }
    })

    const [tableDataByState, setTableData] = useState(null);
    const [selectedState, setSelectedState] = useState('NY');

    useEffect(() => {
        if (!loading) {
            const transformed = data.groupByLoanStats.reduce((accum, curr) => {
                if (accum[curr.state]) {
                    accum[curr.state].push(curr)
                } else {
                    accum[curr.state] = [curr]
                }
                return accum
            }, {});

            setTableData(transformed);
        }
    }, [loading, data]);

    const handleStateSelect = (evt) => setSelectedState(evt.target.value);

    return { tableDataByState, selectedState, handleStateSelect };
}

export const LoanIssueTablePerState = () => {
    const { tableDataByState, selectedState, handleStateSelect } = useTableData();

    if (!tableDataByState) return <p>Loading</p>
    const sortedTableData = tableDataByState[selectedState].sort((a, b) => a.grade.localeCompare(b.grade));
    return <>
        <h2>Select State</h2>
        <select onChange={handleStateSelect}>
            {
                Object.keys(tableDataByState).map(state => <option key={state} value={state}>{state}</option>)
            }
        </select>
        <table style={{ width: '50%' }} >
            <thead>
                <tr>
                    <th>Grade</th>
                    <th>Avg Int Rate</th>
                    <th>Avg FICO Score</th>
                    <th>Total Loan Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    sortedTableData.map(data => {
                        return <tr key={data.grade}>
                            <td>{data.grade}</td>
                            <td>{parseFloat(data._avg.int_rate).toFixed(2)}%</td>
                            <td>{parseInt(data._avg.fico_high)}</td>
                            <td>${parseInt(data._sum.loan_amnt)}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        <LoanGradePieChart data={sortedTableData} />
    </>
}
