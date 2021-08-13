import { VictoryPie } from 'victory';
import { useEffect, useState } from 'react';
import { grades } from '../utils/constants';


// interest rate per grade per year;
export const LoanGradePieChart = ({ data }) => {

    const [gradeAvgData, setGradeAvgData] = useState([]);

    useEffect(() => {
        if (data) {
            const transformed =
                data.map(({ grade, _sum }) => {
                    return { x: grade, y: _sum.loan_amnt }
                })
                    .sort((a, b) => a.x.localeCompare(b.x))
            setGradeAvgData(transformed);
        }
    }, [data])

    if (!gradeAvgData) return <p>Loading</p>
    return (
        <>
            <h2>Loan Total By Grade</h2>
            <VictoryPie
                colorScale={grades.map(grade => grade.color)}
                data={gradeAvgData}
                animate={{
                    duration: 500
                }}
            >
            </VictoryPie>
        </>
    );
}