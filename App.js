import React from "react";
import { Dimensions, StyleSheet, ScrollView } from "react-native";
import { VictoryArea, VictoryChart, VictoryTheme, VictoryScatter, VictoryBrushContainer, VictoryAxis, VictoryLine, VictoryLabel } from "victory-native";
import Data from './data/stashData'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const SCREEN_WIDTH = Dimensions.get('window').width;

//pulling data in from the JSON file and mapping it as an array of objects where each object is a 'month'
//and has the date of the first of the month parsed in miliseconds, the name of the month that time represents,
//and the balance for that month
let monthData = Data.monthData.map((month) => {
  let dateParsed = Date.parse(`${month.year_month}-01`)
    return {date: dateParsed, month: MONTHS[month.year_month.slice(-2)-1], balance: month.end_of_month_stash_balance}
  });


//pulling data from the json object for the individual instances of stashing; returning an array of objects where
//each object is the date of the transaction parsed to milliseconds and the balance after the stash
let stashData = Data.stashData.map((stashInstance) => {
  let dateParsed = Date.parse(stashInstance.date)
  return {date: dateParsed, balance: stashInstance.balance}
});

//mapping over the array created in lines 13-16 to return an arry of just parsed times to tell victory where the ticks should be
let ticks = monthData.map((month) => {
  return month.date
});

//mapping over the array created in lines 13-16 to return the month names in the proper order to match up with the data points
let tickValues = monthData.map((month) => {
  return month.month
});

//combined array of the month data array and the stash data array
let graphData = stashData.concat(monthData);

//setting the x domain for the graph from the first instance of a stash to the last
let xDomain = [stashData[0].date, stashData[stashData.length - 1].date];

export default class App extends React.Component {
  render() {
    // creates an array of VictoryLines that are the vertical white lines for each month (mainly a cosmetic thing)
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
    });

    return (
      <ScrollView horizontal={true} style={{ backgroundColor: '#33A5C2' }}>
      //wrapper for the chart
        <VictoryChart width={1000} theme={VictoryTheme.material} >
        //sets the tick values and names on the x axis
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
          //creates the area chart using data from each month and from each satsh instance
          <VictoryArea
            style={{
              data: { fill: '#217D99' }
            }}
            data={graphData}
            x="date"
            y="balance"
            standalone={true}
          />
          //draws the line along the top of the area chart
          <VictoryLine
            style={{
              data: {
                strokeWidth: 1.3,
                stroke: 'white'
              }
            }}
            data={graphData}
            x="date"
            y="balance"
            standalone={true}
          />
          //renders the vertical lines
          {verticalLines}
          //Scattter plot of all stash instances
          <VictoryScatter
            style={{
              data: {fill: 'white'}
            }}
            size={2.5}
            data={graphData}
            x="date"
            y="balance"
            standalone={true}
          />
          //scatter plot of larger dots to represent end of month balances w/labels
          <VictoryScatter
            style={{
              data: {fill: 'white'},
              labels: { fill: 'white',
              fontWeight: '800',
              fontSize: 16 }
            }}
            size={5.5}
            data={monthData}
            x="date"
            y="balance"
            standalone={true}
            labels={ (d) => `$${d.y}` }
          />
        </VictoryChart>
      </ScrollView>
    );
  };
};
