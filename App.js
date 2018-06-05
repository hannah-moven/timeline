import React from "react";
import { Dimensions, StyleSheet, ScrollView } from "react-native";
import { VictoryArea, VictoryChart, VictoryTheme, VictoryScatter, VictoryBrushContainer, VictoryAxis, VictoryLine, VictoryLabel } from "victory-native";
import Data from './data/stashData'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const SCREEN_WIDTH = Dimensions.get('window').width;

let monthData = Data.monthData.map((month) => {
  let dateParsed = Date.parse(`${month.year_month}-01`)
    return {date: dateParsed, month: MONTHS[month.year_month.slice(-2)-1], balance: month.end_of_month_stash_balance}
  })

let stashData = Data.stashData.map((stashInstance) => {
  let dateParsed = Date.parse(stashInstance.date)
  return {date: dateParsed, balance: stashInstance.balance}
})

let ticks = monthData.map((month) => {
  return month.date
})

let tickValues = monthData.map((month) => {
  return month.month
})

let graphData = stashData.concat(monthData)
let xDomain = [stashData[0].date, stashData[stashData.length - 1].date]

export default class App extends React.Component {

  render() {

let verticalLines = monthData.map((month) => {
  let balance = month.balance
  return (
    <VictoryLine
    style={{
      data: {
        stroke: 'white',
        strokeWidth: 1.5
      }
    }}
    data={[
      { x: month.date, y: 0 },
      { x: month.date, y: balance }
    ]}


    />
  )
})

    return (
      <ScrollView horizontal={true} style={{ backgroundColor: '#33A5C2' }}>
        <VictoryChart width={1000} theme={VictoryTheme.material} >
          <VictoryAxis
          style={{
            tickLabels: {
              fill: 'white',
              fontSize: 16,
              fontWeight: '700',
              opacity: .7
            }
          }}
          tickValues={ticks}
          tickFormat={tickValues}
          />
          <VictoryArea style={{ data: { fill: '#217D99' } }} data={graphData} x="date" y="balance" standalone={true} />
          <VictoryLine style={{ data: {strokeWidth: 1.3, stroke: 'white' } }} data={graphData} x="date" y="balance" standalone={true} />
          {verticalLines}
          <VictoryScatter style={{ data: {fill: 'white'} }} size={2.5} data={graphData} x="date" y="balance" standalone={true} />
          <VictoryScatter style={{ data: {fill: 'white'}, labels: { fill: 'white', fontWeight: '800', fontSize: 16 } }} size={5.5} data={monthData} x="date" y="balance" standalone={true} labels={ (d) => `$${d.y}` }/>
        </VictoryChart>
      </ScrollView>
    );
  }
}
