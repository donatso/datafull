import Store from "./src/Store/index.js";
import BasicAreaBrush from "./src/components/charts/AreaBrush/models/BasicAreaBrush/index.js"
import BasicBarChart from "./src/components/charts/BarChart/models/BasicBarChart/index.js"
import StackBarChart from "./src/components/charts/BarChart/models/StackBarChart/index.js"
import BasicPieChart from "./src/components/charts/PieChart/models/BasicPieChart/index.js"
import BasicLineChart from "./src/components/charts/LineChart/models/BasicLineChart/index.js"
import ParcelMap from "./src/components/charts/MapChart/models/ParcelMap/index.js"
import TabsView from "./src/components/elements/TabsView.js"
import Table from "./src/components/elements/Table.js"
import DataFetcher from "./src/components/elements/DataFetcher.js"
import FreeList from "./src/components/elements/FreeList.js"
import Columns from "./src/components/elements/Columns/index.js"
import helper from './src/helper/index.js'

const df = {
  Store,
  BasicAreaBrush,
  BasicBarChart,
  StackBarChart,
  BasicPieChart,
  BasicLineChart,
  ParcelMap,
  TabsView,
  Table,
  DataFetcher,
  FreeList,
  Columns,
  helper
}

if (typeof window === 'undefined') {
  global.df = df;
} else {
  window.df = df;
}

export default df;