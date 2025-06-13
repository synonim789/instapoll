import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Poll } from '../types'

type Props = {
  poll: Poll
}

const PollBarChart = ({ poll }: Props) => {
  console.log(poll)

  const data = poll.options.map((option) => ({
    name: option.text,
    votes: option.votes,
    percent: poll.totalVotes
      ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
      : '0',
  }))
  return (
    <ResponsiveContainer width="100%" height={40 * data.length}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 60, left: 80, bottom: 10 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 14 }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === 'votes') return [`${value} votes`, 'Votes']
            if (name === 'percent') return [`${value}%`, 'Percent']
            return value
          }}
        />
        <Bar dataKey="votes" fill="oklch(62.7% 0.265 303.9)">
          <LabelList
            dataKey="percent"
            position="right"
            formatter={(value: number) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
export default PollBarChart
