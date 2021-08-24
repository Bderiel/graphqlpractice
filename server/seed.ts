import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { LoanStats } from '@prisma/client';
import prisma from './libs/prisma';


export function seedDB() {
    const results = [];
    const set = new Set();
    createReadStream('./input.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const transfromed: Partial<LoanStats>[] = results.map(data => {
                const { grade, addr_state, issue_d, fico_range_low, fico_range_high, int_rate, loan_amnt } = data;

                return {
                    state: addr_state,
                    grade,
                    fico_low: Number(fico_range_low),
                    fico_high: Number(fico_range_high),
                    int_rate: parseFloat(int_rate) as any,
                    issue_d,
                    loan_amnt: Number(loan_amnt)
                }
            })
            await prisma.loanStats.createMany({
                data: transfromed
            })
            console.log('done')
        });

}

seedDB();