import './App.css';
import { InterestRatePerMonth } from './components/InterestRatePerMonth';
import { LoanIssueTablePerState } from './components/LoanIssueTablePerState';

const App = () => (
  <div className="App">
    <InterestRatePerMonth />
    <LoanIssueTablePerState />
  </div>
);

export default App;