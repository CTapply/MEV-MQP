import { AreaChart } from 'recharts';


class AreaChartImpl extends AreaChart {

  constructor(props) {
    super(props);
    //console.log(this.state)
  }
  
  componentDidMount() {
    // document.getElementById('timeline-chart').addEventListener('wheel', (e) => {
    //   if (e.deltaY > 0) {
    //     this.setState({ dataStartIndex: this.state.dataStartIndex + 1 });
    //     this.setState({ dataEndIndex: this.state.dataEndIndex + 1 });
    //   } else if (e.deltaY < 0) {
    //     if (this.state.dataStartIndex > 0) {
    //       console.log(e)
    //       this.setState({ dataStartIndex: this.state.dataStartIndex - 1 });
    //       this.setState({ dataEndIndex: this.state.dataEndIndex - 1 });
    //     }
    //   } else {
    //     console.log('Delta is 0');
    //     console.log(this.state)
    //   }
    //   e.preventDefault();
    // }, true);
  }

}

export default AreaChartImpl;
