import { AreaChart } from 'recharts';


class AreaChartImpl extends AreaChart {
  constructor(props) {
    super(props);
    console.log(this.state);
  }

  componentDidMount() {
  }

}

export default AreaChartImpl;
