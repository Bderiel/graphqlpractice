import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from 'victory';
import { useEffect, useState } from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";
import { grades } from '../utils/constants';

const getInterestRatesMonth = gql`
query Query($groupByLoanStatsBy: [LoanStatsScalarFieldEnum!]!) {
  groupByLoanStats(by: $groupByLoanStatsBy) {
    grade
    issue_d
    _avg {
      int_rate
    }
  }
}
`;

const useGradeChartState = () => {
    const { loading, data } = useQuery(getInterestRatesMonth, {
        variables: {
            "groupByLoanStatsBy": ["issue_d", "grade"]
        }
    });

    const [gradeChartData, setgradeChart] = useState(null);
    const [toggleStates, setToggleStates] = useState(null);

    useEffect(() => {
        if (!loading) {
            const { gradeData, toggleStates } = data.groupByLoanStats.reduce((accum, curr) => {
                const { gradeData, toggleStates } = accum;
                if (gradeData[curr.grade]) {
                    gradeData[curr.grade].push({
                        x: curr.issue_d,
                        y: Number(curr._avg.int_rate)
                    })
                } else {
                    gradeData[curr.grade] = [{
                        x: curr.issue_d,
                        y: Number(curr._avg.int_rate)
                    }]
                    toggleStates[curr.grade] = true;
                }
                return accum
            }, { toggleStates: {}, gradeData: {} });
            setToggleStates(toggleStates);
            setgradeChart(gradeData);
        }
    }, [loading, data]);

    const handleToggle = (grade) => setToggleStates((prev) => ({ ...prev, [grade]: !prev[grade] }));


    return { gradeChartData, toggleStates, handleToggle };
}

// interest rate per grade per year;
export const InterestRatePerMonth = () => {
    const { gradeChartData, toggleStates, handleToggle } = useGradeChartState();

    if (!gradeChartData) return <p>Loading</p>
    return (
        <>
            <h2>Click to Toggle Grades</h2>
            <div className="container__toggle">
                {
                    grades.map(({ grade, color }) => {
                        return <button key={grade} className={`toggle-button ${!toggleStates[grade] ? 'off' : ''}`} style={{ background: color }} onClick={() => handleToggle(grade)}>{grade}</button>
                    })
                }
            </div>
            <VictoryChart
                theme={VictoryTheme.material}
                maxDomain={{ y: 35 }}
                minDomain={{ y: 0 }}
            >
                {
                    grades.map(({ grade, color }) => {
                        if (!toggleStates[grade]) return null;
                        return <VictoryLine
                            key={grade}
                            style={{
                                data: { stroke: color },
                                parent: { border: "1px solid #ccc" }
                            }}
                            data={
                                gradeChartData[grade].sort((a, b) => b.x.localeCompare(a.x))
                            }
                        />
                    })
                }
                <VictoryAxis
                    label="Month"
                    style={{
                        axisLabel: { padding: 30 }
                    }}
                />
                <VictoryAxis dependentAxis
                    label="Interest Rate"
                    style={{
                        axisLabel: { padding: 40 }
                    }}
                />
            </VictoryChart>
        </>
    );
}